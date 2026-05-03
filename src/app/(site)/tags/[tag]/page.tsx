import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticles, getSiteSettings } from '@/lib/data';
import SiteHero from '@/components/site/SiteHero';
import { Badge } from '@/components/ui/badge';
import PixelBreadcrumb, { breadcrumbPresets } from '@/components/site/PixelBreadcrumb';
import { BreadcrumbSchema, createHomeBreadcrumb } from '@/components/seo';
import PostCard from '@/components/site/PostCard';
import { Tag, ArrowLeft } from 'lucide-react';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticles();
  const tags = new Set<string>();
  
  articles.forEach((article) => {
    article.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  
  return {
    title: `标签: ${tag} | QuillStack`,
    description: `查看所有带有"${tag}"标签的文章`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  const articles = await getArticles();
  const settings = await getSiteSettings();

  // 筛选带有该标签的文章
  const taggedArticles = articles.filter(
    (article) => article.tags?.includes(tag)
  );

  if (taggedArticles.length === 0) {
    notFound();
  }

  // 获取所有标签用于显示相关标签
  const allTags = new Set<string>();
  taggedArticles.forEach((article) => {
    article.tags?.forEach((t) => {
      if (t !== tag) allTags.add(t);
    });
  });

  return (
    <>
      <BreadcrumbSchema
        settings={settings}
        items={[
          createHomeBreadcrumb(settings),
          { name: '标签', path: '/tags' },
          { name: tag, path: `/tags/${encodedTag}` },
        ]}
      />
      <SiteHero
        title={`标签: ${tag}`}
        description={`共 ${taggedArticles.length} 篇文章`}
        size="medium"
      />
      <div className="container mx-auto px-4 py-8">
        <PixelBreadcrumb
          items={[
            breadcrumbPresets.home,
            { label: '标签', href: '/tags' },
            { label: tag },
          ]}
        />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 返回按钮 */}
          <div className="mb-6">
            <Link
              href="/tags"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回标签云
            </Link>
          </div>

          {/* 相关标签 */}
          {allTags.size > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-muted-foreground mb-3">相关标签</h2>
              <div className="flex flex-wrap gap-2">
                {Array.from(allTags).slice(0, 10).map((relatedTag) => (
                  <Link key={relatedTag} href={`/tags/${encodeURIComponent(relatedTag)}`}>
                    <Badge variant="outline" className="text-xs hover:bg-secondary/50 transition-colors">
                      {relatedTag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 文章列表 */}
          <div className="space-y-6">
            {taggedArticles.map((article) => (
              <PostCard key={article.id} article={article} author={settings.author} />
            ))}
          </div>

          {/* 底部导航 */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <Link
                href="/tags"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Tag className="h-4 w-4 mr-2" />
                浏览所有标签
              </Link>
              <span className="text-sm text-muted-foreground">
                共 {taggedArticles.length} 篇文章
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
