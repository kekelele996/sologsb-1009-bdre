// 端到端验证机构回执对账逻辑
import { build } from "esbuild";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import assert from "node:assert/strict";

// ---- DOM / 浏览器 API 打桩 ----
const fakeApp = {
  addEventListener() {},
  querySelector() { return null; },
  querySelectorAll() { return []; },
  innerHTML: "",
  dataset: {},
};
globalThis.document = {
  querySelector: () => fakeApp,
  documentElement: { dataset: {} },
  createElement: () => ({ click() {}, style: {} }),
};
globalThis.window = { addEventListener() {}, clearTimeout() {}, setTimeout: () => 0 };
globalThis.navigator = { onLine: true };
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, v),
};
globalThis.URL = { createObjectURL: () => "blob:x", revokeObjectURL() {} };
globalThis.Blob = class {};
globalThis.CSS = { escape: (s) => s };

writeFileSync("test-empty.mjs", "export default {};");
await build({
  entryPoints: ["src/scripts/editor.ts"],
  bundle: true,
  format: "esm",
  platform: "browser",
  outfile: "test-bundle.mjs",
  alias: { "@shoelace-style/shoelace/dist/shoelace.js": "./test-empty.mjs" },
  logLevel: "silent",
});

const footer = `
globalThis.__api = {
  createSeedProject, analyze, parseReceiptText, normalizeVerdict,
  ingestReceiptRows, retryReceiptItem, resetBlockDefectReviews,
  syncBlockSelfReview, exportHtml, batchStats, buildReceiptTemplate, buildSampleReceipt,
};
`;
writeFileSync("test-bundle.mjs", readFileSync("test-bundle.mjs", "utf8") + footer);

await import("./test-bundle.mjs");
const api = globalThis.__api;
let pass = 0;
const ok = (name, cond) => { assert.ok(cond, name); pass++; console.log("  ✓", name); };

// ---------- 1. 解析回执 ----------
{
  const csv = "缺陷编号,结论,批注\nsentence-block-p1-0,通过,拆句清楚\nimage-block-img，不通过，替代文本不足\n# 注释行\n\nbad-row,同意,x";
  const parsed = api.parseReceiptText(csv);
  assert.equal(parsed.length, 3, "应解析出 3 行（忽略注释与空行）");
  assert.deepEqual(parsed[0], { issueKey: "sentence-block-p1-0", verdictRaw: "通过", note: "拆句清楚" });
  assert.deepEqual(parsed[1], { issueKey: "image-block-img", verdictRaw: "不通过", note: "替代文本不足" });
  assert.equal(api.normalizeVerdict(parsed[2].verdictRaw), "");
  assert.equal(api.normalizeVerdict("FAIL"), "fail");
  assert.equal(api.normalizeVerdict("合格"), "pass");
  console.log("1. 回执解析（表头/中英逗号/无法识别结论）");
  ok("中文逗号也能分列", true);
  ok("未知结论留给逐行重试", true);
}

// ---------- 2. 示例回执首轮对账 ----------
let project = api.createSeedProject();
const seedIssues = api.analyze(project);
const sampleRows = api.parseReceiptText(api.buildSampleReceipt(project));
const issueCounts = new Map();
for (const i of seedIssues) issueCounts.set(i.blockId, (issueCounts.get(i.blockId) ?? 0) + 1);
const imageIssue = seedIssues.find((i) => i.type === "image");
const loneSentenceIssue = seedIssues.find((i) => i.type === "sentence" && issueCounts.get(i.blockId) === 1);
const glossaryIssue = seedIssues.find((i) => i.type === "glossary" && i.blockId !== loneSentenceIssue?.blockId);
let batch = { id: "batch-1", agency: "机构甲", round: "第 1 轮", receivedAt: new Date().toISOString(), importedAt: new Date().toISOString(), items: [] };
const result = api.ingestReceiptRows(project, batch, sampleRows, new Set());
console.log("2. 首轮对账");
ok(`对上 3 条（实际 ${result.matched}）`, result.matched === 3);
ok(`2 条失败待重试（实际 ${result.failed}）`, result.failed === 2);

