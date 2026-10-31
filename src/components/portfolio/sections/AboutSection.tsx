"use client";

import DecryptedText from "@/components/portfolio/text/DecryptedText";
import FadeUp from "@/components/portfolio/text/FadeUp";
import SplitText from "@/components/portfolio/text/SplitText";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const SKILL_GROUPS = [
  {
    title: "Languages",
    items: ["JavaScript", "TypeScript", "Java", "Python", "Dart", "SQL"],
  },
  {
    title: "Frameworks & Libraries",
    items: [
      "Vue",
      "React",
      "Node.js",
      "Express.js",
      "Electron",
      "React Native",
      "Spring Boot",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
    ],
  },
  {
    title: "Tools & Databases",
    items: [
      "Git",
      "Apifox",
      "Docker",
      "Vercel",
      "Alibaba Cloud",
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "Redis",
    ],
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0.1, 1], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section id="about" ref={sectionRef} className="mt-[-2vh]">
      <div className="relative z-10">
        <motion.div
          style={{
            scale,
            y,
            willChange: "transform",
            transformOrigin: "top center",
          }}
          className="rounded-b-3xl bg-portfolio-surface px-10 pt-0 sm:pt-20 md:pt-[15vh] pb-20 sm:pb-40 text-portfolio-surface-foreground space-y-20 md:space-y-20"
        >
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            <h2 className="order-2 col-span-12 flex flex-col lg:pt-24 font-semibold tracking-tighter leading-none md:order-1 lg:col-span-6 text-[50px] sm:text-7xl md:text-[88px] lg:text-[96px]">
              <span className="block">
                <SplitText stagger={0.04} duration={0.8} yOffset={50}>
                  Developer
                </SplitText>
              </span>
              <span className="block">
                <SplitText stagger={0.04} duration={0.8} yOffset={50}>
                  Designer
                </SplitText>
              </span>
              <span className="block">
                <SplitText stagger={0.04} duration={0.8} yOffset={50}>
                  Creator/
                </SplitText>
              </span>
            </h2>

            <div className="order-1 col-span-12 overflow-hidden md:order-2 lg:col-span-6">
              <section className="self-start px-3 py-5 md:px-6">
                <div className="mx-auto max-w-6xl">
                  <div className="mb-8 text-center tracking-tighter font-semibold text-[40px] sm:text-[50px] md:text-[clamp(70px,calc(70px+(90-70)*((100vw-768px)/(1280-768))),90px)] xl:text-[90px] leading-none">
                    Skills
                  </div>

                  <div className="grid grid-cols-3 gap-0 p-0 md:gap-5 md:p-5">
                    {SKILL_GROUPS.map((group) => (
                      <div key={group.title} className="p-2">
                        <h4 className="hidden md:flex text-xl font-semibold mb-4 tracking-tighter">
                          {group.title}
                        </h4>
                        <ul className="space-y-1 text-base md:text-lg lg:text-xl">
                          {group.items.map((item) => (
                            <li key={item}>
                              <DecryptedText
                                once={false}
                                className="font-mono font-[400] text-portfolio-surface-foreground/75"
                              >
                                {item}
                              </DecryptedText>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="pointer-events-none relative max-h-[30rem] col-span-12 md:col-span-3 flex aspect-square w-full h-full items-center overflow-clip rounded-md sm:aspect-auto md:items-end">
              <Image
                src="/images/about/me.webp"
                alt="About image"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover object-center"
              />
            </div>

            <div className="col-span-12 flex flex-col gap-y-9 lg:gap-y-18 md:col-span-7 md:col-start-6">
              <FadeUp
                className="max-w-[39ch] text-balance text-2xl md:text-3xl lg:text-4xl font-medium leading-snug tracking-tight"
                once={false}
              >
                I’m a full-stack developer and designer dedicated to crafting high-performance digital products that bridge the gap between complex logic and fluid design.
              </FadeUp>

              <div className="flex flex-col gap-x-10 gap-y-4 lg:flex-row">
                <span className="font-mono uppercase text-portfolio-surface-foreground/70">
                  (About Me)
                </span>

                <div className="flex max-w-[38ch] flex-col gap-y-4 text-balance text-base md:text-lg lg:text-xl text-portfolio-surface-foreground/75 tracking-tight font-normal">
                  <FadeUp once={false}>
                    <p>
                      Leveraging a versatile stack from React and Node.js to Spring Boot and Python, I build scalable applications that thrive under pressure. Whether it’s Web platforms, Mobile apps, or Desktop software, I focus on delivering seamless, end-to-end solutions for startups and businesses.
                    </p>
                  </FadeUp>

                  <FadeUp delay={0.12} once={false}>
                    <p>
                      I believe in the power of micro-interactions and refined motion. My approach is simple: engineer for reliability, design for impact, and obsess over the details that elevate a product from functional to exceptional.
                    </p>
                  </FadeUp>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
