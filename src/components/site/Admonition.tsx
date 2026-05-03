'use client';

import { cn } from '@/lib/utils';
import { Info, AlertTriangle, Lightbulb, AlertOctagon, FileText } from 'lucide-react';

export type AdmonitionType = 'info' | 'warning' | 'tip' | 'danger' | 'note';

interface AdmonitionProps {
  type: AdmonitionType;
  children: React.ReactNode;
  className?: string;
}

export const admonitionConfig = {
  info: {
    icon: Info,
    label: '信息',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    borderLeftColor: 'border-l-blue-500 dark:border-l-blue-400',
    textColor: 'text-blue-800 dark:text-blue-200',
    iconColor: 'text-blue-500 dark:text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    label: '警告',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    borderLeftColor: 'border-l-yellow-500 dark:border-l-yellow-400',
    textColor: 'text-yellow-800 dark:text-yellow-200',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
  },
  tip: {
    icon: Lightbulb,
    label: '技巧',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-800',
    borderLeftColor: 'border-l-green-500 dark:border-l-green-400',
    textColor: 'text-green-800 dark:text-green-200',
    iconColor: 'text-green-500 dark:text-green-400',
  },
  danger: {
    icon: AlertOctagon,
    label: '危险',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-200 dark:border-red-800',
    borderLeftColor: 'border-l-red-500 dark:border-l-red-400',
    textColor: 'text-red-800 dark:text-red-200',
    iconColor: 'text-red-500 dark:text-red-400',
  },
  note: {
    icon: FileText,
    label: '备注',
    bgColor: 'bg-gray-50 dark:bg-gray-900/50',
    borderColor: 'border-gray-200 dark:border-gray-700',
    borderLeftColor: 'border-l-gray-500 dark:border-l-gray-400',
    textColor: 'text-gray-800 dark:text-gray-200',
    iconColor: 'text-gray-500 dark:text-gray-400',
  },
};

export function Admonition({ type, children, className }: AdmonitionProps) {
  const config = admonitionConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'my-6 rounded-lg border border-l-4 p-4',
        config.bgColor,
        config.borderColor,
        config.borderLeftColor,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className={cn('font-headline font-semibold text-sm mb-1', config.textColor)}>
            {config.label}
          </div>
          <div className={cn('text-sm leading-relaxed', config.textColor)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
