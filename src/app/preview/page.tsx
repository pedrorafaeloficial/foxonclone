'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { SourceCode } from '@/app/actions';
import { AppHeader } from '@/components/app/header';
import { SourceCodeViewer } from '@/components/app/source-code-viewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Smartphone, Monitor, Code, Loader2, Sparkles } from 'lucide-react';
import { FoxOnLogo } from '@/components/icons';
import { AiEditor } from '@/components/app/ai-editor';

const PreviewLoading = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
    <h2 className="text-2xl font-semibold text-foreground">Carregando Preview...</h2>
    <p className="text-muted-foreground mt-2">
      Aguarde um momento enquanto preparamos a visualização do seu site.
    </p>
  </div>
);

export default function PreviewPage() {
  const [source, setSource] = useState<SourceCode | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedSource = sessionStorage.getItem('siteSource');
      if (storedSource) {
        setSource(JSON.parse(storedSource));
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error("Failed to parse source from session storage", error);
      router.push('/');
    } finally {
        // Add a small delay to perceive the loading
        setTimeout(() => setLoading(false), 500);
    }
  }, [router]);

  const handleSourceUpdate = (newSource: SourceCode) => {
    setSource(newSource);
    sessionStorage.setItem('siteSource', JSON.stringify(newSource));
  };
  
  const iframeContent = useMemo(() => {
    if (!source) return '';
    // Use data URIs for CSS content
    const cssLinks = source.css.map(file => {
      const blob = new Blob([file.content], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      return `<link rel="stylesheet" href="${url}">`;
    }).join('\n');
  
    // For JS, we still need to consider external fetches if they use relative paths
    // But for simplicity in this component, let's try embedding as well.
    const jsScripts = source.js.map(file => `<script src="${file.url}"></script>`).join('\n');
    const baseTag = `<base href="${new URL(source.css[0]?.url || source.js[0]?.url || 'https://example.com').origin}">`;
    
    let processedHtml = source.html;

    // The logic to replace paths might be overly complex if assets are fetched relative to CSS files.
    // For a more robust preview, we rely on the <base> tag and absolute URLs fetched initially.
    // Let's simplify the replacement logic and rely more on the initial absolute URLs.
    source.css.forEach(file => {
      processedHtml = processedHtml.replace(new RegExp(`(href=["'])([^"']*/${file.name.split('?')[0]}[^"']*)`, 'g'), `$1${file.url}`);
    });
    
    source.js.forEach(file => {
      processedHtml = processedHtml.replace(new RegExp(`(src=["'])([^"']*/${file.name.split('?')[0]}[^"']*)`, 'g'), `$1${file.url}`);
    });

    return `
      <html>
        <head>
          ${baseTag}
          <style>${source.css.map(f => f.content).join('\n\n')}</style>
        </head>
        <body>
          ${processedHtml}
          ${jsScripts}
        </body>
      </html>
    `;
  }, [source]);
  
  if (loading || !source) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card className="shadow-lg rounded-2xl w-full h-[70vh]">
            <CardContent className="p-0 h-full">
              <PreviewLoading />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
            <Button variant="outline" onClick={() => router.push('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Button>
        </div>

        <Tabs defaultValue="desktop" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-secondary/50 h-12">
            <TabsTrigger value="desktop" className="text-base h-full">
              <Monitor className="mr-2 h-5 w-5" /> Desktop
            </TabsTrigger>
            <TabsTrigger value="mobile" className="text-base h-full">
              <Smartphone className="mr-2 h-5 w-5" /> Mobile
            </TabsTrigger>
            <TabsTrigger value="code" className="text-base h-full">
              <Code className="mr-2 h-5 w-5" /> Código Fonte
            </TabsTrigger>
             <TabsTrigger value="ai-editor" className="text-base h-full font-bold text-primary">
              <Sparkles className="mr-2 h-5 w-5" /> AI Editor
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="desktop" className="mt-6">
            <Card className="shadow-lg rounded-2xl w-full overflow-hidden">
                <div className="bg-slate-800 p-2 flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <CardContent className="p-0">
                    <iframe
                        srcDoc={iframeContent}
                        className="w-full h-[70vh] border-0"
                        sandbox="allow-scripts allow-same-origin"
                        title="Desktop Preview"
                    />
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mobile" className="mt-6">
            <div className="flex justify-center">
                <div className="w-[375px] h-[750px] bg-slate-900 rounded-[40px] border-[10px] border-slate-800 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-lg"></div>
                    <iframe
                        srcDoc={iframeContent}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                        title="Mobile Preview"
                    />
                </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-6">
            <SourceCodeViewer source={source} />
          </TabsContent>

          <TabsContent value="ai-editor" className="mt-6">
            <AiEditor
              initialSourceCode={source}
              onSourceCodeUpdate={handleSourceUpdate}
            />
          </TabsContent>
        </Tabs>
      </main>
       <footer className="py-6 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <FoxOnLogo className="h-6 w-6" />
          <p>&copy; {new Date().getFullYear()} FoxOn Clone. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