const blockImg = project.blocks.find((b) => b.id === imageIssue.blockId);
const blockLone = project.blocks.find((b) => b.id === loneSentenceIssue.blockId);
const blockMixed = project.blocks.find((b) => b.id === glossaryIssue.blockId);
ok("机构判不通过 → 对应块退回需修改", blockImg.reviewStatus === "needs-work");
ok("机构刚判通过、且是该块唯一缺陷 → 整块转已通过", blockLone.reviewStatus === "approved");
ok("术语条通过但同块还有未提及条目 → 整块保持待审核", blockMixed.reviewStatus === "pending");

const loneRecord = project.defectReviews.find((r) => r.issueKey === loneSentenceIssue.id);
ok("通过台账记录来自机构且为 approved", loneRecord.via === "agency" && loneRecord.status === "approved");
ok("机构批注原样进了台账", /短句拆分清楚/.test(loneRecord.note));
ok("图片块原改写原因不被机构结论改写", blockImg.changeReason === "");

const bad1 = batch.items.find((i) => !i.matched && /没有这个缺陷编号/.test(i.error ?? ""));
const bad2 = batch.items.find((i) => !i.matched && /结论无法识别/.test(i.error ?? ""));
ok("坏行 1 报编号不存在", !!bad1);
ok("坏行 2 报结论无法识别", !!bad2);

// ---------- 3. 逐条重试 ----------
console.log("3. 逐条重试失败条目");
const otherIssue = seedIssues.find((i) => i.blockId === blockMixed.id && i.id !== glossaryIssue.id);
bad1.issueKey = otherIssue.id;
bad1.verdictRaw = "通过";
api.retryReceiptItem(project, batch, bad1);
ok("修正编号后该条对上", bad1.matched === true);
ok("混合块所有缺陷均通过 → 整块转已通过", blockMixed.reviewStatus === "approved");

bad2.issueKey = imageIssue.id;
bad2.verdictRaw = "同意";
api.retryReceiptItem(project, batch, bad2);
ok("编号对了但结论仍无法识别 → 继续失败", bad2.matched === false);
bad2.verdictRaw = "不通过";
api.retryReceiptItem(project, batch, bad2);
ok("结论改正后对上", bad2.matched === true);
ok("图片块仍是需修改", blockImg.reviewStatus === "needs-work");

// ---------- 4. 补传：只补未对上的 ----------
console.log("4. 补传回执只补未对上的");
let project2 = api.createSeedProject();
let batch2 = { id: "b2", agency: "甲", round: "第1轮", receivedAt: new Date().toISOString(), importedAt: new Date().toISOString(), items: [] };
api.ingestReceiptRows(project2, batch2, api.parseReceiptText(`${imageIssue.id},不通过,n1\nghost-x,通过,n2`), new Set());
assert.equal(batch2.items.filter((i) => i.matched).length, 1);
assert.equal(batch2.items.filter((i) => !i.matched).length, 1);
const supplement = api.parseReceiptText(`${imageIssue.id},通过,旧条目重复应跳过\nghost-x,通过,坏行修正后仍是幽灵编号\n${loneSentenceIssue.id},通过,新对上的`);
const matchedKeys = new Set(batch2.items.filter((i) => i.matched).map((i) => i.issueKey));
batch2.items = batch2.items.filter((i) => i.matched); // 界面逻辑：重试前先丢掉坏行
const r2 = api.ingestReceiptRows(project2, batch2, supplement, matchedKeys);
ok(`补传跳过 1 条已对上（实际 ${r2.skipped}）`, r2.skipped === 1);
ok(`补传新对上 1 条（实际 ${r2.matched}）`, r2.matched === 1);
ok(`补传仍失败 1 条（实际 ${r2.failed}）`, r2.failed === 1);
const oldItem = batch2.items.find((i) => i.issueKey === imageIssue.id);
ok("旧条目机构结论不被补传覆盖（仍是不通过/n1）", oldItem.verdict === "fail" && /n1/.test(oldItem.note));

