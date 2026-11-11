import { useEffect } from 'react';
import { siteConfig } from '../content/siteConfig';

export interface MetaOptions {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  schema?: Record<string, any>;
}

export function useDocumentMeta({
  title,
  description,
  canonicalPath = '',
  ogType = 'website',
  ogImage = '/site_logo.png',
  schema
}: MetaOptions) {
  useEffect(() => {
    // 1. Page Title
    const formattedTitle = title.includes('گروه مهام') || title.includes('گروه بین‌المللی مهام') ? title : `${title} | ${siteConfig.name}`;
    document.title = formattedTitle;

    // 2. Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Open Graph Tags
    const setOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setOgTag('og:title', formattedTitle);
    setOgTag('og:description', description);
    setOgTag('og:type', ogType);
    setOgTag('og:image', ogImage);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mahaam.ir';
    setOgTag('og:url', `${origin}${canonicalPath}`);

    // 4. Twitter Cards
    const setTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setTwitterTag('twitter:card', 'summary_large_image');
    setTwitterTag('twitter:title', formattedTitle);
    setTwitterTag('twitter:description', description);
    setTwitterTag('twitter:image', ogImage);

    // 5. Canonical Link Tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${origin}${canonicalPath}`);

    // 6. JSON-LD Structured Data Schema
    let schemaScript = document.querySelector('#dynamic-json-ld');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('type', 'application/ld+json');
        schemaScript.setAttribute('id', 'dynamic-json-ld');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [title, description, canonicalPath, ogType, ogImage, schema]);
}
