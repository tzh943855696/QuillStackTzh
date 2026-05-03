import { marked, type TokenizerExtension, type RendererExtension, type Tokens } from 'marked';

export type AdmonitionType = 'info' | 'warning' | 'tip' | 'danger' | 'note';

// Admonition 配置（与 Admonition.tsx 中的配置保持一致）
const admonitionConfig = {
  info: {
    label: '信息',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    borderLeftColor: 'border-l-blue-500 dark:border-l-blue-400',
    textColor: 'text-blue-800 dark:text-blue-200',
    iconColor: 'text-blue-500 dark:text-blue-400',
  },
  warning: {
    label: '警告',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    borderLeftColor: 'border-l-yellow-500 dark:border-l-yellow-400',
    textColor: 'text-yellow-800 dark:text-yellow-200',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
  },
  tip: {
    label: '技巧',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-800',
    borderLeftColor: 'border-l-green-500 dark:border-l-green-400',
    textColor: 'text-green-800 dark:text-green-200',
    iconColor: 'text-green-500 dark:text-green-400',
  },
  danger: {
    label: '危险',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-200 dark:border-red-800',
    borderLeftColor: 'border-l-red-500 dark:border-l-red-400',
    textColor: 'text-red-800 dark:text-red-200',
    iconColor: 'text-red-500 dark:text-red-400',
  },
  note: {
    label: '备注',
    bgColor: 'bg-gray-50 dark:bg-gray-900/50',
    borderColor: 'border-gray-200 dark:border-gray-700',
    borderLeftColor: 'border-l-gray-500 dark:border-l-gray-400',
    textColor: 'text-gray-800 dark:text-gray-200',
    iconColor: 'text-gray-500 dark:text-gray-400',
  },
};

// Lucide icons SVG paths
const iconSvgs = {
  info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  tip: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2 1.5 3.5.8.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
  danger: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/><path d="m4.93 4.93 14.14 14.14"/></svg>',
  note: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>',
};

// Admonition 语法正则匹配
// 匹配格式: > [!TYPE]
// > content line 1
// > content line 2
const ADMONITION_REGEX = /^> \[!(INFO|WARNING|TIP|DANGER|NOTE)\]\s*\n(?:>.*\n?)+/im;

interface AdmonitionToken extends Tokens.Generic {
  type: 'admonition';
  admonitionType: AdmonitionType;
  content: string;
  raw: string;
}

/**
 * 提取 Admonition 内容（去除每行的 > 前缀）
 */
function extractAdmonitionContent(rawText: string): string {
  const lines = rawText.split('\n');
  const contentLines: string[] = [];

  for (const line of lines) {
    // 匹配以 > 开头的行
    const match = line.match(/^>(.*)$/);
    if (match) {
      const content = match[1].trim();
      // 跳过类型声明行（如 [!INFO]）
      if (!content.startsWith('[!')) {
        contentLines.push(content);
      }
    }
  }

  return contentLines.join('\n').trim();
}

/**
 * Admonition Tokenizer Extension
 * 在 marked 解析前识别并提取 Admonition 语法
 */
const admonitionTokenizer: TokenizerExtension = {
  name: 'admonition',
  level: 'block',
  start(src: string) {
    const match = src.match(/^> \[!/);
    return match ? match.index : -1;
  },
  tokenizer(this, src: string): AdmonitionToken | undefined {
    const match = ADMONITION_REGEX.exec(src);
    if (match) {
      const raw = match[0];
      const admonitionType = match[1].toLowerCase() as AdmonitionType;
      const content = extractAdmonitionContent(raw);

      return {
        type: 'admonition',
        raw,
        admonitionType,
        content,
      };
    }
    return undefined;
  },
};

/**
 * Admonition Renderer Extension
 * 将 Admonition Token 渲染为 HTML
 */
const admonitionRenderer: RendererExtension = {
  name: 'admonition',
  renderer(token: Tokens.Generic) {
    if (token.type === 'admonition') {
      const admonitionToken = token as AdmonitionToken;
      const { admonitionType, content } = admonitionToken;

      // 递归解析内容中的 Markdown
      const parsedContent = marked.parse(content, {
        gfm: true,
        breaks: true,
      }) as string;

      // 移除外层的 <p> 标签（如果内容只有一段）
      const cleanContent = parsedContent.replace(/^<p>([\s\S]*?)<\/p>\s*$/, '$1');

      return generateAdmonitionHtml(admonitionType, cleanContent);
    }
    return false;
  },
};

/**
 * 设置 marked 使用 Admonition 扩展
 */
export function setupMarkedWithAdmonition() {
  marked.use({
    extensions: [admonitionTokenizer, admonitionRenderer],
  });
}

/**
 * 生成 Admonition HTML（用于服务器端渲染）
 */
export function generateAdmonitionHtml(type: AdmonitionType, content: string): string {
  const config = admonitionConfig[type];
  const iconSvg = iconSvgs[type];

  return `
    <div class="admonition my-6 rounded-lg border border-l-4 p-4 ${config.bgColor} ${config.borderColor} ${config.borderLeftColor}" data-admonition-type="${type}">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 mt-0.5 ${config.iconColor}">
          ${iconSvg}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-headline font-semibold text-sm mb-1 ${config.textColor}">
            ${config.label}
          </div>
          <div class="text-sm leading-relaxed admonition-content ${config.textColor}">
            ${content}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 预处理 Markdown 内容，在 marked.parse 之前使用
 * 用于处理多行 Admonition 内容
 */
export function preprocessAdmonitions(content: string): string {
  // 匹配整个 Admonition 块（包括多行）
  const regex = /^(> \[!(INFO|WARNING|TIP|DANGER|NOTE)\]\s*\n)((?:>.*\n?)+)/gim;

  return content.replace(regex, (match, header, type, body) => {
    // 保持原始格式，让 tokenizer 来处理
    return match;
  });
}

export { admonitionTokenizer, admonitionRenderer };
