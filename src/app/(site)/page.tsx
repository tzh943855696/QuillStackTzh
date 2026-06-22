import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/data';
import { WebsiteSchema } from '@/components/seo';
import { getSiteUrl, truncateDescription } from '@/lib/seo';
import SmoothScrolling from '@/components/portfolio/scroll/SmoothScrolling';
import PageIntro from '@/components/portfolio/layout/PageIntro';
import HeroSection from '@/components/portfolio/sections/HeroSection';
import WhatIDoSection from '@/components/portfolio/sections/WhatIDoSection';
import SelectedWorksSection from '@/components/portfolio/sections/SelectedWorksSection';
import AboutSection from '@/components/portfolio/sections/AboutSection';
import ContactSection from '@/components/portfolio/sections/ContactSection';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = getSiteUrl(settings);

  return {
    title: settings.siteTitle,
    description: truncateDescription(settings.siteDescription),
    keywords: settings.seo?.keywords || ['博客', '技术', '前端', '开发'],
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: settings.siteTitle,
      description: truncateDescription(settings.siteDescription),
      url: siteUrl,
      type: 'website',
      images: [
        {
          url: `${siteUrl}/og/home.jpg`,
          width: 1200,
          height: 630,
          alt: settings.siteTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.siteTitle,
      description: truncateDescription(settings.siteDescription),
      images: [`${siteUrl}/og/home.jpg`],
      creator: settings.seo?.twitterHandle,
    },
  };
}

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <WebsiteSchema settings={settings} />
      <SmoothScrolling>
        <div className="relative font-figtree">
          <PageIntro />
          <HeroSection />
          <WhatIDoSection />
          <SelectedWorksSection />
          <AboutSection />
          <ContactSection />
        </div>
      </SmoothScrolling>
    </>
  );
}
