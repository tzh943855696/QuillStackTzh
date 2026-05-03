import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 计算阅读时间
 * 按中文字符 + 英文单词计算
 * 平均阅读速度：中文 400 字/分钟，英文 200 词/分钟
 * 返回阅读分钟数（至少 1 分钟）
 */
export function calculateReadingTime(content: string): number {
  if (!content) return 0;

  // 匹配中文字符
  const chineseChars = content.match(/[\u4e00-\u9fa5]/g) || [];
  const chineseCount = chineseChars.length;

  // 匹配英文单词（连续字母）
  const englishWords = content.match(/[a-zA-Z]+/g) || [];
  const englishCount = englishWords.length;

  // 计算阅读时间（分钟）
  const chineseMinutes = chineseCount / 400;
  const englishMinutes = englishCount / 200;
  const totalMinutes = chineseMinutes + englishMinutes;

  // 返回至少 1 分钟
  return Math.max(1, Math.round(totalMinutes));
}
