import React, { forwardRef } from "react";
import PortfolioBadge from "@/components/portfolio/Badge";
import DecryptedText from "@/components/portfolio/text/DecryptedText";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  bgImage: string;
  /** 内层预览图（替代 Video Placeholder），后续可换为视频 */
  previewImage?: string;
  category: string;
  title: string;
  year: string;
  tags?: string[];
  videoElement?: React.ReactNode;
  className?: string;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  function ProjectCard(
    {
      bgImage,
      previewImage,
      category,
      title,
      year,
      tags = ["Development"],
      videoElement,
      className,
    },
    ref
  ) {
    return (
      <div className={cn("space-y-2", className)}>
        <div
          ref={ref}
          className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md p-7 sm:p-9 xl:p-18"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out"
          />

          <div className="relative z-10 w-full aspect-[4/3] overflow-hidden rounded-lg bg-gray-100/90 shadow-2xl">
            {videoElement ? (
              videoElement
            ) : previewImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewImage}
                alt={title}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                Video Placeholder
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-y-4 lg:flex-row">
          <div className="flex flex-col gap-y-2">
            <DecryptedText
              stagger={48}
              duration={330}
              scrambleSpeed={34}
              className="block font-mono font-medium text-portfolio-surface-foreground/70 tracking-tight leading-none uppercase"
            >
              {category}
            </DecryptedText>
            <DecryptedText
              stagger={48}
              duration={330}
              scrambleSpeed={34}
              className="block text-[clamp(27px,2.5vw,43px)] font-semibold leading-none tracking-tighter"
            >
              {title}
            </DecryptedText>
          </div>

          <div className="flex items-end gap-x-2">
            {tags.map((tag) => (
              <PortfolioBadge key={tag} variant="outline">
                {tag}
              </PortfolioBadge>
            ))}
            <PortfolioBadge variant="filled">{year}</PortfolioBadge>
          </div>
        </div>
      </div>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
