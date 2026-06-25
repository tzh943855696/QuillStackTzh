"use client";

import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";

type CounterProps = {
  value?: number;
  autoPlay?: boolean;
  interval?: number;
  duration?: number;
  digits?: number;
  max?: number;
  className?: string;
  digitClassName?: string;
};

const Digit = ({
  value,
  duration,
  digitClassName,
}: {
  value: number;
  duration: number;
  digitClassName?: string;
}) => {
  const [height, setHeight] = useState(0);
  const firstDigitRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (firstDigitRef.current) {
        const h = firstDigitRef.current.getBoundingClientRect().height;
        setHeight(h);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div
      className={clsx("overflow-hidden leading-[0.8]", digitClassName)}
      style={{ height: height || "auto" }}
    >
      <motion.div
        animate={{ y: -value * height }}
        transition={{
          type: "tween",
          duration,
          ease: "easeInOut",
        }}
      >
        {Array.from({ length: 10 }).map((_, n) => (
          <div
            key={n}
            ref={n === 0 ? firstDigitRef : null}
            className="flex items-center justify-center"
          >
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function Counter({
  value,
  autoPlay = true,
  interval = 1000,
  duration = 0.8,
  digits = 2,
  max = 10 ** digits,
  className,
  digitClassName,
}: CounterProps) {
  const [internal, setInternal] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setInternal((c) => (c + 1) % max);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, max]);

  const displayValue = value ?? internal;

  const digitList = String(displayValue)
    .padStart(digits, "0")
    .slice(-digits)
    .split("");

  return (
    <div className={className} style={{ display: "flex" }}>
      {digitList.map((d, i) => (
        <Digit
          key={i}
          value={Number(d)}
          duration={duration}
          digitClassName={digitClassName}
        />
      ))}
    </div>
  );
}
