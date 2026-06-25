"use client";

import FadeUp from "@/components/portfolio/text/FadeUp";
import SplitText from "@/components/portfolio/text/SplitText";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

type Service = {
  number: string;
  title: string;
  description: string;
  skills: string[];
};

const SERVICES: Service[] = [
  {
    number: "01",
    title: "Full-Stack Development",
    description:
      "I build end-to-end solutions, from intuitive frontend experiences to robust backend systems. Focused on web development and leveraging modern tech to build scalable, real-world applications.",
    skills: [
      "React, Vue, Tailwind CSS",
      "Node.js, Spring Boot",
      "Git, Docker, Vercel, Alibaba Cloud",
    ],
  },
  {
    number: "02",
    title: "Optimization",
    description:
      "I build systems that scale reliably, applying solid engineering principles to keep applications fast, stable, and future-ready.",
    skills: ["Data Structures & Algorithms", "DBMS, OOP, OS Fundamentals", "Scalable systems & data pipelines"],
  },
  {
    number: "03",
    title: "AI-Assisted Development",
    description:
      "I use AI tools to speed up development while maintaining solid engineering standards—supporting everything from rapid prototyping to scalable, well-structured systems.",
    skills: ["Cursor, Codex, Claude", "Rapid prototyping & iteration", "Code quality & review"],
  },
];

function getOffsets(prefix: number[], index: number) {
  const top = prefix[index];
  const remaining = prefix[prefix.length - 1] - prefix[index + 1];
  return { top, remaining };
}

export default function WhatIDoSection() {
  const services = SERVICES;

  const headerRefs = useRef<HTMLDivElement[]>([]);
  const [headerHeightsPx, setHeaderHeightsPx] = useState<number[]>(() =>
    Array(services.length).fill(0)
  );

  const measure = useCallback(() => {
    setHeaderHeightsPx(
      services.map(
        (_, i) => headerRefs.current[i]?.getBoundingClientRect().height ?? 0
      )
    );
  }, [services]);

  const prefixHeights = useMemo(() => {
    const arr = [0];
    for (let i = 0; i < headerHeightsPx.length; i++) {
      arr[i + 1] = arr[i] + headerHeightsPx[i];
    }
    return arr;
  }, [headerHeightsPx]);

  useLayoutEffect(() => {
    const nodes = headerRefs.current.filter(Boolean) as HTMLDivElement[];
    if (nodes.length !== services.length) return;

    measure();

    const observers = nodes.map((node) => {
      const ro = new ResizeObserver(measure);
      ro.observe(node);
      return ro;
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, [measure, services.length]);

  return (
    <section
      id="services"
      className="px-10 pt-20 md:pt-20 bg-portfolio-surface rounded-t-3xl text-portfolio-surface-foreground relative z-10"
    >
      <div className="mb-12 md:mb-24">
        <h2 className="text-[54px] sm:text-[6xl] md:text-[8vw] font-semibold tracking-tighter uppercase leading-none mb-20">
          <SplitText stagger={0.04} duration={0.8} yOffset={50}>
            WHAT I DO /
          </SplitText>
        </h2>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-start-6 md:col-span-7 flex flex-col sm:flex-row gap-x-[72px] gap-y-6">
            <span className="uppercase text-nowrap text-md text-portfolio-surface-foreground/50 tracking-tighter">
              (Services)
            </span>

            <FadeUp
              className="w-full max-w-[35ch] text-balance text-lg md:text-2xl font-light leading-snug text-portfolio-surface-foreground/80"
              delay={0.15}
              once={false}
            >
              I specialize in building fast, reliable, and user-friendly full-stack digital solutions. I bridge the gap between complex ideas and market-ready products that drive real business value and long-term growth.
            </FadeUp>
          </div>
        </div>
      </div>

      <div className="py-4">
        {services.map((service, index) => {
          const { top: topOffsetPx, remaining: remainingHeadersPx } = getOffsets(
            prefixHeights,
            index
          );
          return (
            <div
              key={service.number}
              className="sticky border-t border-portfolio-surface-border bg-portfolio-surface [--sticky-top:8vh] sm:[--sticky-top:15vh] md:[--sticky-top:20vh] [--sticky-bottom:2em] md:[--sticky-bottom:8em]"
              style={{
                top: `calc(var(--sticky-top) + ${topOffsetPx}px)`,
                marginBottom: `calc(${remainingHeadersPx}px + var(--sticky-bottom))`,
                zIndex: index,
              }}
            >
              <div
                ref={(el) => {
                  if (el) headerRefs.current[index] = el;
                }}
                className="flex gap-4 md:grid md:grid-cols-12 md:gap-x-4 items-center"
              >
                <span className="col-span-2 text-4xl md:text-5xl lg:text-6xl font-semibold uppercase tracking-tighter">
                  ({service.number})
                </span>

                <h3 className="col-span-7 col-start-6 text-4xl md:text-5xl lg:text-6xl font-semibold py-6 tracking-tighter">
                  {service.title}
                </h3>
              </div>

              <div className="md:grid md:grid-cols-12 min-h-[40vh] md:gap-x-6">
                <div className="col-span-7 col-start-6 space-y-6 pt-4 pl-3">
                  <p className="max-w-[40ch] text-balance text-lg md:text-xl font-light leading-snug text-portfolio-surface-foreground/80">
                    {service.description}
                  </p>

                  <div className="divide-y divide-portfolio-surface-border">
                    {service.skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-6 py-4">
                        <span className="text-lg md:text-xl font-mono text-portfolio-surface-foreground/50">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-2xl md:text-4xl tracking-tighter font-semibold text-portfolio-surface-foreground/90">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
