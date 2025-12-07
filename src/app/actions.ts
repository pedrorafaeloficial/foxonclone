'use server';

import { z } from 'zod';

const urlSchema = z.string().url({ message: 'Please enter a valid URL.' });

export type SourceFile = {
  name: string;
  url: string;
  content: string;
};

export type SourceCode = {
  html: string;
  css: SourceFile[];
  js: SourceFile[];
};

export async function getSiteSource(
  prevState: any,
  formData: FormData
): Promise<{ source?: SourceCode; error?: string }> {
  const url = formData.get('url');

  const validatedUrl = urlSchema.safeParse(url);

  if (!validatedUrl.success) {
    return { error: validatedUrl.error.issues[0].message };
  }
  
  const targetUrl = validatedUrl.data;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();

    const cssFiles: SourceFile[] = [];
    const jsFiles: SourceFile[] = [];

    const cssPromises: Promise<void>[] = [];
    const jsPromises: Promise<void>[] = [];

    // Regex to find CSS links
    const cssRegex = /<link[^>]+?href="([^"]+?\.css[^"]*?)"/g;
    let cssMatch;
    while ((cssMatch = cssRegex.exec(html)) !== null) {
      try {
        const cssUrl = new URL(cssMatch[1], targetUrl).href;
        cssPromises.push(
          fetch(cssUrl).then(async (res) => {
            if (res.ok) {
              const content = await res.text();
              cssFiles.push({ name: cssUrl.split('/').pop()?.split('?')[0] || 'style.css', url: cssUrl, content });
            }
          }).catch(() => { /* ignore failed asset fetches */ })
        );
      } catch (e) { /* ignore invalid URLs */ }
    }

    // Regex to find JS scripts
    const jsRegex = /<script[^>]+?src="([^"]+?\.js[^"]*?)"/g;
    let jsMatch;
    while ((jsMatch = jsRegex.exec(html)) !== null) {
      try {
        const jsUrl = new URL(jsMatch[1], targetUrl).href;
        jsPromises.push(
          fetch(jsUrl).then(async (res) => {
            if (res.ok) {
              const content = await res.text();
              jsFiles.push({ name: jsUrl.split('/').pop()?.split('?')[0] || 'script.js', url: jsUrl, content });
            }
          }).catch(() => { /* ignore failed asset fetches */ })
        );
      } catch (e) { /* ignore invalid URLs */ }
    }
    
    await Promise.all([...cssPromises, ...jsPromises]);

    return {
      source: { html, css: cssFiles, js: jsFiles },
    };
  } catch (e: any) {
    console.error(e);
    return { error: `An error occurred while cloning: ${e.message}` };
  }
}
