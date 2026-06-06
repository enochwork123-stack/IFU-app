#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, resolve } from 'node:path';

const args = process.argv.slice(2);

function printUsage() {
  console.log(`Usage:
  node .codex/skills/notion-markdown-transform/scripts/prepare-notion-markdown.mjs <input.md> [--out prepared.ts] [--clean cleaned.md] [--title "Title"] [--slug slug]

Outputs a dependency-free, typed intermediate document that an agent can map into IFU StudyModule data or route-level TSX.`);
}

function parseCliArgs(argv) {
  const parsed = {
    inputPath: undefined,
    outputPath: undefined,
    cleanedPath: undefined,
    title: undefined,
    slug: undefined,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
      continue;
    }

    if (['--out', '--clean', '--title', '--slug'].includes(arg)) {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`);
      }

      if (arg === '--out') {
        parsed.outputPath = value;
      } else if (arg === '--clean') {
        parsed.cleanedPath = value;
      } else if (arg === '--title') {
        parsed.title = value;
      } else if (arg === '--slug') {
        parsed.slug = value;
      }

      index += 1;
      continue;
    }

    if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    }

    if (parsed.inputPath) {
      throw new Error(`Unexpected extra input: ${arg}`);
    }

    parsed.inputPath = arg;
  }

  return parsed;
}

const cli = parseCliArgs(args);

if (args.length === 0 || cli.help) {
  printUsage();
  process.exit(args.length === 0 ? 1 : 0);
}

const inputPath = cli.inputPath;

if (!inputPath) {
  printUsage();
  process.exit(1);
}

const absoluteInputPath = resolve(inputPath);
const inputBaseName = basename(inputPath, extname(inputPath));
const outputPath = resolve(cli.outputPath ?? `${dirname(absoluteInputPath)}/${inputBaseName}.prepared.ts`);
const cleanedPath = cli.cleanedPath ? resolve(cli.cleanedPath) : undefined;
const explicitTitle = cli.title;
const explicitSlug = cli.slug;

const metadataLinePatterns = [
  /^created(?: time)?:\s*.+$/i,
  /^last edited(?: time)?:\s*.+$/i,
  /^last edited by:\s*.+$/i,
  /^created by:\s*.+$/i,
  /^tags?:\s*.+$/i,
  /^status:\s*.+$/i,
  /^date:\s*.+$/i,
  /^url:\s*https?:\/\/www\.notion\.so\/.+$/i,
  /^exported from notion\b.*$/i,
];

function normalizeText(raw) {
  let text = raw
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/[\u200B-\u200D\u2060]/g, '')
    .replace(/[ \t]+$/gm, '');

  text = stripYamlFrontmatter(text);
  text = stripNotionArtifacts(text);
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return `${text}\n`;
}

function stripYamlFrontmatter(text) {
  if (!text.startsWith('---\n')) {
    return text;
  }

  const end = text.indexOf('\n---', 4);
  if (end === -1) {
    return text;
  }

  return text.slice(end + 5).replace(/^\n+/, '');
}

function stripNotionArtifacts(text) {
  const lines = text.split('\n');
  const cleaned = [];
  let skippingPropertyTable = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^table of contents$/i.test(trimmed)) {
      continue;
    }

    if (/^\|\s*(property|name)\s*\|\s*(value|type)\s*\|/i.test(trimmed)) {
      skippingPropertyTable = true;
      continue;
    }

    if (skippingPropertyTable) {
      if (/^\|/.test(trimmed) || /^\|?\s*:?-{3,}:?\s*\|/.test(trimmed)) {
        continue;
      }
      skippingPropertyTable = false;
    }

    if (metadataLinePatterns.some((pattern) => pattern.test(trimmed))) {
      continue;
    }

    cleaned.push(line);
  }

  return cleaned.join('\n');
}

function slugify(value) {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'notion-export';
}

function blockId(prefix, index) {
  return `${prefix}-${String(index + 1).padStart(2, '0')}`;
}

function isTableSeparator(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cleanInline(cell.trim()));
}

function cleanInline(value) {
  return value
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, page, label) => label || page)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function parseBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  const warnings = [];
  let index = 0;

  function pushParagraph(paragraphLines) {
    const text = cleanInline(paragraphLines.join(' ').replace(/\s+/g, ' '));
    if (text) {
      blocks.push({ id: blockId('paragraph', blocks.length), kind: 'paragraph', text });
    }
  }

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (heading) {
      blocks.push({
        id: blockId('heading', blocks.length),
        kind: 'heading',
        depth: heading[1].length,
        text: cleanInline(heading[2]),
      });
      index += 1;
      continue;
    }

    if (/^```/.test(trimmed)) {
      const language = trimmed.slice(3).trim() || undefined;
      const codeLines = [];
      index += 1;

      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index >= lines.length) {
        warnings.push('Unclosed fenced code block.');
      } else {
        index += 1;
      }

      blocks.push({
        id: blockId('code', blocks.length),
        kind: 'code',
        language,
        text: codeLines.join('\n').trim(),
      });
      continue;
    }

    if (/^\|/.test(trimmed) && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
      const headers = splitTableRow(trimmed);
      const rows = [];
      index += 2;

      while (index < lines.length && /^\|/.test(lines[index].trim())) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }

      blocks.push({
        id: blockId('table', blocks.length),
        kind: 'table',
        headers,
        rows,
      });
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines = [];

      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }

      const text = cleanInline(quoteLines.join(' '));
      blocks.push({
        id: blockId('quote', blocks.length),
        kind: 'quote',
        text,
        possibleScripture: /\b(?:gen|exo|ps|psalm|matt|mark|luke|john|rom|cor|eph|phil|thess|tim|heb|pet|rev|創|出|詩|太|可|路|約|羅|林|弗|腓|帖|提前|來|彼|啟)\b/i.test(text),
      });
      continue;
    }

    if (/^[-*+]\s+\[[ xX]\]\s+/.test(trimmed)) {
      const items = [];

      while (index < lines.length && /^[-*+]\s+\[[ xX]\]\s+/.test(lines[index].trim())) {
        const match = /^[-*+]\s+\[([ xX])\]\s+(.+)$/.exec(lines[index].trim());
        items.push({
          checked: Boolean(match?.[1]?.trim()),
          text: cleanInline(match?.[2] ?? ''),
        });
        index += 1;
      }

      blocks.push({
        id: blockId('checklist', blocks.length),
        kind: 'checklist',
        items,
      });
      continue;
    }

    if (/^[-*+]\s+/.test(trimmed) || /^\d+[.)]\s+/.test(trimmed)) {
      const ordered = /^\d+[.)]\s+/.test(trimmed);
      const items = [];
      const pattern = ordered ? /^\d+[.)]\s+(.+)$/ : /^[-*+]\s+(.+)$/;

      while (index < lines.length && pattern.test(lines[index].trim())) {
        const match = pattern.exec(lines[index].trim());
        items.push(cleanInline(match?.[1] ?? ''));
        index += 1;
      }

      blocks.push({
        id: blockId(ordered ? 'ordered-list' : 'unordered-list', blocks.length),
        kind: 'list',
        ordered,
        items,
      });
      continue;
    }

    const paragraphLines = [line];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6})\s+/.test(lines[index].trim()) &&
      !/^```/.test(lines[index].trim()) &&
      !/^\|/.test(lines[index].trim()) &&
      !/^>\s?/.test(lines[index].trim()) &&
      !/^[-*+]\s+/.test(lines[index].trim()) &&
      !/^\d+[.)]\s+/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    pushParagraph(paragraphLines);
  }

  return { blocks, warnings };
}

function inferTitle(markdown) {
  const heading = markdown.match(/^#\s+(.+)$/m);
  return cleanInline(heading?.[1] ?? inputBaseName.replace(/[-_]+/g, ' '));
}

const raw = readFileSync(absoluteInputPath, 'utf8');
const cleanedMarkdown = normalizeText(raw);
const title = explicitTitle ?? inferTitle(cleanedMarkdown);
const slug = explicitSlug ?? slugify(title);
const parsed = parseBlocks(cleanedMarkdown);

const document = {
  sourceFile: absoluteInputPath,
  title,
  slug,
  generatedAt: new Date().toISOString(),
  warnings: parsed.warnings,
  blocks: parsed.blocks,
};

const output = `export type PreparedNotionBlock =
  | { readonly id: string; readonly kind: 'heading'; readonly depth: number; readonly text: string }
  | { readonly id: string; readonly kind: 'paragraph'; readonly text: string }
  | { readonly id: string; readonly kind: 'quote'; readonly text: string; readonly possibleScripture: boolean }
  | { readonly id: string; readonly kind: 'list'; readonly ordered: boolean; readonly items: readonly string[] }
  | { readonly id: string; readonly kind: 'checklist'; readonly items: readonly { readonly checked: boolean; readonly text: string }[] }
  | { readonly id: string; readonly kind: 'table'; readonly headers: readonly string[]; readonly rows: readonly (readonly string[])[] }
  | { readonly id: string; readonly kind: 'code'; readonly language?: string; readonly text: string };

export interface PreparedNotionDocument {
  readonly sourceFile: string;
  readonly title: string;
  readonly slug: string;
  readonly generatedAt: string;
  readonly warnings: readonly string[];
  readonly blocks: readonly PreparedNotionBlock[];
}

export const preparedNotionDocument = ${JSON.stringify(document, null, 2)} as const satisfies PreparedNotionDocument;
`;

writeFileSync(outputPath, output, 'utf8');

if (cleanedPath) {
  writeFileSync(cleanedPath, cleanedMarkdown, 'utf8');
}

console.log(`Prepared ${parsed.blocks.length} blocks from ${absoluteInputPath}`);
console.log(`Typed output: ${outputPath}`);
if (cleanedPath) {
  console.log(`Cleaned markdown: ${cleanedPath}`);
}
if (parsed.warnings.length > 0) {
  console.log('Warnings:');
  for (const warning of parsed.warnings) {
    console.log(`- ${warning}`);
  }
}
