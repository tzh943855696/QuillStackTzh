import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles, getSiteSettings } from '@/lib/data';
import SiteHero from '@/components/site/SiteHero';
import { Badge } from '@/components/ui/badge';
import PixelBreadcrumb, { breadcrumbPresets } from '@/components/site/PixelBreadcrumb';
import { BreadcrumbSchema, createHomeBreadcrumb } from '@/components/seo';
import { Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: '标签云 | QuillStack',
  description: '浏览所有文章标签，发现感兴趣的内容',
};

export default async function TagsPage() {
  const articles = await getArticles();
  const settings = await getSiteSettings();

  // 统计每个标签的文章数量
  const tagCounts = new Map<string, number>();
  articles.forEach((article) => {
    article.tags?.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  // 转换为数组并按文章数量排序
  const sortedTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1]);

  // 计算标签大小（基于文章数量）
  const maxCount = Math.max(...tagCounts.values(), 1);
  const minCount = Math.min(...tagCounts.values(), 1);
  
  const getTagSize = (count: number) => {
    if (maxCount === minCount) return 'text-base';
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.75) return 'text-xl';
    if (ratio > 0.5) return 'text-lg';
    if (ratio > 0.25) return 'text-base';
    return 'text-sm';
  };

  const getTagPadding = (count: number) => {
    if (maxCount === minCount) return 'px-3 py-1.5';
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.75) return 'px-4 py-2';
    if (ratio > 0.5) return 'px-3.5 py-1.5';
    if (ratio > 0.25) return 'px-3 py-1.5';
    return 'px-2.5 py-1';
  };

  return (
    <>
      <BreadcrumbSchema
        settings={settings}
        items={[createHomeBreadcrumb(settings), { name: '标签', path: '/tags' }]}
      />
      <SiteHero
        title="标签云"
        description={`共 ${sortedTags.length} 个标签，${articles.length} 篇文章`}
        size="medium"
      />
      <div className="container mx-auto px-4 py-8">
        <PixelBreadcrumb
          items={[
            breadcrumbPresets.home,
            { label: '标签' },
          ]}
        />
      </div>
      <div className="container mx-auto px-4 py-8">
        {sortedTags.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border rounded-xl shadow-lg p-8">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {sortedTags.map(([tag, count]) => (
                  <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                    <Badge
                      variant="secondary"
                      className={`${getTagSize(count)} ${getTagPadding(count)} font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-pointer`}
                    >
                      <Tag className="h-3 w-3 mr-1 inline" />
                      {tag}
                      <span className="ml-1.5 opacity-60 font-mono text-xs">({count})</span>
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
            {/* 标签统计 */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold font-mono text-foreground">{sortedTags.length}</div>
                <div className="text-sm text-muted-foreground">标签总数</div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold font-mono text-foreground">{articles.length}</div>
                <div className="text-sm text-muted-foreground">文章总数</div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold font-mono text-foreground">
                  {sortedTags[0]?.[1] || 0}
                </div>
                <div className="text-sm text-muted-foreground">最多文章</div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold font-mono text-foreground">
                  {sortedTags.length > 0 ? (articles.length / sortedTags.length).toFixed(1) : '0'}
                </div>
                <div className="text-sm text-muted-foreground">平均每标签</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="bg-card border rounded-xl p-12">
              <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold font-headline mb-2">暂无标签</h2>
              <p className="text-muted-foreground">
                还没有为文章添加标签，快去为文章添加标签吧！
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
