"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>[]{}";

interface DecryptedTextProps {
  children: string;
  className?: string;
  /** 相邻字符开始解码的间隔（ms），默认 60 */
  stagger?: number;
  /** 每个字符解码阶段的持续时间（ms），默认 400 */
  duration?: number;
  /** 乱码刷新频率（ms），默认 40 */
  scrambleSpeed?: number;
  /** 触发动画时的视口阈值，默认 0.3 */
  threshold?: number;
  /** 是否只触发一次，默认 true */
  once?: boolean;
  /** 自定义乱码字符集 */
  chars?: string;
}

export default function DecryptedText({
  children,
  className,
  stagger = 60,
  duration = 400,
  scrambleSpeed = 40,
  threshold = 0.3,
  once = true,
  chars = DEFAULT_CHARS,
}: DecryptedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: threshold, once });

  const [displayChars, setDisplayChars] = useState<string[]>(() =>
    children.split("")
  );

  useEffect(() => {
    setDisplayChars(
      children.split("").map((c) =>
        c === " " ? " " : chars[Math.floor(Math.random() * chars.length)]
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const randomChar = () => chars[Math.floor(Math.random() * chars.length)];

  useEffect(() => {
    if (!isInView) return;

    const intervals: ReturnType<typeof setInterval>[] = [];
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    children.split("").forEach((char, i) => {
      if (char === " ") {
        setDisplayChars((prev) => {
          const next = [...prev];
          next[i] = " ";
          return next;
        });
        return;
      }

      const startAt = i * stagger;

      const startTimer = setTimeout(() => {
        const interval = setInterval(() => {
          setDisplayChars((prev) => {
            const next = [...prev];
            next[i] = randomChar();
            return next;
          });
        }, scrambleSpeed);
        intervals.push(interval);

        const resolveTimer = setTimeout(() => {
          clearInterval(interval);
          setDisplayChars((prev) => {
            const next = [...prev];
            next[i] = char;
            return next;
          });
        }, duration);
        timeouts.push(resolveTimer);
      }, startAt);

      timeouts.push(startTimer);
    });

    return () => {
      intervals.forEach(clearInterval);
      timeouts.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return (
    <span ref={ref} className={className} aria-label={children}>
      {displayChars.map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
