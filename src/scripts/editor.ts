import "@shoelace-style/shoelace/dist/shoelace.js";

type BlockType = "heading" | "paragraph" | "image" | "link";
type ReviewStatus = "pending" | "approved" | "needs-work";
type Severity = "error" | "warning" | "info";

interface CommentReply {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

interface CommentItem {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  resolved: boolean;
  replies: CommentReply[];
}

interface ContentBlock {
  id: string;
  type: BlockType;
  text: string;
  accessibleText: string;
  headingLevel?: number;
  imageSrc?: string;
  imageAlt?: string;
  linkHref?: string;
  changeReason: string;
  reviewStatus: ReviewStatus;
  comments: CommentItem[];
}

interface GlossaryTerm {
  id: string;
  source: string;
  preferred: string;
  note: string;
}

interface VersionSnapshot {
  id: string;
  label: string;
  createdAt: string;
  blocks: ContentBlock[];
  glossary: GlossaryTerm[];
}

type AgencyVerdict = "pass" | "fail";

interface DefectReviewRecord {
  issueKey: string;
  blockId: string;
  status: ReviewStatus;
  via: "self" | "agency";
  batchId?: string;
  note?: string;
  updatedAt: string;
}

interface ReceiptItem {
  id: string;
  issueKey: string;
  rawIssueKey: string;
  verdictRaw: string;
  verdict: AgencyVerdict | "";
  note: string;
  matched: boolean;
  skipped?: boolean;
  error?: string;
  blockId?: string;
  issueTitle?: string;
  issueType?: AccessibilityIssue["type"];
  severity?: Severity;
  reconciledAt?: string;
}

interface ReviewBatch {
  id: string;
  agency: string;
  round: string;
  receivedAt: string;
  importedAt: string;
  items: ReceiptItem[];
}

interface ChapterProject {
  id: string;
  title: string;
  subject: string;
  grade: string;
  blocks: ContentBlock[];
  glossary: GlossaryTerm[];
  versions: VersionSnapshot[];
  defectReviews: DefectReviewRecord[];
  batches: ReviewBatch[];
  updatedAt: string;
}

interface AccessibilityIssue {
  id: string;
  blockId: string;
  type: "heading" | "link" | "image" | "glossary" | "sentence";
  severity: Severity;
  title: string;
  detail: string;
  suggestion: string;
}

const STORAGE_KEY = "sologsb-1009-accessible-textbook-v1";
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function createSeedProject(): ChapterProject {
  const blocks: ContentBlock[] = [
    {
      id: "block-h1",
      type: "heading",
      headingLevel: 1,
      text: "第三章 水循环与城市",
      accessibleText: "第三章 水循环与城市",
      changeReason: "",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-p1",
      type: "paragraph",
      text: "城市中的水并非取之不尽，由于其会通过蒸发、降水以及地表径流等若干复杂过程在自然界中持续循环，因此理解这些过程对于建设具有韧性的城市具有十分重要的意义。",
      accessibleText: "城市里的水会不断循环。它经过蒸发、降水并沿地面流动。了解这些过程，可以帮助我们建设更能适应变化的城市。",
      changeReason: "拆分长句，把抽象表述改为更直接的说明。",
      reviewStatus: "pending",
      comments: [],
    },
    {
      id: "block-h2",
      type: "heading",
      headingLevel: 2,
      text: "一、水从哪里来",
      accessibleText: "一、水从哪里来",
      changeReason: "保留原章节结构。",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-img",
      type: "image",
      text: "图 3-1 城市水循环示意",
      imageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='420'%3E%3Crect width='800' height='420' fill='%23dcecf3'/%3E%3Ccircle cx='650' cy='85' r='45' fill='%23f4c95d'/%3E%3Cpath d='M0 300 Q180 240 340 300 T800 280 V420 H0Z' fill='%2389b7d0'/%3E%3Cpath d='M130 285 Q220 170 330 285' fill='none' stroke='%233a7c9e' stroke-width='12'/%3E%3C/svg%3E",
      imageAlt: "",
      accessibleText: "",
      changeReason: "",
      reviewStatus: "needs-work",
      comments: [],
    },
    {
      id: "block-p2",
      type: "paragraph",
      text: "当太阳照射到水面时，水会受热变成水蒸气升到空中。水蒸气冷却后形成云，再以雨或雪的形式落回地面。",
      accessibleText: "太阳照在水面上，水会变成水蒸气升到空中。水蒸气冷却后变成云，最后以雨或雪落回地面。",
      changeReason: "使用较短句子，并明确每个步骤的先后顺序。",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-link",
      type: "link",
      text: "点击这里",
      linkHref: "/resources/water-cycle",
      accessibleText: "打开水循环互动实验",
      changeReason: "改为说明链接目标的独立文案。",
      reviewStatus: "pending",
      comments: [],
    },
    {
      id: "block-h3",
      type: "heading",
      headingLevel: 3,
      text: "雨水花园怎样工作",
      accessibleText: "雨水花园怎样工作",
      changeReason: "",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-p3",
      type: "paragraph",
      text: "雨水花园利用土壤和植物的共同作用暂时储存雨水，同时通过下渗补给地下水，并在降雨较集中时减轻城市排水管道所承受的压力。",
      accessibleText: "雨水花园用土壤和植物暂时存住雨水。雨水还会慢慢渗入地下，补充地下水。雨很大时，它可以减轻排水管的压力。",
      changeReason: "把并列成分拆成短句，减少专业术语密度。",
      reviewStatus: "pending",
      comments: [],
    },
  ];

  return {
    id: "accessible-textbook-1009",
    title: "科学（五年级下册）·无障碍改写稿",
    subject: "科学",
    grade: "五年级",
    blocks,
    glossary: [
      { id: "term-1", source: "水循环", preferred: "水循环", note: "全书统一使用" },
      { id: "term-2", source: "地表径流", preferred: "沿地面流动的水", note: "首次出现时使用通俗解释" },
      { id: "term-3", source: "下渗", preferred: "渗入地下", note: "避免单独使用专业词" },
    ],
    versions: [],
    defectReviews: [],
    batches: [],
    updatedAt: new Date().toISOString(),
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseImportedChapter(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push(blankBlock("heading", heading[2], { headingLevel: heading[1].length }));
      continue;
    }
    const image = /^!\[([^\]]*)\]\(([^)]+)\)(?:\s+(.+))?$/.exec(line);
    if (image) {
      blocks.push(blankBlock("image", image[3] || "未命名图片", { imageSrc: image[2], imageAlt: image[1] }));
      continue;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(line);
    if (link) {
      blocks.push(blankBlock("link", link[1], { linkHref: link[2] }));
      continue;
    }
    blocks.push(blankBlock("paragraph", line));
  }
  return blocks.length ? blocks : [blankBlock("paragraph", input.trim() || "请输入章节内容")];
}

function blankBlock(type: BlockType, text: string, extra: Partial<ContentBlock> = {}): ContentBlock {
  return {
    id: uid("block"),
    type,
    text,
    accessibleText: type === "image" ? extra.imageAlt ?? "" : text,
    changeReason: "",
    reviewStatus: "pending",
    comments: [],
    ...extra,
  };
}

function sentenceLength(text: string) {
  const normalized = text.replace(/\s+/g, "");
  return /[A-Za-z]/.test(text) ? text.trim().split(/\s+/).length : normalized.length;
}

