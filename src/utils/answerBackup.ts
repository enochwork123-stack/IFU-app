/**
 * Answer Backup, PDF, and Word Export Utility
 * Exports Discipleship Workbook containing all Bible verses, questions, and user answers.
 */

import { COMPLETE_DISCIPLESHIP_WORKBOOK, WorkbookStep } from './workbookContent';

export const SYSTEM_STORAGE_KEYS = new Set([
  'ifu:ui-mode',
  'ifu:content_overrides',
  'ifu:admin_wishes',
]);

/**
 * Helper to escape HTML characters
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Retrieve all user-entered answers from localStorage
 */
export function getAllUserAnswers(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const answers: Record<string, string> = {};

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key) continue;

    if (key.startsWith('ifu:') && !SYSTEM_STORAGE_KEYS.has(key)) {
      const val = window.localStorage.getItem(key);
      if (val && val.trim().length > 0) {
        answers[key] = val;
      }
    }
  }

  return answers;
}

/**
 * Count total number of answered questions
 */
export function getUserAnswerCount(): number {
  return Object.keys(getAllUserAnswers()).length;
}

/**
 * Generate formatted JSON string of all answers
 */
export function generateBackupJson(): string {
  const answers = getAllUserAnswers();
  const backupData = {
    version: '1.0.0',
    type: 'discipleship_answers_backup',
    appName: 'Interactive Discipleship App (初信栽培互動式學習)',
    exportedAt: new Date().toISOString(),
    totalAnswers: Object.keys(answers).length,
    answers,
  };

  return JSON.stringify(backupData, null, 2);
}

/**
 * Helper to find an answer for a question by trying its candidate storage keys
 */
function findAnswerForQuestion(
  answers: Record<string, string>,
  candidateKeys: string[]
): { key: string; value: string } | null {
  for (const key of candidateKeys) {
    if (answers[key] && answers[key].trim().length > 0) {
      return { key, value: answers[key] };
    }
    // Also try without ifu: or with ifu:
    const altKey = key.startsWith('ifu:') ? key.replace(/^ifu:/, '') : `ifu:${key}`;
    if (answers[altKey] && answers[altKey].trim().length > 0) {
      return { key: altKey, value: answers[altKey] };
    }
  }
  return null;
}

/**
 * Generate complete HTML document containing all Bible verses, questions, and answers
 */
