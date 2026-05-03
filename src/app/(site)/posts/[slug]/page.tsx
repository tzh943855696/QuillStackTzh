import type { Metadata } from 'next';
import { getArticles, getArticle, getSiteSettings } from '@/lib/data';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PixelBreadcrumb, { breadcrumbPresets } from '@/components/site/PixelBreadcrumb';
import { ArticleSchema, BreadcrumbSchema, createHomeBreadcrumb, createCategoryBreadcrumb, createCategoryDetailBreadcrumb, createArticleBreadcrumb } from '@/components/seo';
import { getSiteUrl, buildUrl, truncateDescription, getArticleOgImage } from '@/lib/seo';
import { TableOfContents } from '@/components/site/TableOfContents';
import { extractHeadings } from '@/lib/toc';

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map(article => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);
  const settings = await getSiteSettings();

  if (!article) {
    return {
      title: '文章未找到',
    };
  }

  const siteUrl = getSiteUrl(settings);
  const allArticles = await getArticles();

  // 获取文章索引，用于判断使用本地OG还是外部图片
  const articleIndex = allArticles.findIndex(a => a.slug === article.slug);
  const ogImage = getArticleOgImage(article, settings, articleIndex);

  const keywords = [
    ...(settings.seo?.keywords || []),
    ...(article.category ? [article.category.name] : []),
    '博客',
    '文章',
  ];

  return {
    title: article.title,
    description: truncateDescription(article.excerpt),
    keywords,
    authors: [{ name: settings.author.name }],
    alternates: {
      canonical: buildUrl(siteUrl, `/posts/${article.slug}`),
    },
    openGraph: {
      title: article.title,
      description: truncateDescription(article.excerpt),
      url: buildUrl(siteUrl, `/posts/${article.slug}`),
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.publishedAt,
      authors: [settings.author.name],
      ...(article.category && {
        section: article.category.name,
      }),
      images: [
        {
          url: ogImage.url,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: truncateDescription(article.excerpt),
      images: [ogImage.url],
      creator: settings.seo?.twitterHandle,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);
  const settings = await getSiteSettings();

  if (!article) {
    notFound();
  }
  
  const categoryColor = article.category?.color || 'gray';

  // 构建面包屑数据
  const breadcrumbItems = [
    createHomeBreadcrumb(settings),
    ...(article.category ? [createCategoryBreadcrumb()] : []),
    ...(article.category ? [createCategoryDetailBreadcrumb(article.category.id, article.category.name)] : []),
    createArticleBreadcrumb(article.slug, article.title),
  ];

  // 提取文章标题用于目录
  const headings = extractHeadings(article.content || '');

  return (
    <>
      <ArticleSchema article={article} settings={settings} />
      <BreadcrumbSchema settings={settings} items={breadcrumbItems} />
      <div className="container mx-auto px-5 pt-8">
        <PixelBreadcrumb
          items={[
            breadcrumbPresets.home,
            ...(article.category ? [{ ...breadcrumbPresets.category, label: '分类', href: '/category' }] : []),
            ...(article.category ? [{ label: article.category.name, href: `/category/${article.category.id}` }] : []),
            { label: article.title }
          ]}
        />
      </div>
      <div className="container mx-auto px-4 pt-4 md:pt-8">
        <div className="flex gap-8 max-w-6xl mx-auto">
          {/* 文章内容 */}
          <div className="flex-1 min-w-0">
            <div className="bg-card border rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 md:p-10">
                <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground mb-6">
                  <div className="flex items-center space-x-4 text-sm">
                    {settings.author && (
                      <Image src={settings.author.avatarUrl} alt={settings.author.avatarHint} width={40} height={40} className="rounded-full" />
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{settings.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={article.publishedAt}>
                          {format(new Date(article.publishedAt), 'yyyy年MM月dd日')}
                        </time>
                      </div>
                      {article.readingTime > 0 && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{article.readingTime} 分钟阅读</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {article.category && (
                    <Link href={`/category/${article.category.id}`}>
                      <Badge
                        style={{
                          // @ts-ignore
                          '--badge-bg-color': categoryColor,
                          '--badge-text-color': 'white'
                        }}
                        className="mb-4 text-sm font-normal rounded-full py-1 px-3 border-transparent bg-[var(--badge-bg-color)] text-[var(--badge-text-color)]"
                      >
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: 'white' }}></div>
                        {article.category.name}
                      </Badge>
                    </Link>
                  )}
                </div>

                <article className="prose dark:prose-invert max-w-none">
                  <MarkdownRenderer content={article.content || ''} />
                </article>
              </div>
            </div>
          </div>
          
          {/* 目录侧边栏 - 仅在桌面端显示 */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              {headings.length > 0 && (
                <TableOfContents items={headings} className="bg-card border rounded-lg p-4" />
              )}
              {/* 标签展示 */}
              {article.tags && article.tags.length > 0 && (
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                        <Badge
                          variant="secondary"
                          className="text-xs hover:bg-secondary/80 transition-colors cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