function analyze(project: ChapterProject): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  let lastHeading = 0;
  for (const block of project.blocks) {
    if (block.type === "heading") {
      const level = block.headingLevel ?? 2;
      if (lastHeading && level > lastHeading + 1) {
        issues.push({
          id: `heading-${block.id}`,
          blockId: block.id,
          type: "heading",
          severity: "error",
          title: "标题层级跳跃",
          detail: `从 H${lastHeading} 直接到 H${level}，读屏用户会失去清晰的章节结构。`,
          suggestion: `改为 H${lastHeading + 1}，或补上中间的上级标题。`,
        });
      }
      lastHeading = level;
    }
    if (block.type === "image" && !(block.imageAlt ?? block.accessibleText).trim()) {
      issues.push({
        id: `image-${block.id}`,
        blockId: block.id,
        type: "image",
        severity: "error",
        title: "图片缺少替代文本",
        detail: "视觉用户能看到的图表信息，读屏用户目前无法获得。",
        suggestion: "说明图中主体、变化和结论；纯装饰图片应标记为空替代文本。",
      });
    }
    if (block.type === "link") {
      const label = block.accessibleText || block.text;
      if (/^(点击这里|这里|链接|更多|here|click here|read more)$/i.test(label.trim())) {
        issues.push({
          id: `link-${block.id}`,
          blockId: block.id,
          type: "link",
          severity: "error",
          title: "链接文案缺少目的",
          detail: `“${label}”单独朗读时无法说明会前往哪里。`,
          suggestion: "改成“打开水循环互动实验”等可独立理解的文案。",
        });
      }
    }
    const text = block.type === "image" ? block.text : block.text;
    const sentences = text.split(/(?<=[。！？!?])\s*/).filter(Boolean);
    for (const [index, sentence] of sentences.entries()) {
      if (sentenceLength(sentence) > (/[A-Za-z]/.test(sentence) ? 28 : 42)) {
        issues.push({
          id: `sentence-${block.id}-${index}`,
          blockId: block.id,
          type: "sentence",
          severity: "warning",
          title: "句子过长",
          detail: `该句约 ${sentenceLength(sentence)} ${/[A-Za-z]/.test(sentence) ? "个词" : "个字"}，一次理解的信息较多。`,
          suggestion: "按动作或因果关系拆成 2—3 个短句。",
        });
      }
    }
    const source = `${block.text} ${block.accessibleText}`;
    for (const term of project.glossary) {
      if (source.includes(term.source) && block.accessibleText && !block.accessibleText.includes(term.preferred)) {
        issues.push({
          id: `term-${block.id}-${term.id}`,
          blockId: block.id,
          type: "glossary",
          severity: "info",
          title: `术语“${term.source}”尚未统一`,
          detail: `全书建议表述为“${term.preferred}”。${term.note}`,
          suggestion: `将无障碍文本调整为“${term.preferred}”。`,
        });
      }
    }
  }
  return issues;
}