export function generateCompleteWorkbookHtml(options: { isWordExport?: boolean } = {}): string {
  const answers = getAllUserAnswers();
  const total = Object.keys(answers).length;
  const now = new Date();
  const dateFormatted = now.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const matchedKeys = new Set<string>();

  let stepsContent = '';

  for (const step of COMPLETE_DISCIPLESHIP_WORKBOOK) {
    let questionsHtml = '';

    for (const q of step.questions) {
      const match = findAnswerForQuestion(answers, q.storageKeys);
      if (match) {
        matchedKeys.add(match.key);
      }

      // Scriptures HTML
      let scripturesHtml = '';
      if (q.scriptures && q.scriptures.length > 0) {
        scripturesHtml += `
          <div class="scripture-container">
            <div class="scripture-header">📜 相關聖經經文：</div>
        `;
        for (const sc of q.scriptures) {
          scripturesHtml += `
            <div class="scripture-item">
              <div class="scripture-ref"><strong>【${escapeHtml(sc.book)} ${escapeHtml(sc.reference)}】</strong></div>
              <div class="scripture-chinese">「${escapeHtml(sc.chinese)}」</div>
              ${sc.english ? `<div class="scripture-english"><em>"${escapeHtml(sc.english)}"</em></div>` : ''}
            </div>
          `;
        }
        scripturesHtml += `</div>`;
      }

      // Answer HTML
      let answerHtml = '';
      if (match && match.value.trim().length > 0) {
        const formattedText = match.value
          .split('\n')
          .map((line) => (line.trim() ? `<p class="ans-line">${escapeHtml(line)}</p>` : `<br/>`))
          .join('');

        answerHtml = `
          <div class="answer-box answered">
            <div class="answer-label">✍️ <strong>我的回答與筆記：</strong></div>
            <div class="answer-body">${formattedText}</div>
          </div>
        `;
      } else {
        answerHtml = `
          <div class="answer-box unanswered">
            <div class="answer-label empty-label">✍️ <strong>我的回答與筆記：</strong></div>
            <div class="answer-body empty-text"><em>（尚未填寫作答）</em></div>
          </div>
        `;
      }

      questionsHtml += `
        <div class="question-card">
          <div class="question-title">
            <span class="q-badge">問題 ${escapeHtml(q.number)}</span>
            <span class="q-name">${escapeHtml(q.title)}</span>
          </div>
          <div class="question-prompt">${escapeHtml(q.prompt)}</div>
          ${scripturesHtml}
          ${answerHtml}
        </div>
      `;
    }

    stepsContent += `
      <section class="step-section">
        <div class="step-header">
          <div class="step-number">第 ${step.order} 課</div>
          <h2 class="step-title">${escapeHtml(step.title)} <span class="step-subtitle">${escapeHtml(step.subtitle)}</span></h2>
          <p class="step-desc">${escapeHtml(step.description)}</p>
        </div>
        <div class="step-questions">
          ${questionsHtml}
        </div>
      </section>
    `;
  }

  // Check for any extra answers that didn't match standard curriculum keys
  const extraKeys = Object.keys(answers).filter((k) => !matchedKeys.has(k));
  if (extraKeys.length > 0) {
    let extraQuestionsHtml = '';
    extraKeys.forEach((key, idx) => {
      const cleanKey = key.replace(/^ifu:/, '');
      const val = answers[key];
      const formattedText = val
        .split('\n')
        .map((line) => (line.trim() ? `<p class="ans-line">${escapeHtml(line)}</p>` : `<br/>`))
        .join('');

      extraQuestionsHtml += `
        <div class="question-card">
          <div class="question-title">
            <span class="q-badge">筆記 #${idx + 1}</span>
            <span class="q-name">${escapeHtml(cleanKey)}</span>
          </div>
          <div class="answer-box answered">
            <div class="answer-label">✍️ <strong>筆記內容：</strong></div>
            <div class="answer-body">${formattedText}</div>
          </div>
        </div>
      `;
    });

    stepsContent += `
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">📚 其他延伸學習與自訂作答紀錄</h2>
        </div>
        <div class="step-questions">
          ${extraQuestionsHtml}
        </div>
      </section>
    `;
  }

  const wordXmlHeader = options.isWordExport
    ? `<!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->`
    : '';

  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>門徒生命成長路徑（初信栽培）學習手冊與作答紀錄</title>
  ${wordXmlHeader}
  <style>
    @page {
      size: A4 portrait;
      margin: 1.8cm 1.5cm 1.8cm 1.5cm;
    }
    *, *:before, *:after {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", "Noto Sans TC", sans-serif;
      font-size: 10.5pt;
      line-height: 1.6;
      color: #28351c;
      background-color: #ffffff;
      margin: 0;
      padding: ${options.isWordExport ? '24px' : '32px'};
    }
    .doc-header {
      border-bottom: 3px solid #795900;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .doc-main-title {
      font-size: 20pt;
      font-weight: 800;
      color: #28351c;
      margin: 0 0 6px 0;
      line-height: 1.3;
    }
    .doc-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 10px;
      background-color: #f7f6f0;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 10pt;
      color: #555555;
    }
    .meta-item {
      display: inline-block;
      margin-right: 14px;
    }
    .step-section {
      margin-bottom: 32px;
      page-break-inside: auto;
    }
    .step-header {
      background: linear-gradient(135deg, #f4f2ea 0%, #ebe7db 100%);
      border-left: 6px solid #795900;
      padding: 14px 18px;
      border-radius: 6px;
      margin-bottom: 18px;
      page-break-after: avoid;
    }
    .step-number {
      font-size: 9.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #795900;
      margin-bottom: 2px;
    }
    .step-title {
      font-size: 15pt;
      font-weight: 700;
      color: #28351c;
      margin: 0 0 4px 0;
    }
    .step-subtitle {
      font-size: 11pt;
      font-weight: normal;
      color: #6d6a60;
      margin-left: 6px;
    }
    .step-desc {
      font-size: 10pt;
      color: #505548;
      margin: 4px 0 0 0;
    }
    .question-card {
      border: 1px solid #e2ded4;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 16px 18px;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    .question-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11.5pt;
      font-weight: 700;
      color: #28351c;
      margin-bottom: 8px;
    }
    .q-badge {
      display: inline-block;
      background-color: #795900;
      color: #ffffff;
      font-size: 9pt;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .question-prompt {
      font-size: 10.5pt;
      font-weight: 600;
      color: #384230;
      margin-bottom: 12px;
      line-height: 1.5;
    }
    .scripture-container {
      background-color: #fbfaf7;
      border-left: 3px solid #795900;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      margin: 10px 0 14px 0;
    }
    .scripture-header {
      font-size: 9.5pt;
      font-weight: 700;
      color: #795900;
      margin-bottom: 6px;
    }
    .scripture-item {
      margin-bottom: 8px;
    }
    .scripture-item:last-child {
      margin-bottom: 0;
    }
    .scripture-ref {
      font-size: 10pt;
      color: #28351c;
    }
    .scripture-chinese {
      font-size: 10.5pt;
      color: #1e2815;
      margin: 2px 0;
      line-height: 1.5;
    }
    .scripture-english {
      font-size: 9pt;
      color: #666666;
      line-height: 1.4;
    }
    .answer-box {
      border-radius: 6px;
      padding: 12px 16px;
      margin-top: 10px;
    }
    .answer-box.answered {
      background-color: #f4f8f0;
      border: 1px solid #cce0c2;
      border-left: 4px solid #3c6e2d;
    }
    .answer-box.unanswered {
      background-color: #faf9f6;
      border: 1px dashed #d5d1c5;
    }
    .answer-label {
      font-size: 9.5pt;
      color: #3c6e2d;
      margin-bottom: 6px;
    }
    .answer-label.empty-label {
      color: #8c887b;
    }
    .answer-body {
      font-size: 10.5pt;
      color: #1a1a1a;
      line-height: 1.6;
    }
    .ans-line {
      margin: 3px 0;
    }
    .empty-text {
      color: #9c978b;
      font-size: 9.5pt;
    }
    .doc-footer {
      border-top: 1px solid #d5d1c5;
      padding-top: 16px;
      margin-top: 40px;
      text-align: center;
      font-size: 9pt;
      color: #8c887b;
      page-break-inside: avoid;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
      .step-section {
        page-break-inside: auto;
      }
      .question-card {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="doc-header">
    <h1 class="doc-main-title">門徒生命成長路徑（初信栽培）學習手冊與作答紀錄</h1>
    <div class="doc-meta">
      <span class="meta-item"><strong>📅 匯出時間：</strong>${dateFormatted}</span>
      <span class="meta-item"><strong>📖 培訓單元：</strong>共 12 課</span>
      <span class="meta-item"><strong>✍️ 已填寫作答：</strong>共 ${total} 題</span>
    </div>
  </div>

  ${stepsContent}

  <div class="doc-footer">
    <p><em>由 互動式門徒培訓 App (Interactive Discipleship App) 自動生成</em></p>
  </div>
</body>
</html>`;
}

/**
 * Helper to trigger browser download of a text file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  try {
    const cleanMime = mimeType.includes('charset') ? mimeType : `${mimeType};charset=utf-8`;
    // Prepend UTF-8 BOM so text editors and Word properly recognize Chinese characters
    const blob = new Blob(['\ufeff', content], { type: cleanMime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.position = 'fixed';
    a.style.left = '-9999px';
    a.style.top = '-9999px';
    a.href = url;
    a.download = filename;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
    }, 60000);
  } catch (err) {
    console.error('Error during file download:', err);
    try {
      const encodedUri = `data:${mimeType};charset=utf-8,` + encodeURIComponent('\ufeff' + content);
      const a = document.createElement('a');
      a.style.position = 'fixed';
      a.style.left = '-9999px';
      a.style.top = '-9999px';
      a.href = encodedUri;
      a.download = filename;
      a.setAttribute('download', filename);
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
      }, 60000);
    } catch (fallbackErr) {
      console.error('Fallback download also failed:', fallbackErr);
    }
  }
}

/**
 * Export answers as JSON backup file
 */
export function exportAnswersAsJson(): void {
  const jsonStr = generateBackupJson();
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(
    jsonStr,
    `discipleship-answers-backup-${dateStr}.json`,
    'application/json'
  );
}

/**
 * Export complete workbook as Word Document file (.doc)
 * Contains all Bible verses, question prompts, and user answers
 */
export function exportAnswersAsWord(): void {
  const wordHtml = generateCompleteWorkbookHtml({ isWordExport: true });
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(
    wordHtml,
    `discipleship-study-workbook-${dateStr}.doc`,
    'application/msword'
  );
}

/**
 * Export complete workbook as PDF via print preview / save as PDF
 * Formatted with vector graphics, crisp typography, Bible verses, questions, and answers
 */
export function exportAnswersAsPdf(): void {
  const htmlContent = generateCompleteWorkbookHtml({ isWordExport: false });

  // Use a hidden iframe for seamless browser printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    console.error('Unable to access iframe document for printing');
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  // Trigger print after iframe renders
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('Print trigger error:', e);
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 60000);
    }
  }, 400);
}

/**
 * Import answers from JSON text and write into localStorage
 */
export function importAnswersFromJsonString(rawContent: string): { success: boolean; count: number } {
  try {
    const parsed = JSON.parse(rawContent);
    let answersMap: Record<string, any> = {};

    if (parsed && typeof parsed === 'object') {
      if (parsed.answers && typeof parsed.answers === 'object') {
        answersMap = parsed.answers;
      } else if (parsed.type === 'discipleship_answers_backup') {
        answersMap = parsed.answers || {};
      } else {
        // Direct key-value dictionary
        answersMap = parsed;
      }
    }

    let loadedCount = 0;
    const restoredKeys: string[] = [];

    for (const [rawKey, val] of Object.entries(answersMap)) {
      if (typeof val === 'string') {
        // Normalize key to have ifu: prefix
        const storageKey = rawKey.startsWith('ifu:') ? rawKey : `ifu:${rawKey}`;
        if (!SYSTEM_STORAGE_KEYS.has(storageKey)) {
          window.localStorage.setItem(storageKey, val);
          restoredKeys.push(storageKey);
          loadedCount++;
        }
      }
    }

    // Broadcast update event to all active components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('ifu-answers-updated', {
          detail: { count: loadedCount, keys: restoredKeys },
        })
      );
      window.dispatchEvent(new Event('storage'));
    }

    return { success: true, count: loadedCount };
  } catch (err: any) {
    console.error('Failed to import answers JSON:', err);
    throw new Error(err?.message || '檔案格式錯誤，無法解析 JSON 內容。');
  }
}
