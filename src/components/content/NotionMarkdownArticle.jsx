import { Icon } from '../Icon';

function cleanMarkdownText(value) {
  return value
    .replace(/^#+\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .trim();
}

function parseMarkdownArticle(markdown) {
  const lines = markdown
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      return (
        trimmed &&
        trimmed !== '---' &&
        trimmed !== '<aside>' &&
        trimmed !== '</aside>' &&
        trimmed !== '💡' &&
        trimmed !== '🔗' &&
        !trimmed.startsWith('Root Tag:') &&
        !trimmed.startsWith('Type:')
      );
    });

  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const trimmed = lines[index].trim();

    const heading = /^(#{1,4})\s+(.+)$/.exec(trimmed);
    if (heading) {
      blocks.push({
        kind: 'heading',
        depth: heading[1].length,
        text: cleanMarkdownText(heading[2]),
      });
      index += 1;
      continue;
    }

    if (/^\|/.test(trimmed) && index + 1 < lines.length) {
      const rows = [];
      while (index < lines.length && /^\|/.test(lines[index].trim())) {
        const row = lines[index]
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map(cleanMarkdownText)
          .filter((cell) => cell && !/^:?-{3,}:?$/.test(cell));
        if (row.length > 0) {
          rows.push(row);
        }
        index += 1;
      }
      blocks.push({ kind: 'table', rows });
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(cleanMarkdownText(lines[index].trim().replace(/^>\s?/, '')));
        index += 1;
      }
      blocks.push({ kind: 'quote', text: quoteLines.join(' ') });
      continue;
    }

    if (/^[-*]\s+/.test(trimmed) || /^\d+[.)]\s+/.test(trimmed)) {
      const items = [];
      const ordered = /^\d+[.)]\s+/.test(trimmed);
      const pattern = ordered ? /^\d+[.)]\s+(.+)$/ : /^[-*]\s+(.+)$/;
      while (index < lines.length && pattern.test(lines[index].trim())) {
        items.push(cleanMarkdownText(lines[index].trim().replace(pattern, '$1')));
        index += 1;
      }
      blocks.push({ kind: 'list', ordered, items });
      continue;
    }

    blocks.push({ kind: 'paragraph', text: cleanMarkdownText(trimmed) });
    index += 1;
  }

  return blocks;
}

function ArticleQuote({ children }) {
  return (
    <blockquote className="rounded-[1.45rem] border-l-4 border-l-secondary bg-secondary-fixed/30 p-5 font-headline text-[1.08rem] leading-8 text-primary break-words">
      {children}
    </blockquote>
  );
}

export function NotionMarkdownArticle({ markdown }) {
  const blocks = parseMarkdownArticle(markdown);

  return (
    <div className="grid gap-6 w-full max-w-full overflow-x-hidden">
      {blocks.map((block, index) => {
        if (block.kind === 'heading') {
          const isTitle = block.depth === 1;
          return (
            <section
              key={`${block.kind}-${index}`}
              className={
                isTitle
                  ? 'rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]'
                  : 'rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]'
              }
            >
              {isTitle ? (
                <div className="mb-3 flex items-center gap-3 text-secondary">
                  <Icon name="article" className="text-[22px]" />
                  <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                    原始文章
                  </p>
                </div>
              ) : null}
              <h2
                className={`font-headline leading-tight text-primary break-words ${
                  isTitle ? 'text-[1.9rem]' : 'text-[1.55rem]'
                }`}
              >
                {block.text}
              </h2>
            </section>
          );
        }

        if (block.kind === 'quote') {
          return <ArticleQuote key={`${block.kind}-${index}`}>{block.text}</ArticleQuote>;
        }

        if (block.kind === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul';
          return (
            <section
              key={`${block.kind}-${index}`}
              className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]"
            >
              <ListTag className="ml-5 space-y-3 text-[1.02rem] leading-8 text-on-surface-variant break-words">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className={block.ordered ? 'list-decimal' : 'list-disc'}
                  >
                    {item}
                  </li>
                ))}
              </ListTag>
            </section>
          );
        }

        if (block.kind === 'table') {
          return (
            <section
              key={`${block.kind}-${index}`}
              className="overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[0_18px_42px_rgba(40,53,28,0.08)]"
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[24rem] border-collapse text-left">
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr
                        key={`${row.join('-')}-${rowIndex}`}
                        className={
                          rowIndex % 2 === 0
                            ? 'bg-surface-container-lowest'
                            : 'bg-surface-container-low'
                        }
                      >
                        {row.map((cell) => (
                          <td
                            key={cell}
                            className="border-t border-outline-variant/45 px-4 py-3 text-sm leading-7 text-on-surface-variant break-words"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        }

        return (
          <p
            key={`${block.kind}-${index}`}
            className="rounded-[2rem] bg-surface-container-lowest p-6 text-[1.02rem] leading-8 text-on-surface-variant shadow-[0_18px_42px_rgba(40,53,28,0.08)] break-words"
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
