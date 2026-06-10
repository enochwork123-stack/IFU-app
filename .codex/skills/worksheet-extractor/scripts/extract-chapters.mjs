import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const inspectOutPath = resolve('IFU Worksheet/inspect_out.txt');
const outputDir = resolve('IFU Worksheet/extracted_chapters');

// Ensure output directory exists
mkdirSync(outputDir, { recursive: true });

const rawText = readFileSync(inspectOutPath, 'utf8');
const lines = rawText.split('\n');

// Parse raw text into structured tokens
const tokens = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith("P: '") && line.endsWith("'")) {
    // Extract string inside single quotes, handle escaped quotes
    let text = line.substring(4, line.length - 1);
    // Unescape common unicode/escaped chars
    text = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    text = text.replace(/\\'/g, "'").trim();
    tokens.push({ type: 'paragraph', text });
  } else if (line === '[TAB]') {
    tokens.push({ type: 'tab' });
  } else if (line.startsWith('[UNDERLINE:')) {
    tokens.push({ type: 'underline' });
  }
}

// Group tokens by Chapter
const chapters = [];
let currentChapter = null;

for (let i = 0; i < tokens.length; i++) {
  const token = tokens[i];
  if (token.type === 'paragraph') {
    // Detect chapter titles like "新生命栽培課程(X) [Chapter Name]..."
    const match = /^新生命栽培課程\((\d+)\)\s*(.*)$/.exec(token.text);
    if (match) {
      const chNum = parseInt(match[1], 10);
      let title = match[2].trim();
      
      // Clean title repeats like "持守神的話新生命栽培課程(7) 持守神的話"
      title = title.replace(/新生命栽培課程\(\d+\).*/g, '').trim();
      
      // Check if we already created this chapter to prevent duplicate headers
      if (!currentChapter || currentChapter.number !== chNum) {
        currentChapter = {
          number: chNum,
          title: title,
          tokens: []
        };
        chapters.push(currentChapter);
      }
      continue;
    }
  }

  if (currentChapter) {
    currentChapter.tokens.push(token);
  }
}