function simplifyText(input: string, glossary: GlossaryTerm[]) {
  let result = input
    .replaceAll("由于其", "因为")
    .replaceAll("因此", "所以")
    .replaceAll("具有十分重要的意义", "很重要")
    .replaceAll("利用", "使用")
    .replaceAll("共同作用", "一起作用")
    .replaceAll("暂时储存", "暂时存住")
    .replaceAll("所承受的压力", "受到的压力")
    .replace(/([^。！？]{38,}?)[，、]([^。！？]{12,}?[。！？])/g, "$1。$2");
  for (const term of glossary) {
    if (result.includes(term.source)) result = result.replaceAll(term.source, term.preferred);
  }
  result = result
    .split(/(?<=[。！？!?])\s*/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .join("\n");
  return result;
}

function blockRole(block: ContentBlock) {
  if (block.type === "heading") return `H${block.headingLevel ?? 2} 标题`;
  if (block.type === "image") return "图片 / 替代文本";
  if (block.type === "link") return "链接";
  return "正文段落";
}

function statusLabel(status: ReviewStatus) {
  if (status === "approved") return "已通过";
  if (status === "needs-work") return "需修改";
  return "待审核";
}

function severityLabel(severity: Severity) {
  if (severity === "error") return "必须修复";
  if (severity === "warning") return "建议优化";
  return "一致性提醒";
}

// ---------- 外部机构回执：双份台账、逐条对账与逐行重试 ----------

type ParsedReceiptRow = { issueKey: string; verdictRaw: string; note: string };

function normalizeVerdict(raw: string): AgencyVerdict | "" {
  const text = raw.trim().toLowerCase();
  if (!text) return "";
  if (/^(通过|合格|符合|pass(ed)?|ok|yes|true|1|approved?|accep(t|ted))$/.test(text)) return "pass";
  if (/^(不通过|不合格|不符合|未通过|fail(ed)?|no|false|0|rejected?|需修改|需要修改|退回)$/.test(text)) return "fail";
  return "";
}

function splitCsvLine(line: string): string[] {
  // 兼容英文逗号、中文逗号与制表符；模板已避免在批注中使用逗号
  return line.split(/[,，\t]/).map((cell) => cell.trim().replace(/^["']|["']$/g, ""));
}

function parseReceiptText(input: string): ParsedReceiptRow[] {
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
  let keyCol = 0;
  let verdictCol = 1;
  let noteCol = 2;
  let body = lines;
  if (lines[0] && /缺陷编号|编号|issue\s*key|结论|verdict|result/i.test(lines[0])) {
    const header = splitCsvLine(lines[0]).map((cell) => cell.toLowerCase());
    const findCol = (...names: string[]) => header.findIndex((cell) => names.some((name) => cell.includes(name)));
    const keyIndex = findCol("缺陷编号", "编号", "issue", "key", "id");
    const verdictIndex = findCol("结论", "判定", "verdict", "result", "pass");
    const noteIndex = findCol("批注", "说明", "意见", "备注", "note", "comment");
    if (keyIndex >= 0) keyCol = keyIndex;
    if (verdictIndex >= 0) verdictCol = verdictIndex;
    if (noteIndex >= 0) noteCol = noteIndex;
    body = lines.slice(1);
  }
  return body.map((line) => {
    const cells = splitCsvLine(line);
    return { issueKey: cells[keyCol] ?? "", verdictRaw: cells[verdictCol] ?? "", note: cells[noteCol] ?? "" };
  });
}

function receiptItemFromRow(row: ParsedReceiptRow): ReceiptItem {
  return {
    id: uid("receipt"),
    issueKey: row.issueKey.trim(),
    rawIssueKey: row.issueKey.trim(),
    verdictRaw: row.verdictRaw.trim(),
    verdict: normalizeVerdict(row.verdictRaw),
    note: row.note.trim(),
    matched: false,
  };
}

// 校验单条回执并与工作台缺陷对上；任何问题都只落在这一行，不影响其他行
function bindReceiptItem(draft: ChapterProject, item: ReceiptItem): void {
  item.matched = false;
  item.error = undefined;
  if (!item.issueKey) {
    item.error = "缺少缺陷编号";
    return;
  }
  if (!item.verdict) {
    item.error = `结论无法识别：“${item.verdictRaw || "（空）"}”，应为 通过 或 不通过`;
    return;
  }
  const issue = analyze(draft).find((candidate) => candidate.id === item.issueKey);
  if (!issue) {
    item.error = "工作台没有这个缺陷编号（可能已被改写消除）";
    return;
  }
  if (!draft.blocks.some((block) => block.id === issue.blockId)) {
    item.error = "对应的内容块已不存在";
    return;
  }
  item.matched = true;
  item.blockId = issue.blockId;
  item.issueTitle = issue.title;
  item.issueType = issue.type;
  item.severity = issue.severity;
  item.reconciledAt = new Date().toISOString();
}

// 工作台台账：以缺陷编号为准记录工作台侧结论，与机构回执各存一份
function upsertAgencyReview(draft: ChapterProject, item: ReceiptItem, batchId: string) {
  if (!item.matched || !item.verdict || !item.blockId) return;
  const now = new Date().toISOString();
  const status: ReviewStatus = item.verdict === "pass" ? "approved" : "needs-work";
  const existing = draft.defectReviews.find((record) => record.issueKey === item.issueKey);
  if (existing) {
    existing.blockId = item.blockId;
    existing.status = status;
    existing.via = "agency";
    existing.batchId = batchId;
    existing.note = item.note;
    existing.updatedAt = now;
  } else {
    draft.defectReviews.push({ issueKey: item.issueKey, blockId: item.blockId, status, via: "agency", batchId, note: item.note, updatedAt: now });
  }
}

// 整块只有在其当前缺陷全部通过时才转已通过；任一不通过即退回重做；其余保持原状态
function recomputeBlockStatus(draft: ChapterProject, blockId: string) {
  const block = draft.blocks.find((item) => item.id === blockId);
  if (!block) return;
  const current = analyze(draft).filter((issue) => issue.blockId === blockId);
  if (!current.length) return;
  const records = current.map((issue) => draft.defectReviews.find((record) => record.issueKey === issue.id));
  if (records.some((record) => record?.status === "needs-work")) {
    block.reviewStatus = "needs-work";
    return;
  }
  if (records.every((record) => record?.status === "approved")) {
    block.reviewStatus = "approved";
  }
  // 本轮机构没提异议、或仍有待复核条目的，保留工作台当前状态
}

interface IngestResult {
  matched: number;
  failed: number;
  skipped: number;
}

function ingestReceiptRows(draft: ChapterProject, batch: ReviewBatch, rows: ParsedReceiptRow[], skipKeys: Set<string>): IngestResult {
  let matched = 0;
  let failed = 0;
  let skipped = 0;
  for (const row of rows) {
    const key = row.issueKey.trim();
    if (key && skipKeys.has(key)) {
      skipped++;
      continue;
    }
    const item = receiptItemFromRow(row);
    bindReceiptItem(draft, item);
    batch.items.push(item);
    if (item.matched) {
      upsertAgencyReview(draft, item, batch.id);
      recomputeBlockStatus(draft, item.blockId!);
      matched++;
    } else {
      failed++;
    }
  }
  return { matched, failed, skipped };
}

// 弹窗内逐行重试：只重新校验并重对这一条
function retryReceiptItem(draft: ChapterProject, batch: ReviewBatch, item: ReceiptItem) {
  item.issueKey = item.issueKey.trim();
  item.verdict = normalizeVerdict(item.verdictRaw);
  bindReceiptItem(draft, item);
  if (item.matched) {
    upsertAgencyReview(draft, item, batch.id);
    recomputeBlockStatus(draft, item.blockId!);
  }
}

function syncBlockSelfReview(draft: ChapterProject, blockId: string, status: ReviewStatus) {
  const block = draft.blocks.find((item) => item.id === blockId);
  if (!block) return;
  block.reviewStatus = status;
  const currentKeys = analyze(draft).filter((issue) => issue.blockId === blockId).map((issue) => issue.id);
  const now = new Date().toISOString();
  for (const key of currentKeys) {
    const existing = draft.defectReviews.find((record) => record.issueKey === key);
    if (existing) {
      existing.status = status;
      existing.via = "self";
      existing.updatedAt = now;
    } else {
      draft.defectReviews.push({ issueKey: key, blockId, status, via: "self", updatedAt: now });
    }
  }
}

// 编辑改写内容后，该块当前缺陷回到待复核；机构批注等历史信息保留
function resetBlockDefectReviews(draft: ChapterProject, blockId: string) {
  const activeKeys = new Set(analyze(draft).filter((issue) => issue.blockId === blockId).map((issue) => issue.id));
  const now = new Date().toISOString();
  for (const record of draft.defectReviews) {
    if (record.blockId === blockId && activeKeys.has(record.issueKey) && record.status !== "pending") {
      record.status = "pending";
      record.via = "self";
      record.updatedAt = now;
    }
  }
}

function batchStats(batch: ReviewBatch) {
  const matched = batch.items.filter((item) => item.matched);
  return {
    total: batch.items.length,
    matched: matched.length,
    failed: batch.items.length - matched.length,
    pass: matched.filter((item) => item.verdict === "pass").length,
    fail: matched.filter((item) => item.verdict === "fail").length,
  };
}

function csvCell(value: string) {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function buildReceiptTemplate(project: ChapterProject): string {
  const header = ["缺陷编号", "位置", "缺陷", "复核结论(通过/不通过)", "机构批注"].join(",");
  const rows = analyze(project).map((issue) => {
    const blockIndex = project.blocks.findIndex((block) => block.id === issue.blockId) + 1;
    return [issue.id, `第${blockIndex}块`, issue.title, "", issue.suggestion].map(csvCell).join(",");
  });
  return [header, ...rows].join("\n");
}

// 示例回执：故意混入坏行，演示逐行失败与重试
function buildSampleReceipt(project: ChapterProject): string {
  const list = analyze(project);
  const lines: string[] = [];
  const image = list.find((issue) => issue.type === "image");
  if (image) lines.push(`${image.id},不通过,替代文本只写了图号，需要读出图中的水循环环节`);
  // 找一个“该块唯一缺陷”的长句：机构判通过后整块即可转为已通过
  const counts = new Map<string, number>();
  for (const issue of list) counts.set(issue.blockId, (counts.get(issue.blockId) ?? 0) + 1);
  const loneSentence = list.find((issue) => issue.type === "sentence" && counts.get(issue.blockId) === 1);
  if (loneSentence) lines.push(`${loneSentence.id},通过,短句拆分清楚，步骤顺序明确`);
  const glossary = list.find((issue) => issue.type === "glossary" && issue.blockId !== loneSentence?.blockId);
  if (glossary) lines.push(`${glossary.id},通过,该条术语表述可以接受，但同块还有其他条目待核`);
  lines.push("term-block-p9-term-9,通过,这个编号工作台不存在（演示逐行报错）");
  lines.push("image-block-x,同意,结论应写通过或不通过（演示无法识别）");
  return lines.join("\n");
}

function agencyBadgeHtml(project: ChapterProject, record: DefectReviewRecord | undefined): string {
  if (!record?.batchId) return "";
  const batch = project.batches.find((item) => item.id === record.batchId);
  const round = batch?.round ? `（${batch.round}）` : "";
  if (record.status === "approved") {
    return `<div class="agency-verdict pass"><b>机构最近判定${round}：通过</b>${record.note ? `<span>${escapeHtml(record.note)}</span>` : ""}</div>`;
  }
  if (record.status === "needs-work") {
    return `<div class="agency-verdict fail"><b>机构最近判定${round}：不通过 · 已退回工作台重做</b>${record.note ? `<span>${escapeHtml(record.note)}</span>` : ""}</div>`;
  }
  return `<div class="agency-verdict stale"><b>内容已修改，原机构结论待重新复核</b>${record.note ? `<span>${escapeHtml(record.note)}</span>` : ""}</div>`;
}

function exportHtml(project: ChapterProject) {
  const body = project.blocks.map((block) => {
    if (block.type === "heading") {
      const level = Math.min(6, Math.max(1, block.headingLevel ?? 2));
      return `<h${level}>${escapeHtml(block.accessibleText || block.text)}</h${level}>`;
    }
    if (block.type === "image") {
      return `<figure><img src="${escapeHtml(block.imageSrc ?? "")}" alt="${escapeHtml(block.imageAlt || block.accessibleText)}"><figcaption>${escapeHtml(block.text)}</figcaption></figure>`;
    }
    if (block.type === "link") {
      return `<p><a href="${escapeHtml(block.linkHref ?? "#")}">${escapeHtml(block.accessibleText || block.text)}</a></p>`;
    }
    return `<p>${escapeHtml(block.accessibleText || block.text)}</p>`;
  }).join("\n      ");
  const report = exportReviewReport(project);
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(project.title)} · 无障碍版本</title>
  <style>
    :root { font-family: "Noto Sans SC", sans-serif; font-size: 20px; line-height: 1.85; color: #17231f; background: #fffdf7; }
    body { max-width: 760px; margin: 0 auto; padding: 32px 24px 80px; }
    a { color: #075c9d; text-decoration-thickness: 2px; text-underline-offset: 3px; }
    a:focus-visible, [tabindex]:focus-visible { outline: 4px solid #d08a00; outline-offset: 3px; }
    h1, h2, h3, h4, h5, h6 { line-height: 1.4; margin-top: 1.8em; }
    figure { margin: 2em 0; } img { max-width: 100%; height: auto; } figcaption { font-size: .86em; color: #46554f; }
    .skip { position: absolute; left: -9999px; } .skip:focus { position: static; display: inline-block; padding: .5em; background: #fff; }
    .external-review { margin-top: 3em; border-top: 3px solid #1f4a3e; padding-top: 1.2em; }
    .external-review h2 { margin-top: .4em; }
    .external-review .review-meta { color: #46554f; font-size: .9em; }
    .external-review ul { list-style: none; padding: 0; margin: 1em 0 0; display: grid; gap: .8em; }
    .external-review li { border: 1px solid #d7ddd9; border-left-width: 5px; border-radius: 8px; padding: .6em .9em; }
    .external-review li.pass { border-left-color: #287a55; background: #f3faf6; }
    .external-review li.fail { border-left-color: #b9362d; background: #fdf6f5; }
    .external-review li .verdict { font-weight: 700; margin-right: .6em; }
    .external-review li.pass .verdict { color: #287a55; }
    .external-review li.fail .verdict { color: #b9362d; }
    .external-review li p { margin: .3em 0 0; font-size: .92em; color: #31433d; }
    .external-review li .agency-note { color: #5a6862; }
  </style>
</head>
<body>
  <a class="skip" href="#main">跳到正文</a>
  <main id="main" tabindex="-1">
      ${body}
      ${report}
  </main>
</body>
</html>`;
}

// 导出的无障碍版本附上最近一批外部机构复核结论（逐条、读屏可理解）
function exportReviewReport(project: ChapterProject): string {
  const batch = project.batches[0];
  if (!batch) return "";
  const matched = batch.items
    .filter((item) => item.matched && item.verdict)
    .sort((a, b) => {
      const ia = project.blocks.findIndex((block) => block.id === a.blockId);
      const ib = project.blocks.findIndex((block) => block.id === b.blockId);
      return ia - ib || a.issueKey.localeCompare(b.issueKey);
    });
  const items = matched.map((item) => {
    const blockIndex = project.blocks.findIndex((block) => block.id === item.blockId) + 1;
    const location = blockIndex > 0 ? `第 ${blockIndex} 块 · ` : "";
    const title = item.issueTitle ?? item.issueKey;
    const verdict = item.verdict === "pass" ? "通过" : "不通过（退回工作台重做）";
    const note = item.note ? `<p class="agency-note">机构批注：${escapeHtml(item.note)}</p>` : "";
    return `<li class="${item.verdict}"><span class="verdict">${verdict}</span><strong>${escapeHtml(location + title)}</strong>${note}</li>`;
  }).join("\n        ");
  return `<section class="external-review" aria-labelledby="review-report-title">
    <h2 id="review-report-title">外部无障碍机构复核结论</h2>
    <p class="review-meta">复核机构：${escapeHtml(batch.agency)} ｜ 复核轮次：${escapeHtml(batch.round)} ｜ 回执日期：${escapeHtml(new Date(batch.receivedAt).toLocaleDateString())} ｜ 已对账 ${matched.length} 条（通过 ${batchStats(batch).pass} 条，不通过 ${batchStats(batch).fail} 条）</p>
    <ul>
        ${items}
    </ul>
  </section>`;
}

function download(filename: string, content: string, type = "text/html;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function loadProject(): ChapterProject {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "") as { schema: number; project: ChapterProject };
    if ([1, 2].includes(stored.schema) && stored.project?.blocks?.length) {
      const migrated = stored.project;
      migrated.defectReviews ??= [];
      migrated.batches ??= [];
      return migrated;
    }
  } catch {
    // Fall back to the bundled sample.
  }
  return createSeedProject();
}

const rootElement = document.querySelector<HTMLDivElement>("#app");
if (!rootElement) throw new Error("Application root was not found");
const app: HTMLDivElement = rootElement;

let project = loadProject();
let activeBlockId = project.blocks[0]?.id ?? "";
let activeIssueId = "";
let previewMode: "normal" | "assisted" = "normal";
let selectedVersionId = "";
let showGlossary = false;
let showAgency = false;
let agencyDraft = "";
let receiptAgencyName = "外部无障碍审校机构";
let receiptRound = "";
let selectedBatchId = "";
let lastIngestResult: IngestResult | null = null;
let undoStack: ChapterProject[] = [];
let redoStack: ChapterProject[] = [];
let saveTimer = 0;

const activeBlock = () => project.blocks.find((block) => block.id === activeBlockId) ?? project.blocks[0];
const issues = () => analyze(project);

function saveSoon() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ schema: 2, project }));
  }, 320);
}

function commit(label: string, update: (draft: ChapterProject) => void, renderAfter = true) {
  undoStack = [...undoStack.slice(-49), structuredClone(project)];
  redoStack = [];
  const draft = structuredClone(project);
  update(draft);
  draft.updatedAt = new Date().toISOString();
  project = draft;
  document.documentElement.dataset.lastAction = label;
  saveSoon();
  if (renderAfter) render();
}

function undo() {
  const previous = undoStack.pop();
  if (!previous) return;
  redoStack = [structuredClone(project), ...redoStack].slice(0, 50);
  project = previous;
  if (!project.blocks.some((block) => block.id === activeBlockId)) activeBlockId = project.blocks[0]?.id ?? "";
  saveSoon();
  render();
}

function redo() {
  const next = redoStack.shift();
  if (!next) return;
  undoStack = [...undoStack.slice(-49), structuredClone(project)];
  project = next;
  saveSoon();
  render();
}

function updateActiveBlock(update: (block: ContentBlock, draft: ChapterProject) => void, label = "修改无障碍文本", renderAfter = true) {
  commit(label, (draft) => {
    const block = draft.blocks.find((item) => item.id === activeBlockId);
    if (block) update(block, draft);
  }, renderAfter);
}

function render() {
  const list = issues();
  const active = activeBlock();
  const activeIssues = list.filter((issue) => issue.blockId === active.id);
  const approved = project.blocks.filter((block) => block.reviewStatus === "approved").length;
  const version = project.versions.find((item) => item.id === selectedVersionId) ?? project.versions[0];

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand"><span>无障碍</span><b>1009</b></div>
        <div class="title-block">
          <input id="project-title" aria-label="教材名称" value="${escapeHtml(project.title)}" />
          <div class="meta"><span>${escapeHtml(project.subject)}</span><span>${escapeHtml(project.grade)}</span><span class="save-dot">本地自动保存</span></div>
        </div>
        <div class="top-actions">
          <span class="online-pill">${navigator.onLine ? "在线" : "离线可编辑"}</span>
          <sl-button size="small" variant="default" ${undoStack.length ? "" : "disabled"} data-action="undo">撤销</sl-button>
          <sl-button size="small" variant="default" ${redoStack.length ? "" : "disabled"} data-action="redo">重做</sl-button>
          <sl-button size="small" variant="default" data-action="glossary">术语表</sl-button>
          <sl-button size="small" variant="warning" outline data-action="agency-dialog">机构回执对账${project.batches[0] ? ` · ${project.batches.length}` : ""}${project.batches[0] && batchStats(project.batches[0]).failed ? ` · ${batchStats(project.batches[0]).failed} 待重试` : ""}</sl-button>
          <sl-button size="small" variant="primary" data-action="save-version">保存版本</sl-button>
          <sl-button size="small" variant="success" data-action="export">导出无障碍 HTML</sl-button>
        </div>
      </header>

      <div class="progress-strip">
        <div class="progress-copy"><b>${approved}/${project.blocks.length}</b><span>内容块已审核通过</span></div>
        <div class="progress-bar"><i style="width:${Math.round((approved / Math.max(1, project.blocks.length)) * 100)}%"></i></div>
        <div class="issue-counts">
          <span class="error">${list.filter((issue) => issue.severity === "error").length} 必须修复</span>
          <span class="warning">${list.filter((issue) => issue.severity === "warning").length} 建议优化</span>
          <span class="info">${list.filter((issue) => issue.severity === "info").length} 术语提醒</span>
        </div>
      </div>

      <div class="workspace">
        <aside class="outline-panel">
          <div class="panel-title"><span>章节结构</span><sl-badge>${project.blocks.length} 块</sl-badge></div>
          <div class="block-list">
            ${project.blocks.map((block, index) => {
              const blockIssues = list.filter((issue) => issue.blockId === block.id);
              return `<button class="block-item ${block.id === active.id ? "active" : ""}" data-action="select-block" data-block-id="${block.id}">
                <span class="block-order">${index + 1}</span>
                <span class="block-copy"><b>${block.type === "heading" ? `H${block.headingLevel}` : blockRole(block)}</b><span>${escapeHtml(block.accessibleText || block.text || "（空）")}</span></span>
                <i class="status-${block.reviewStatus}" title="${statusLabel(block.reviewStatus)}"></i>
                ${blockIssues.length ? `<em>${blockIssues.length}</em>` : ""}
              </button>`;
            }).join("")}
          </div>
          <input id="chapter-file" type="file" accept=".txt,.md,.markdown" hidden />
          <sl-button class="import-button" variant="default" data-action="import">导入章节文本</sl-button>
          <div class="keyboard-note"><b>键盘</b><span><kbd>J</kbd><kbd>K</kbd> 跳转问题</span><span><kbd>E</kbd> 自动改写</span><span><kbd>⌘ Z</kbd> 撤销</span><span><kbd>1</kbd><kbd>2</kbd> 预览模式</span></div>
        </aside>

        <main class="editor-panel">
          <div class="editor-head">
            <div><span class="eyebrow">当前内容块</span><h1>${blockRole(active)}</h1></div>
            <div class="review-actions">
              <sl-button size="small" variant="${active.reviewStatus === "approved" ? "success" : "default"}" data-action="approve">${active.reviewStatus === "approved" ? "✓ 已通过" : "审核通过"}</sl-button>
              <sl-button size="small" variant="${active.reviewStatus === "needs-work" ? "danger" : "default"}" data-action="needs-work">需修改</sl-button>
            </div>
          </div>

          ${activeIssues.length ? `<div class="active-issues">${activeIssues.map((issue) => {
            const record = project.defectReviews.find((item) => item.issueKey === issue.id);
            return `
            <div class="issue-card ${issue.severity}">
              <div><sl-badge variant="${issue.severity === "error" ? "danger" : issue.severity === "warning" ? "warning" : "primary"}">${severityLabel(issue.severity)}</sl-badge><strong>${escapeHtml(issue.title)}</strong></div>
              <p>${escapeHtml(issue.detail)}</p><small>${escapeHtml(issue.suggestion)}</small>
              ${agencyBadgeHtml(project, record)}
            </div>`;
          }).join("")}</div>` : `<div class="issue-clear">✓ 当前内容块没有新的无障碍问题</div>`}

          <section class="edit-card source-card">
            <div class="section-heading"><div><span class="eyebrow">原教材</span><h2>${active.type === "image" ? "图片信息" : active.type === "link" ? "链接信息" : "原文"}</h2></div><sl-badge variant="neutral">${active.type}</sl-badge></div>
            ${renderSourceEditor(active)}
          </section>

          <section class="edit-card rewrite-card">
            <div class="section-heading">
              <div><span class="eyebrow">Accessible rewrite</span><h2>无障碍表达</h2></div>
              <sl-button size="small" variant="primary" outline data-action="generate">生成易读版本</sl-button>
            </div>
            ${renderAccessibleEditor(active)}
            <label class="field-label" for="reason-${active.id}">改写原因（每处改写必须记录）</label>
            <sl-textarea id="reason-${active.id}" data-field="reason" rows="2" value="${escapeHtml(active.changeReason)}" placeholder="例如：拆分长句、替换专业表达、补充链接目的"></sl-textarea>
          </section>

          <section class="edit-card">
            <div class="section-heading"><div><span class="eyebrow">Review discussion</span><h2>批注与回复</h2></div><sl-badge variant="warning">${active.comments.length} 条</sl-badge></div>
            <div class="comment-compose"><sl-textarea id="new-comment" rows="2" placeholder="记录改写依据、审核意见或术语讨论…"></sl-textarea><sl-button size="small" variant="primary" data-action="add-comment">添加批注</sl-button></div>
            <div class="comment-list">
              ${active.comments.length ? active.comments.map((comment) => `
                <article class="comment ${comment.resolved ? "resolved" : ""}">
                  <header><b>${escapeHtml(comment.author)}</b><time>${new Date(comment.createdAt).toLocaleString()}</time></header>
                  <p>${escapeHtml(comment.body)}</p>
                  ${comment.replies.map((reply) => `<div class="reply"><b>${escapeHtml(reply.author)}</b><span>${escapeHtml(reply.body)}</span></div>`).join("")}
                  <div class="reply-row"><sl-input size="small" id="reply-${comment.id}" placeholder="回复…"></sl-input><sl-button size="small" data-action="reply" data-comment-id="${comment.id}">回复</sl-button><sl-button size="small" variant="text" data-action="resolve-comment" data-comment-id="${comment.id}">${comment.resolved ? "重新打开" : "解决"}</sl-button></div>
                </article>`).join("") : `<div class="empty-note">当前内容块还没有批注。</div>`}
            </div>
          </section>
        </main>

        <aside class="review-panel">
          <section class="preview-card">
            <div class="section-heading"><div><span class="eyebrow">Reader preview</span><h2>阅读预览</h2></div><div class="mode-switch"><button class="${previewMode === "normal" ? "active" : ""}" data-action="preview-normal">普通</button><button class="${previewMode === "assisted" ? "active" : ""}" data-action="preview-assisted">辅助</button></div></div>
            <div class="reader-preview mode-${previewMode}">${renderPreview()}</div>
          </section>

          <section class="order-card">
            <div class="section-heading"><div><span class="eyebrow">Screen reader order</span><h2>读屏阅读顺序</h2></div><sl-badge>从上到下</sl-badge></div>
            <ol class="reading-order">
              ${project.blocks.map((block, index) => `<li class="${block.id === active.id ? "active" : ""}"><b>${index + 1}</b><div><strong>${blockRole(block)}</strong><span>${escapeHtml(block.accessibleText || block.text || "（无内容）")}</span></div></li>`).join("")}
            </ol>
          </section>

          <section class="issues-panel">
            <div class="section-heading"><div><span class="eyebrow">All checks</span><h2>全章问题</h2></div><sl-button size="small" variant="default" outline data-action="approve-all">全部通过</sl-button></div>
            <div class="issue-list">
              ${list.length ? list.map((issue) => `<button class="${issue.id === activeIssueId ? "active" : ""} ${issue.severity}" data-action="jump-issue" data-issue-id="${issue.id}" data-block-id="${issue.blockId}"><span>${severityLabel(issue.severity)}</span><b>${escapeHtml(issue.title)}</b><small>段 ${project.blocks.findIndex((block) => block.id === issue.blockId) + 1} · ${escapeHtml(issue.suggestion)}</small></button>`).join("") : `<div class="issue-clear">✓ 全章检查通过</div>`}
            </div>
          </section>

          <section class="version-card">
            <div class="section-heading"><div><span class="eyebrow">Version compare</span><h2>版本比较</h2></div><sl-badge>${project.versions.length} 版</sl-badge></div>
            ${project.versions.length ? `
              <sl-select id="version-select" size="small" value="${version?.id ?? ""}">${project.versions.map((item) => `<sl-option value="${item.id}">${escapeHtml(item.label)} · ${new Date(item.createdAt).toLocaleTimeString()}</sl-option>`).join("")}</sl-select>
              <div class="version-diff">${version ? renderVersionDiff(version, active) : ""}</div>
            ` : `<div class="empty-note">保存版本后，可比较改写前后的无障碍文本。</div>`}
          </section>
        </aside>
      </div>

      <footer class="statusbar"><span>最近操作：${escapeHtml(document.documentElement.dataset.lastAction || "示例章节已载入")}</span><span>${project.blocks.length} 个内容块 · ${list.length} 个待处理问题${project.batches[0] ? ` · 机构回执 ${project.batches.length} 批（最新一批通过 ${batchStats(project.batches[0]).pass} / 不通过 ${batchStats(project.batches[0]).fail} / 待重试 ${batchStats(project.batches[0]).failed}）` : ""}</span></footer>
    </div>

    <sl-dialog label="全书术语表" ${showGlossary ? "open" : ""} data-dialog="glossary">
      <div class="glossary-editor">
        ${project.glossary.map((term) => `<div class="term-row"><div><b>${escapeHtml(term.source)}</b><sl-input size="small" value="${escapeHtml(term.preferred)}" data-term-id="${term.id}"></sl-input><small>${escapeHtml(term.note)}</small></div><sl-button size="small" variant="danger" outline data-action="remove-term" data-term-id="${term.id}">删除</sl-button></div>`).join("")}
      </div>
      <div class="term-add"><sl-input id="new-term-source" placeholder="原文术语"></sl-input><sl-input id="new-term-preferred" placeholder="统一表达"></sl-input><sl-button variant="primary" data-action="add-term">添加术语</sl-button></div>
      <sl-button slot="footer" variant="primary" data-action="close-glossary">完成</sl-button>
    </sl-dialog>
    ${renderAgencyDialog()}`;

  wireLiveFields();
}

function renderSourceEditor(block: ContentBlock) {
  if (block.type === "image") {
    return `<div class="image-source"><img src="${escapeHtml(block.imageSrc ?? "")}" alt="" /><div><b>图注</b><p>${escapeHtml(block.text)}</p><b>现有替代文本</b><p>${escapeHtml(block.imageAlt || "（空）")}</p></div></div>
      <sl-input id="source-${block.id}" data-field="source" label="图注" value="${escapeHtml(block.text)}"></sl-input>
      <sl-input id="image-alt-${block.id}" data-field="image-alt" label="替代文本" value="${escapeHtml(block.imageAlt ?? "")}" help-text="描述图片传达的信息，不写“图片”二字。"></sl-input>`;
  }
  if (block.type === "link") {
    return `<sl-input id="source-${block.id}" data-field="source" label="原链接文案" value="${escapeHtml(block.text)}"></sl-input><sl-input id="link-href-${block.id}" data-field="link-href" label="链接地址" value="${escapeHtml(block.linkHref ?? "")}"></sl-input>`;
  }
  if (block.type === "heading") {
    return `<div class="heading-edit"><sl-select id="heading-level-${block.id}" data-field="heading-level" label="标题层级" value="${String(block.headingLevel ?? 2)}"><sl-option value="1">H1</sl-option><sl-option value="2">H2</sl-option><sl-option value="3">H3</sl-option><sl-option value="4">H4</sl-option></sl-select><sl-input id="source-${block.id}" data-field="source" label="标题文本" value="${escapeHtml(block.text)}"></sl-input></div>`;
  }
  return `<sl-textarea id="source-${block.id}" data-field="source" rows="4" value="${escapeHtml(block.text)}"></sl-textarea>`;
}

function renderAccessibleEditor(block: ContentBlock) {
  if (block.type === "image") {
    return `<sl-textarea id="accessible-${block.id}" data-field="accessible" rows="3" label="图片替代文本" value="${escapeHtml(block.imageAlt || block.accessibleText)}" help-text="读屏软件会朗读这里的内容。"></sl-textarea>`;
  }
  return `<sl-textarea id="accessible-${block.id}" data-field="accessible" rows="6" value="${escapeHtml(block.accessibleText)}"></sl-textarea>`;
}

function renderPreview() {
  return project.blocks.map((block, index) => {
    const content = escapeHtml(block.accessibleText || block.text);
    if (block.type === "heading") {
      const tag = `h${Math.min(6, Math.max(1, block.headingLevel ?? 2))}`;
      return `<${tag} class="${block.id === activeBlockId ? "active-block" : ""}"><span class="order-marker">${index + 1}</span>${content}</${tag}>`;
    }
    if (block.type === "image") {
      return `<figure class="${block.id === activeBlockId ? "active-block" : ""}"><img src="${escapeHtml(block.imageSrc ?? "")}" alt="${escapeHtml(block.imageAlt || block.accessibleText)}"><figcaption><span class="order-marker">${index + 1}</span>${escapeHtml(block.text)}</figcaption></figure>`;
    }
    if (block.type === "link") {
      return `<p class="${block.id === activeBlockId ? "active-block" : ""}"><span class="order-marker">${index + 1}</span><a href="${escapeHtml(block.linkHref ?? "#")}" onclick="return false">${content}</a><span class="link-role">链接</span></p>`;
    }
    return `<p class="${block.id === activeBlockId ? "active-block" : ""}"><span class="order-marker">${index + 1}</span>${content}</p>`;
  }).join("");
}

function renderVersionDiff(version: VersionSnapshot, current: ContentBlock) {
  const oldBlock = version.blocks.find((block) => block.id === current.id);
  if (!oldBlock) return `<div class="empty-note">当前内容块不在该版本中。</div>`;
  return `<div class="diff-column"><span>旧版</span><p>${escapeHtml(oldBlock.accessibleText || oldBlock.text)}</p></div><div class="diff-column current"><span>当前</span><p>${escapeHtml(current.accessibleText || current.text)}</p></div>`;
}

function reviewLedgerStatusLabel(status: ReviewStatus) {
  if (status === "approved") return "已通过";
  if (status === "needs-work") return "退回重做";
  return "待复核";
}

function renderAgencyDialog(): string {
  if (!showAgency) return "";
  const batches = project.batches;
  const batch = batches.find((item) => item.id === selectedBatchId) ?? batches[0];
  const failedItems = batch ? batch.items.filter((item) => !item.matched) : [];
  const matchedItems = batch ? batch.items.filter((item) => item.matched) : [];
  const currentIssueKeys = new Set(issues().map((issue) => issue.id));

  const failedRows = failedItems.map((item) => `
    <div class="receipt-row error" data-item-id="${item.id}">
      <div class="receipt-error">${escapeHtml(item.error ?? "未知错误")}</div>
      <div class="receipt-row-fields">
        <sl-input size="small" data-receipt-item-field="issueKey" data-item-id="${item.id}" value="${escapeHtml(item.issueKey)}" placeholder="缺陷编号"></sl-input>
        <sl-input size="small" data-receipt-item-field="verdictRaw" data-item-id="${item.id}" value="${escapeHtml(item.verdictRaw)}" placeholder="通过 / 不通过"></sl-input>
        <sl-input size="small" data-receipt-item-field="note" data-item-id="${item.id}" value="${escapeHtml(item.note)}" placeholder="机构批注（可留空）"></sl-input>
        <sl-button size="small" variant="primary" data-action="retry-item" data-item-id="${item.id}" data-batch-id="${batch?.id ?? ""}">重试本条</sl-button>
      </div>
    </div>`).join("");

  const matchedRows = matchedItems.map((item) => {
    const stale = !currentIssueKeys.has(item.issueKey);
    return `<div class="receipt-row ${item.verdict}">
      <span class="receipt-verdict ${item.verdict}">${item.verdict === "pass" ? "通过" : "不通过"}</span>
      <div class="receipt-row-copy"><b>${escapeHtml(item.issueTitle ?? item.issueKey)} <code>${escapeHtml(item.issueKey)}</code></b>${stale ? `<em class="stale-tag">缺陷已消除</em>` : ""}${item.note ? `<small>${escapeHtml(item.note)}</small>` : ""}</div>
    </div>`;
  }).join("");

  const ledgerRows = (() => {
    const list = issues();
    if (!list.length) return `<div class="empty-note">当前没有需要对账的缺陷。</div>`;
    return `<table class="ledger-table"><thead><tr><th>缺陷编号</th><th>位置 / 缺陷</th><th>工作台台账</th><th>最新机构结论</th></tr></thead><tbody>${list.map((issue) => {
      const blockIndex = project.blocks.findIndex((block) => block.id === issue.blockId) + 1;
      const record = project.defectReviews.find((item) => item.issueKey === issue.id);
      const agencyItem = batches[0]?.items.find((item) => item.matched && item.issueKey === issue.id);
      const selfStatus = reviewLedgerStatusLabel(record?.status ?? "pending");
      const selfClass = !record ? "pending" : record.status === "approved" ? "pass" : record.status === "needs-work" ? "fail" : "pending";
      const agency = agencyItem
        ? `<span class="receipt-verdict ${agencyItem.verdict}">${agencyItem.verdict === "pass" ? "通过" : "不通过"}</span><small>${escapeHtml(batches[0].round || "最新一批")}</small>`
        : `<span class="no-verdict">本轮未提及</span>`;
      return `<tr><td><code>${escapeHtml(issue.id)}</code></td><td>第 ${blockIndex} 块 · ${escapeHtml(issue.title)}</td><td><span class="ledger-status ${selfClass}">${selfStatus}</span><small>${record?.via === "agency" ? "跟随机构对账" : "工作台自评"}</small></td><td>${agency}</td></tr>`;
    }).join("")}</tbody></table>`;
  })();

  const resultBanner = lastIngestResult
    ? `<div class="ingest-result ${lastIngestResult.failed ? "has-failed" : "ok"}">本轮对账完成：对上 <b>${lastIngestResult.matched}</b> 条，<b>${lastIngestResult.failed}</b> 条待重试${lastIngestResult.skipped ? `，<b>${lastIngestResult.skipped}</b> 条此前已对上、已跳过` : ""}。</div>`
    : "";

  return `
  <input id="receipt-file" type="file" accept=".txt,.md,.markdown,.csv,text/csv,text/plain" hidden />
  <sl-dialog label="外部机构回执 · 按缺陷条目对账" open data-dialog="agency" style="--width:780px;">
    <div class="agency-dialog">
      <div class="agency-import-card">
        <div class="agency-form-row">
          <sl-input id="receipt-agency" size="small" label="复核机构" data-receipt-field="agency" value="${escapeHtml(receiptAgencyName)}"></sl-input>
          <sl-input id="receipt-round" size="small" label="复核轮次" data-receipt-field="round" value="${escapeHtml(receiptRound)}" placeholder="如：第 2 轮"></sl-input>
        </div>
        <sl-textarea id="receipt-text" rows="7" label="机构回执（每行：缺陷编号,通过/不通过,批注；可粘贴或选择回执文件）" value="${escapeHtml(agencyDraft)}" placeholder="image-block-img,不通过,替代文本需要描述图中的环节&#10;sentence-block-p1-0,通过,短句拆分清楚"></sl-textarea>
        <div class="agency-toolbar">
          <sl-button size="small" data-action="receipt-file">选择回执文件…</sl-button>
          <sl-button size="small" data-action="sample-receipt">填入示例回执</sl-button>
          <sl-button size="small" data-action="download-template">下载空白回执模板</sl-button>
          <span class="toolbar-spacer"></span>
          <sl-button size="small" variant="primary" data-action="import-new-batch">导入并对账（新一批）</sl-button>
          ${batch && batchStats(batch).failed ? `<sl-button size="small" variant="warning" outline data-action="retry-batch" data-batch-id="${batch.id}">补传文件：只补该批未对上的 ${batchStats(batch).failed} 条</sl-button>` : ""}
        </div>
        ${resultBanner}
      </div>

      ${batches.length ? `
      <section class="batch-section">
        <div class="section-heading compact">
          <div><span class="eyebrow">Agency copies</span><h3>机构回执存档（机构那份，逐条原样保留）</h3></div>
          <sl-select id="batch-select" size="small" value="${batch?.id ?? ""}">${batches.map((item) => `<sl-option value="${item.id}">${escapeHtml(item.agency)} · ${escapeHtml(item.round || `批次 ${batches.indexOf(item) + 1}`)}</sl-option>`).join("")}</sl-select>
        </div>
        ${batch ? `<div class="batch-summary">
          <span>机构：<b>${escapeHtml(batch.agency)}</b></span>
          <span>轮次：<b>${escapeHtml(batch.round || "未填写")}</b></span>
          <span>回执日期：<b>${new Date(batch.receivedAt).toLocaleDateString()}</b></span>
          <span class="summary-pass">通过 ${batchStats(batch).pass}</span>
          <span class="summary-fail">不通过 ${batchStats(batch).fail}</span>
          <span class="summary-failed">待重试 ${batchStats(batch).failed}</span>
        </div>` : ""}

        ${failedItems.length ? `<div class="receipt-groups"><h4>导入失败的条目（可逐条修改后重试）</h4>${failedRows}</div>` : ""}
        ${matchedItems.length ? `<div class="receipt-groups"><h4>已对账条目（机构结论不随工作台操作改变）</h4>${matchedRows}</div>` : `<div class="empty-note">还没有对上任何条目。</div>`}
      </section>

      <section class="batch-section">
        <div class="section-heading compact"><div><span class="eyebrow">Workbench ledger</span><h3>工作台缺陷台账（工作台这份）</h3></div></div>
        ${ledgerRows}
      </section>` : `<div class="empty-note">还没有导入过机构回执。粘贴或选择回执文件后导入即可按条目对账。</div>`}
    </div>
    <sl-button slot="footer" variant="primary" data-action="close-agency">完成</sl-button>
  </sl-dialog>`;
}

function wireLiveFields() {
  app.querySelectorAll<HTMLElement>("sl-input[data-field], sl-textarea[data-field], sl-select[data-field]").forEach((element) => {
    element.addEventListener("sl-input", () => {
      const value = (element as HTMLElement & { value: string }).value;
      const field = element.dataset.field;
      // 改写原因、批注属于编辑记录，不跟着机构结论走，也不触发重新复核
      if (field === "reason") {
        updateActiveBlock((block) => {
          block.changeReason = value;
        }, "编辑改写原因", false);
        return;
      }
      updateActiveBlock((block, draft) => {
        if (field === "source") block.text = value;
        if (field === "accessible") {
          block.accessibleText = value;
          if (block.type === "image") block.imageAlt = value;
        }
        if (field === "image-alt") {
          block.imageAlt = value;
          block.accessibleText = value;
        }
        if (field === "link-href") block.linkHref = value;
        block.reviewStatus = "pending";
        resetBlockDefectReviews(draft, block.id);
      }, "编辑无障碍文本", false);
    });
    element.addEventListener("sl-change", () => render());
  });
}

app.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "undo") undo();
  if (action === "redo") redo();
  if (action === "select-block") {
    activeBlockId = target.dataset.blockId ?? activeBlockId;
    activeIssueId = "";
    render();
  }
  if (action === "jump-issue") {
    activeIssueId = target.dataset.issueId ?? "";
    activeBlockId = target.dataset.blockId ?? activeBlockId;
    render();
    requestAnimationFrame(() => app.querySelector<HTMLElement>(".editor-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  if (action === "generate") {
    const block = activeBlock();
    const suggestion = block.type === "link"
      ? "打开水循环互动实验"
      : simplifyText(block.type === "image" ? block.imageAlt || block.text : block.text, project.glossary);
    updateActiveBlock((current, draft) => {
      if (current.type === "image") current.imageAlt = suggestion;
      current.accessibleText = suggestion;
      current.changeReason ||= "拆分长句并替换复杂表达，保留原有知识信息。";
      current.reviewStatus = "pending";
      resetBlockDefectReviews(draft, current.id);
    }, "生成易读版本");
  }
  if (action === "approve") commit("审核通过", (draft) => {
    const blockId = activeBlockId;
    syncBlockSelfReview(draft, blockId, "approved");
  });
  if (action === "needs-work") commit("标记需修改", (draft) => {
    const blockId = activeBlockId;
    syncBlockSelfReview(draft, blockId, "needs-work");
  });
  if (action === "add-comment") {
    const input = app.querySelector<HTMLElement & { value: string }>("#new-comment");
    const body = input?.value.trim();
    if (body) updateActiveBlock((block) => {
      block.comments.unshift({ id: uid("comment"), author: "当前编辑", body, createdAt: new Date().toISOString(), resolved: false, replies: [] });
    }, "添加批注");
  }
  if (action === "reply") {
    const commentId = target.dataset.commentId ?? "";
    const input = app.querySelector<HTMLElement & { value: string }>(`#reply-${CSS.escape(commentId)}`);
    const body = input?.value.trim();
    if (body) updateActiveBlock((block) => {
      block.comments.find((comment) => comment.id === commentId)?.replies.push({ id: uid("reply"), author: "当前编辑", body, createdAt: new Date().toISOString() });
    }, "回复批注");
  }
  if (action === "resolve-comment") {
    const commentId = target.dataset.commentId ?? "";
    updateActiveBlock((block) => {
      const comment = block.comments.find((item) => item.id === commentId);
      if (comment) comment.resolved = !comment.resolved;
    }, "更新批注状态");
  }
  if (action === "preview-normal") { previewMode = "normal"; render(); }
  if (action === "preview-assisted") { previewMode = "assisted"; render(); }
  if (action === "glossary") { showGlossary = true; render(); }
  if (action === "close-glossary") { showGlossary = false; render(); }
  if (action === "agency-dialog") {
    showAgency = true;
    selectedBatchId = project.batches[0]?.id ?? "";
    lastIngestResult = null;
    render();
  }
  if (action === "close-agency") { showAgency = false; render(); }
  if (action === "download-template") {
    download(`${project.title}-机构回执模板.csv`, `﻿${buildReceiptTemplate(project)}`, "text/csv;charset=utf-8");
    document.documentElement.dataset.lastAction = "已下载机构回执模板（CSV）";
  }
  if (action === "sample-receipt") {
    agencyDraft = buildSampleReceipt(project);
    render();
  }
  if (action === "receipt-file") app.querySelector<HTMLInputElement>("#receipt-file")?.click();
  if (action === "import-new-batch" || action === "retry-batch") {
    const text = (app.querySelector<HTMLElement & { value: string }>("#receipt-text")?.value ?? agencyDraft).trim();
    if (!text) {
      lastIngestResult = null;
      document.documentElement.dataset.lastAction = "回执内容为空，未导入任何条目";
      render();
      return;
    }
    const rows = parseReceiptText(text);
    if (action === "import-new-batch") {
      const batchId = uid("batch");
      const round = (app.querySelector<HTMLElement & { value: string }>("#receipt-round")?.value ?? receiptRound).trim();
      const agency = (app.querySelector<HTMLElement & { value: string }>("#receipt-agency")?.value ?? receiptAgencyName).trim() || "外部机构";
      commit("导入机构回执并按条目对账", (draft) => {
        const batch: ReviewBatch = {
          id: batchId,
          agency,
          round: round || `第 ${draft.batches.length + 1} 轮`,
          receivedAt: new Date().toISOString(),
          importedAt: new Date().toISOString(),
          items: [],
        };
        lastIngestResult = ingestReceiptRows(draft, batch, rows, new Set());
        draft.batches.unshift(batch);
      });
      selectedBatchId = batchId;
      receiptRound = "";
    } else {
      const batchId = target.dataset.batchId ?? selectedBatchId;
      commit("补传回执，只补未对上的条目", (draft) => {
        const draftBatch = draft.batches.find((item) => item.id === batchId);
        if (!draftBatch) return;
        const matchedKeys = new Set(draftBatch.items.filter((item) => item.matched).map((item) => item.issueKey));
        // 丢掉之前的坏行，等待新回执重新对；已对上的行原样保留
        draftBatch.items = draftBatch.items.filter((item) => item.matched);
        lastIngestResult = ingestReceiptRows(draft, draftBatch, rows, matchedKeys);
      });
      selectedBatchId = batchId;
    }
    agencyDraft = "";
    render();
  }
  if (action === "retry-item") {
    const batchId = target.dataset.batchId ?? selectedBatchId;
    const itemId = target.dataset.itemId ?? "";
    const row = target.closest<HTMLElement>(".receipt-row");
    const read = (field: string) => row?.querySelector<HTMLElement & { value: string }>(`[data-receipt-item-field="${field}"]`)?.value ?? "";
    commit("逐条重试机构回执", (draft) => {
      const draftBatch = draft.batches.find((item) => item.id === batchId);
      const item = draftBatch?.items.find((entry) => entry.id === itemId);
      if (!draftBatch || !item) return;
      item.issueKey = read("issueKey");
      item.verdictRaw = read("verdictRaw");
      item.note = read("note");
      retryReceiptItem(draft, draftBatch, item);
      lastIngestResult = null;
    });
  }
  if (action === "add-term") {
    const source = app.querySelector<HTMLElement & { value: string }>("#new-term-source");
    const preferred = app.querySelector<HTMLElement & { value: string }>("#new-term-preferred");
    if (source?.value.trim() && preferred?.value.trim()) {
      commit("添加术语", (draft) => { draft.glossary.push({ id: uid("term"), source: source.value.trim(), preferred: preferred.value.trim(), note: "编辑新增术语" }); });
    }
  }
  if (action === "remove-term") {
    const termId = target.dataset.termId;
    commit("删除术语", (draft) => { draft.glossary = draft.glossary.filter((term) => term.id !== termId); });
  }
  if (action === "save-version") {
    const versionId = uid("version");
    commit("保存版本快照", (draft) => {
      draft.versions.unshift({ id: versionId, label: `版本 ${draft.versions.length + 1}`, createdAt: new Date().toISOString(), blocks: structuredClone(draft.blocks), glossary: structuredClone(draft.glossary) });
      draft.versions = draft.versions.slice(0, 10);
    });
    selectedVersionId = versionId;
    render();
  }
  if (action === "approve-all") {
    commit("全部审核通过", (draft) => { draft.blocks.forEach((block) => { syncBlockSelfReview(draft, block.id, "approved"); }); });
  }
  if (action === "export") {
    download(`${project.title}-无障碍版.html`, exportHtml(project));
    document.documentElement.dataset.lastAction = "已导出无障碍 HTML";
    render();
  }
  if (action === "import") app.querySelector<HTMLInputElement>("#chapter-file")?.click();
});

app.addEventListener("sl-change", (event) => {
  const element = event.target as HTMLElement;
  if (element.id === "chapter-file") return;
  if (element.id.startsWith("heading-level-")) {
    const level = Number((element as HTMLElement & { value: string }).value);
    updateActiveBlock((block, draft) => {
      block.headingLevel = level;
      block.reviewStatus = "pending";
      resetBlockDefectReviews(draft, block.id);
    }, "修改标题层级");
  }
  if (element.id === "batch-select") {
    // 切批次前先留住文本框里尚未导入的回执
    const text = app.querySelector<HTMLElement & { value: string }>("#receipt-text");
    if (text) agencyDraft = text.value;
    selectedBatchId = (element as HTMLElement & { value: string }).value;
    lastIngestResult = null;
    render();
  }
  // 弹窗内逐行重试所用的输入，仅即时同步到 DOM 行内（真正提交发生在“重试本条”）
  if (element.matches("[data-receipt-item-field]")) {
    const itemId = (element as HTMLElement).dataset.itemId;
    const field = (element as HTMLElement).dataset.receiptItemField;
    const value = (element as HTMLElement & { value: string }).value;
    const item = project.batches.flatMap((batch) => batch.items).find((entry) => entry.id === itemId);
    if (item && field) {
      if (field === "issueKey") item.issueKey = value;
      if (field === "verdictRaw") item.verdictRaw = value;
      if (field === "note") item.note = value;
    }
    return;
  }
  // 机构/轮次输入即时更新，不触发渲染以免打断输入
  if (element.matches("[data-receipt-field]")) {
    const field = (element as HTMLElement).dataset.receiptField;
    const value = (element as HTMLElement & { value: string }).value;
    if (field === "agency") receiptAgencyName = value;
    if (field === "round") receiptRound = value;
    return;
  }
  if (element.id === "receipt-text") {
    agencyDraft = (element as HTMLElement & { value: string }).value;
  }
  if (element.id === "version-select") {
    selectedVersionId = (element as HTMLElement & { value: string }).value;
    render();
  }
  if (element.matches("[data-term-id]")) {
    const termId = element.dataset.termId;
    const value = (element as HTMLElement & { value: string }).value;
    commit("修改术语表", (draft) => { const term = draft.glossary.find((item) => item.id === termId); if (term) term.preferred = value; });
  }
});

app.addEventListener("change", (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id === "receipt-file" && input.files?.[0]) {
    void input.files[0].text().then((text) => {
      agencyDraft = text.replace(/^﻿/, "");
      input.value = "";
      render();
    });
    return;
  }
  if (input.id !== "chapter-file" || !input.files?.[0]) return;
  void input.files[0].text().then((text) => {
    commit("导入章节文本", (draft) => {
      draft.blocks = parseImportedChapter(text);
      // 新章节的缺陷编号与旧回执不再对应，台账与回执批次一并清空
      draft.defectReviews = [];
      draft.batches = [];
      selectedBatchId = "";
      lastIngestResult = null;
      activeBlockId = draft.blocks[0]?.id ?? "";
      activeIssueId = "";
    });
  });
});

app.addEventListener("input", (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id === "project-title") {
    project.title = input.value;
    saveSoon();
  }
});

window.addEventListener("online", render);
window.addEventListener("offline", render);
app.addEventListener("sl-request-close", (event) => {
  const dialog = (event.target as HTMLElement).closest<HTMLElement>("[data-dialog]");
  if (dialog?.dataset.dialog === "agency") {
    event.preventDefault();
    showAgency = false;
    render();
  }
  if (dialog?.dataset.dialog === "glossary") {
    event.preventDefault();
    showGlossary = false;
    render();
  }
});
window.addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement;
  if (target.matches("input, textarea, sl-input, sl-textarea, [contenteditable='true']")) return;
  const command = event.metaKey || event.ctrlKey;
  if (command && event.key.toLowerCase() === "z") {
    event.preventDefault();
    event.shiftKey ? redo() : undo();
    return;
  }
  if (command && event.key.toLowerCase() === "s") {
    event.preventDefault();
    const versionId = uid("version");
    commit("键盘保存版本", (draft) => { draft.versions.unshift({ id: versionId, label: `版本 ${draft.versions.length + 1}`, createdAt: new Date().toISOString(), blocks: structuredClone(draft.blocks), glossary: structuredClone(draft.glossary) }); });
    selectedVersionId = versionId;
    return;
  }
  if (event.key.toLowerCase() === "j" || event.key.toLowerCase() === "k") {
    const list = issues();
    if (!list.length) return;
    const current = Math.max(0, list.findIndex((issue) => issue.id === activeIssueId));
    const next = (current + (event.key.toLowerCase() === "j" ? 1 : -1) + list.length) % list.length;
    activeIssueId = list[next].id;
    activeBlockId = list[next].blockId;
    render();
  }
  if (event.key.toLowerCase() === "e") {
    const button = app.querySelector<HTMLElement>('[data-action="generate"]');
    button?.click();
  }
  if (event.key === "1") { previewMode = "normal"; render(); }
  if (event.key === "2") { previewMode = "assisted"; render(); }
});

render();
