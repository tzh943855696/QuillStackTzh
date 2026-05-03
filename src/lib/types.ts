import { z } from 'zod';

export type NavigationItem = {
  id: string;
  label: string;
  href?: string;
  items?: NavigationItem[];
};

export const navigationItemSchema: z.ZodType<NavigationItem> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),
    href: z.string().optional(),
    items: z.array(navigationItemSchema).optional(),
  }).refine((item) => Boolean(item.href) || Boolean(item.items?.length), {
    message: 'Navigation item must include href or items',
  })
);

export const headerSettingsSchema = z.object({
  heroImageUrl: z.string(),
  heroImageHint: z.string(),
  avatarUrl: z.string(),
  avatarHint: z.string(),
  title: z.string(),
  bio: z.string(),
});

export const authorSettingsSchema = z.object({
  name: z.string(),
  avatarUrl: z.string(),
  avatarHint: z.string(),
});

const socialLinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
});

const footerLinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
});

const footerSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  links: z.array(footerLinkSchema),
});

export const footerSettingsSchema = z.object({
  text: z.string(),
  brandName: z.string(),
  brandDescription: z.string(),
  logoIcon: z.string().optional().default('Code'),
  madeIn: z.string(),
  socialLinks: z.array(socialLinkSchema),
  linkSections: z.array(footerSectionSchema),
  legalLinks: z.array(footerLinkSchema),
});


export const themeSettingsSchema = z.object({
  bodyFont: z.string(),
  headlineFont: z.string(),
});

export const generalSettingsSchema = z.object({
  siteTitle: z.string(),
  siteDescription: z.string(),
});

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

export const paginationSettingsSchema = z.object({
  postsPerPage: z.number().positive(),
});

export const backToTopSettingsSchema = z.object({
  showAfter: z.number().nonnegative().default(400),
});

export const seoSettingsSchema = z.object({
  siteUrl: z.string().url(),
  ogImageGenerationLimit: z.number().int().nonnegative().default(10),
  fallbackOgImage: z.string().url(),
  twitterHandle: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  rss: z.object({
    enabled: z.boolean().default(true),
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

export const ogImageSettingsSchema = z.object({
  slogan: z.string().default('技术 · 生活 · 分享'),
  primaryColor: z.string().default('#3b82f6'),
  backgroundColor: z.string().default('#0f172a'),
  gradientEndColor: z.string().default('#1e293b'),
  textColor: z.string().default('#f8fafc'),
  secondaryTextColor: z.string().default('#94a3b8'),
  tertiaryTextColor: z.string().default('#64748b'),
});

export const siteSettingsSchema = generalSettingsSchema.extend({
  navigation: z.array(navigationItemSchema),
  header: headerSettingsSchema,
  author: authorSettingsSchema,
  footer: footerSettingsSchema,
  theme: themeSettingsSchema,
  categories: z.array(categorySchema),
  pagination: paginationSettingsSchema,
  backToTop: backToTopSettingsSchema.optional(),
  seo: seoSettingsSchema.optional(),
  ogImage: ogImageSettingsSchema.optional(),
});

export const articleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  contentPath: z.string(),
  publishedAt: z.string(),
  excerpt: z.string(),
  imageUrl: z.string().url().optional(),
  imageHint: z.string().optional(),
  content: z.string().optional(),
  categoryId: z.string().optional(),
  category: categorySchema.optional(), // Will be populated by getArticles
  tags: z.array(z.string()).default([]),
  readingTime: z.number().default(0),
});

export type HeaderSettings = z.infer<typeof headerSettingsSchema>;
export type AuthorSettings = z.infer<typeof authorSettingsSchema>;
export type FooterSettings = z.infer<typeof footerSettingsSchema>;
export type ThemeSettings = z.infer<typeof themeSettingsSchema>;
export type GeneralSettings = z.infer<typeof generalSettingsSchema>;
export type Category = z.infer<typeof categorySchema>;
export type PaginationSettings = z.infer<typeof paginationSettingsSchema>;
export type BackToTopSettings = z.infer<typeof backToTopSettingsSchema>;
export type SeoSettings = z.infer<typeof seoSettingsSchema>;
export type OgImageSettings = z.infer<typeof ogImageSettingsSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type Article = z.infer<typeof articleSchema>;

// Friend Link types
export const friendLinkSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  avatar: z.string().url(),
  url: z.string().url(),
  tags: z.array(z.string()).default([]),
});

export const friendLinkSettingsSchema = z.object({
  description: z.string(),
  applyInfo: z.object({
    title: z.string(),
    description: z.string(),
    email: z.string().email(),
    agreement: z.string().optional(),
  }),
  links: z.array(friendLinkSchema),
});

export type FriendLink = z.infer<typeof friendLinkSchema>;
export type FriendLinkSettings = z.infer<typeof friendLinkSettingsSchema>;
