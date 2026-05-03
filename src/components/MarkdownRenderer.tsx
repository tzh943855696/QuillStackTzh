import { marked } from 'marked';
import { extractHeadings } from '@/lib/toc';
import { setupMarkedWithBilibili } from '@/lib/bilibili-extension';
import { setupMarkedWithAdmonition } from '@/lib/markdown-extensions';

// 初始化 marked 并应用扩展
setupMarkedWithBilibili();
setupMarkedWithAdmonition();

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const markdownContent = content || '';
  const headings = extractHeadings(markdownContent);
  const htmlContent = marked.parse(markdownContent, { gfm: true }) as string;

  let headingIndex = 0;
  const htmlWithHeadingIds = htmlContent.replace(
    /<h([1-6])>([\s\S]*?)<\/h\1>/g,
    (match, level, innerHtml) => {
      const heading = headings[headingIndex++];

      if (!heading) {
        return match;
      }

      return `<h${level} id="${heading.id}">${innerHtml}</h${level}>`;
    }
  );

  return (
    <div
      className="prose dark:prose-invert prose-headings:font-headline max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlWithHeadingIds }}
    />
  );
}