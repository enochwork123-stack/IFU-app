---
name: worksheet-extractor
description: Extract the content of the IFU Bible Study worksheet (Word document/PDF) by chapter into structured Markdown files, replacing underlines or spaces with interactive user input placeholders for the React codebase.
---

# Worksheet Extractor Skill

Use this skill when you need to parse/extract chapters from the Word document (`IFU_BS_2.2 edition (1).docx`) or PDF version, format the text, and insert user input placeholders.

## Required Workflow

1. Check that the source parsed elements file exists: `IFU Worksheet/inspect_out.txt`.
2. Run the extraction helper script:
   ```bash
   node .codex/skills/worksheet-extractor/scripts/extract-chapters.mjs
   ```
3. Verify the generated markdown files in the output folder:
   * Files should be named `chapter-01.md` through `chapter-12.md`.
   * Check that all scripture references and chinese/english text blocks are present.
   * Verify that single-line blanks or inline blanks are converted to `[__input:key__]`.
   * Verify that multi-line blanks or reflection text areas are converted to `[__textarea:key__]`.

## Placeholder Formats

* **Question and Part Numbering**: Annotate chapters with explicit numbering prefixes (e.g., `[Question 1]`, `[Question 2 Part A]`, or `[Part B]`) to preserve the worksheet's structure.
* **Short/Inline Blanks**: Represented as `[__input:key__]`. These map to `<FillInTheBlank>` component inputs in the React integration.
* **Large Answer Areas**: Represented as `[__textarea:key__]`. These map to `<SavedAnswer>` textarea inputs in the React integration.

## Mapping Cheatsheet

* `新生命栽培課程(X) [Title]` → Chapter header.
* Paragraphs ending with questions or prompts → Question components.
* Underlines following text/questions → Input/Textarea placeholders with unique keys.
* Scripture quotations → Rendered using scripture card components.

## Checklist

- [ ] Run the extraction script and check for parse errors.
- [ ] Verify each of the 12 generated Markdown files.
- [ ] Check that all text underlines are correctly replaced by placeholders.
- [ ] Ensure unique, structured storage keys (e.g., `ch1-q1-a`) are assigned.