// ---------- 5. 编辑改写后的双份隔离 ----------
console.log("5. 编辑改写后的双份隔离");
const beforeBatchCount = batch.items.length;
blockLone.accessibleText = blockLone.accessibleText + "（补充说明）";
api.resetBlockDefectReviews(project, blockLone.id);
const loneAfterEdit = project.defectReviews.find((r) => r.issueKey === loneSentenceIssue.id);
ok("改写后该缺陷工作台台账回到待复核", loneAfterEdit.status === "pending");
ok("机构回执存档条目数量不变", batch.items.length === beforeBatchCount);
ok("机构批注仍在回执里", batch.items.some((i) => /短句拆分清楚/.test(i.note)));
api.syncBlockSelfReview(project, blockLone.id, "approved");
ok("工作台手动通过后整块为已通过", blockLone.reviewStatus === "approved");

// ---------- 6. 新一轮机构不通过可推翻旧通过 ----------
console.log("6. 新一轮回执覆盖工作台状态（按最新对账）");
let project3 = api.createSeedProject();
const imgKey = api.analyze(project3).find((i) => i.type === "image").id;
let bA = { id: "A", agency: "甲", round: "第1轮", receivedAt: new Date().toISOString(), importedAt: new Date().toISOString(), items: [] };
api.ingestReceiptRows(project3, bA, api.parseReceiptText(`${imgKey},通过,首轮通过`), new Set());
ok("首轮图片块唯一缺陷通过 → 已通过", project3.blocks.find((b) => b.id === "block-img").reviewStatus === "approved");
let bB = { id: "B", agency: "甲", round: "第2轮", receivedAt: new Date().toISOString(), importedAt: new Date().toISOString(), items: [] };
api.ingestReceiptRows(project3, bB, api.parseReceiptText(`${imgKey},不通过,替代文本仍读不出图中环节`), new Set());
ok("二轮不通过 → 图片块退回重做", project3.blocks.find((b) => b.id === "block-img").reviewStatus === "needs-work");
const imgRec3 = project3.defectReviews.find((r) => r.issueKey === imgKey);
ok("工作台台账更新为最新不通过、指向新批次", imgRec3.status === "needs-work" && imgRec3.batchId === "B");
ok("首轮机构那份仍保留通过结论", bA.items[0].verdict === "pass");

// ---------- 7. 导出 HTML 带复核结论 ----------
console.log("7. 导出无障碍版本包含本批复核结论");
project3.batches = [bB, bA];
const html = api.exportHtml(project3);
ok("含“外部无障碍机构复核结论”章节", html.includes("外部无障碍机构复核结论"));
ok("导出取最新一批（第2轮）", html.includes("第2轮"));
ok("含不通过条目与退回说明", html.includes("不通过（退回工作台重做）"));
ok("含机构批注原文", html.includes("替代文本仍读不出图中环节"));
ok("不泄露上一轮的首轮批注", !html.includes("首轮通过"));
ok("正文仍含跳转链接与 lang", html.includes('href="#main"') && html.includes('lang="zh-CN"'));
const htmlNoBatch = api.exportHtml(api.createSeedProject());
ok("从未导入回执时导出正常、不含复核章节", !htmlNoBatch.includes("外部无障碍机构复核结论"));

// ---------- 8. 回执模板 ----------
console.log("8. 空白回执模板");
const tpl = api.buildReceiptTemplate(api.createSeedProject());
ok("模板含表头与真实缺陷编号", tpl.includes("缺陷编号") && tpl.includes("image-block-img") && tpl.includes("复核结论"));

rmSync("test-bundle.mjs", { force: true });
rmSync("test-empty.mjs", { force: true });
rmSync("test-shims.mjs", { force: true });

console.log(`\n全部 ${pass} 项断言通过。`);
