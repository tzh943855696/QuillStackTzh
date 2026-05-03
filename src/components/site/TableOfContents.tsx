'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TOCItem } from '@/lib/toc';

type TableOfContentsProps = {
  items: TOCItem[];
  className?: string;
};

type TOCTreeItem = TOCItem & {
  children: TOCTreeItem[];
};

function buildTOCTree(items: TOCItem[]): TOCTreeItem[] {
  const normalizedItems = items
    .filter((item) => item.level >= 1 && item.level <= 6)
    .map((item) => ({
      ...item,
      children: [] as TOCTreeItem[],
    }));

  const root: TOCTreeItem[] = [];
  const stack: TOCTreeItem[] = [];

  normalizedItems.forEach((item) => {
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];

    if (parent) {
      parent.children.push(item);
    } else {
      root.push(item);
    }

    stack.push(item);
  });

  return root;
}

function collectAncestorIds(items: TOCTreeItem[], activeId: string): Set<string> {
  const ancestors = new Set<string>();

  function walk(nodes: TOCTreeItem[], chain: string[]) {
    for (const node of nodes) {
      if (node.id === activeId) {
        chain.forEach((id) => ancestors.add(id));
        return true;
      }

      if (walk(node.children, [...chain, node.id])) {
        return true;
      }
    }

    return false;
  }

  walk(items, []);
  return ancestors;
}

function TOCBranch({
  items,
  activeId,
  expandedIds,
  onNavigate,
}: {
  items: TOCTreeItem[];
  activeId: string;
  expandedIds: Set<string>;
  onNavigate: (id: string) => void;
}) {
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const isActive = activeId === item.id;
        const isExpanded = expandedIds.has(item.id);
        const hasChildren = item.children.length > 0;

        return (
          <li key={item.id}>
            <button
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex w-full items-start gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-all duration-200 hover:text-foreground',
                isActive
                  ? 'bg-muted text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted/60'
              )}
            >
              {hasChildren && (
                <ChevronRight
                  className={cn(
                    'mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-300 ease-out',
                    isExpanded && 'rotate-90 text-foreground'
                  )}
                />
              )}
              {!hasChildren && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-border" />}
              <span className="line-clamp-2 flex-1">{item.text}</span>
            </button>

            {hasChildren && (
              <div
                className={cn(
                  'grid transition-all duration-300 ease-out',
                  isExpanded ? 'mt-1 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <div
                    className={cn(
                      'ml-4 border-l border-border pl-2 transition-all duration-300 ease-out',
                      isExpanded ? 'translate-y-0' : '-translate-y-1'
                    )}
                  >
                    <TOCBranch
                      items={item.children}
                      activeId={activeId}
                      expandedIds={expandedIds}
                      onNavigate={onNavigate}
                    />
                  </div>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  const tocTree = useMemo(() => buildTOCTree(items), [items]);
  const expandedIds = useMemo(() => {
    const ids = collectAncestorIds(tocTree, activeId);
    if (activeId) {
      ids.add(activeId);
    }
    return ids;
  }, [tocTree, activeId]);

  useEffect(() => {
    const visibleHeadings = new Map<string, number>();

    const updateActiveHeading = () => {
      if (visibleHeadings.size === 0) {
        return;
      }

      const sorted = Array.from(visibleHeadings.entries()).sort((a, b) => a[1] - b[1]);
      setActiveId(sorted[0][0]);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleHeadings.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visibleHeadings.delete(entry.target.id);
          }
        });

        updateActiveHeading();
      },
      {
        rootMargin: '-96px 0px -60% 0px',
        threshold: [0, 1],
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className={cn('toc flex flex-col', className)}>
      <h2 className="mb-3 text-sm font-semibold text-foreground flex-shrink-0">目录</h2>
      <div className="border-l border-border pl-1 overflow-y-auto max-h-[calc(100vh-20rem)] scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <TOCBranch
          items={tocTree}
          activeId={activeId}
          expandedIds={expandedIds}
          onNavigate={scrollToHeading}
        />
      </div>
    </nav>
  );
}