// Post-process each chapter's tokens into a structured Markdown document
chapters.forEach((ch) => {
  const mdLines = [];
  mdLines.push(`# Chapter ${ch.number}: ${ch.title}`);
  mdLines.push('');

  const chTokens = ch.tokens;
  let tIdx = 0;
  let questionCount = 0;
  let currentQuestionNum = null;
  let partCount = 0;
  
  // Keep track of the last few paragraphs to deduplicate repeats from docx columns
  const recentParagraphs = [];

  while (tIdx < chTokens.length) {
    const token = chTokens[tIdx];

    // 1. Detect Scripture Blocks
    // Typically: Book name, Ref (e.g. Joh 1:12), Chinese text, English text
    if (token.type === 'paragraph' && tIdx + 2 < chTokens.length) {
      const nextToken = chTokens[tIdx + 1];
      const nextNextToken = chTokens[tIdx + 2];
      
      // Scripture references usually contain standard English book abbreviations (e.g. Joh, Mat, Rom, Psm, etc.)
      const isRef = nextToken.type === 'paragraph' && 
                    /\b(Joh|Mat|Psm|Rom|Gal|Eph|Phil|Col|2Tim|1The|2Cor|1Joh|Jam|Isa|Josh|Luk|Mar|Acts|Heb|Rev)\b/i.test(nextToken.text);
      
      if (isRef && nextNextToken.type === 'paragraph') {
        const book = token.text;
        const ref = nextToken.text;
        const chinese = nextNextToken.text;
        
        let english = '';
        let advance = 3;
        
        if (tIdx + 3 < chTokens.length && chTokens[tIdx + 3].type === 'paragraph') {
          // If the 4th line is English (contains letters)
          const fourthText = chTokens[tIdx + 3].text;
          if (/[a-zA-Z]/.test(fourthText) && 
              !/^新生命栽培/.test(fourthText) && 
              !/^(問題|\d+|附件)/.test(fourthText)) {
            english = fourthText;
            advance = 4;
          }
        }

        mdLines.push(`> **${book} ${ref}**`);
        mdLines.push(`> ${chinese}`);
        if (english) {
          mdLines.push(`> *${english}*`);
        }
        mdLines.push('');
        
        tIdx += advance;
        continue;
      }
    }

    // 2. Detect Questions and Input Blanks/Textareas
    if (token.type === 'paragraph') {
      const text = token.text;
      
      // Skip duplicate headers if any got through
      if (/^新生命栽培/.test(text)) {
        tIdx++;
        continue;
      }

      // Sliding window deduplication
      if (text.length > 5 && recentParagraphs.includes(text)) {
        tIdx++;
        continue;
      }
      
      // Add to recent list
      recentParagraphs.push(text);
      if (recentParagraphs.length > 8) {
        recentParagraphs.shift();
      }

      // Check if it's a question or statement that requires user input
      const isQuestion = /(\?|？|呢)/.test(text) || 
                         /(:|：)\s*$/.test(text) || 
                         /^\d+\s*[\u4e00-\u9fa5]/.test(text) ||
                         /^(信主|姓名|關於|時間|方式)/.test(text);
      
      if (isQuestion) {
        // A paragraph is a new main question if it contains a question mark, ends with a colon, or starts with a digit
        const isNewMainQuestion = /(\?|？)/.test(text) || /(:|：)\s*$/.test(text) || /^\s*\d+/.test(text);
        
        // Detect if it starts with a number prefix
        const numMatch = /^\s*(\d+)[\s.、:-]*(.*)$/.exec(text);
        
        if (isNewMainQuestion) {
          if (numMatch) {
            questionCount = parseInt(numMatch[1], 10);
            currentQuestionNum = questionCount.toString();
          } else {
            questionCount++;
            currentQuestionNum = questionCount.toString();
          }
          partCount = 0;
          const cleanedText = numMatch ? numMatch[2].trim() : text;
          mdLines.push(`### [Question ${currentQuestionNum}] ${cleanedText}`);
        } else {
          // It's a sub-part
          if (currentQuestionNum !== null) {
            partCount++;
            const partLetter = String.fromCharCode(64 + partCount);
            mdLines.push(`### [Question ${currentQuestionNum} Part ${partLetter}] ${text}`);
          } else {
            questionCount++;
            currentQuestionNum = questionCount.toString();
            partCount = 0;
            mdLines.push(`### [Question ${currentQuestionNum}] ${text}`);
          }
        }
        mdLines.push('');

        // Look ahead for underlines or empty spacing that implies input
        let hasUnderline = false;
        let emptyCount = 0;
        let subIndex = tIdx + 1;
        
        while (subIndex < chTokens.length) {
          const subToken = chTokens[subIndex];
          if (subToken.type === 'underline') {
            hasUnderline = true;
            subIndex++;
          } else if (subToken.type === 'tab') {
            subIndex++;
          } else if (subToken.type === 'paragraph' && subToken.text === '') {
            emptyCount++;
            subIndex++;
          } else {
            break;
          }
        }

        let inputKey = '';
        if (partCount > 0) {
          const partLetter = String.fromCharCode(64 + partCount);
          inputKey = `ch${ch.number}-q${currentQuestionNum}-${partLetter.toLowerCase()}`;
        } else {
          inputKey = `ch${ch.number}-q${currentQuestionNum}`;
        }

        // If it has underlines immediately or consecutive empty paragraph slots, it expects input
        if (hasUnderline || emptyCount > 0) {
          if (emptyCount >= 2 || (hasUnderline && emptyCount > 0)) {
            mdLines.push(`[__textarea:${inputKey}__]`);
          } else {
            mdLines.push(`[__input:${inputKey}__]`);
          }
          mdLines.push('');
        }
        
        tIdx = subIndex;
        continue;
      }
      
      // Check if it's a sub-question or list item that has inline underlines
      // e.g. "太 6:9 讚美 (Adoration)"
      let nextSub = tIdx + 1;
      let hasUnderlineAhead = false;
      while (nextSub < chTokens.length && (chTokens[nextSub].type === 'tab' || chTokens[nextSub].type === 'underline')) {
        if (chTokens[nextSub].type === 'underline') {
          hasUnderlineAhead = true;
        }
        nextSub++;
      }

      if (hasUnderlineAhead) {
        if (currentQuestionNum !== null) {
          partCount++;
          const partLetter = String.fromCharCode(64 + partCount);
          const inputKey = `ch${ch.number}-q${currentQuestionNum}-${partLetter.toLowerCase()}`;
          mdLines.push(`* **[Question ${currentQuestionNum} Part ${partLetter}]** ${text} [__input:${inputKey}__]`);
        } else {
          questionCount++;
          currentQuestionNum = questionCount.toString();
          partCount = 0;
          const inputKey = `ch${ch.number}-q${currentQuestionNum}`;
          mdLines.push(`* **[Question ${currentQuestionNum}]** ${text} [__input:${inputKey}__]`);
        }
        mdLines.push('');
        tIdx = nextSub;
        continue;
      }

      // Regular text block
      mdLines.push(text);
      mdLines.push('');
      tIdx++;
      continue;
    }

    tIdx++;
  }

  // Write out the processed chapter file
  const fileName = `chapter-${String(ch.number).padStart(2, '0')}.md`;
  const filePath = resolve(outputDir, fileName);
  writeFileSync(filePath, mdLines.join('\n'), 'utf8');
  console.log(`Generated: ${filePath}`);
});

console.log(`Extraction complete. Generated ${chapters.length} chapters under ${outputDir}`);
