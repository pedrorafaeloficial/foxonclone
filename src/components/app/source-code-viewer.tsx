'use client';

import type { SourceCode, SourceFile } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileCode, FileText, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface SourceCodeViewerProps {
  source: SourceCode;
}

function CodeActions({ content, filename }: { content: string; filename: string }) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied to clipboard!',
      description: `${filename} has been copied.`,
    });
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: 'Download started',
      description: `Downloading ${filename}.`,
    });
  };

  return (
    <div className="absolute top-2 right-2 flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={handleCopy} aria-label={`Copy ${filename}`}>
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleDownload} aria-label={`Download ${filename}`}>
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}

function CodeBlock({ code, language, filename }: { code: string; language: string; filename: string }) {
  return (
    <div className="relative rounded-md bg-zinc-900 text-white my-2">
       <CodeActions content={code} filename={filename} />
      <pre className="font-code text-sm p-4 pt-12 overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}

function FileList({ files, type }: { files: SourceFile[], type: 'CSS' | 'JavaScript' }) {
    if (files.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No {type} files found on this page.</p>
    }
    
    return (
        <Accordion type="single" collapsible className="w-full">
            {files.map((file) => (
                <AccordionItem value={file.url} key={file.url}>
                    <AccordionTrigger className="text-sm">
                        <div className="flex items-center gap-2">
                            {type === 'CSS' ? <FileText className="h-4 w-4 text-accent" /> : <FileCode className="h-4 w-4 text-accent" />}
                            <span>{file.name}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 px-1">
                            <span>Source URL:</span>
                             <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent transition-colors">
                                {file.url}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                        <CodeBlock code={file.content} language={type.toLowerCase()} filename={file.name} />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}

export function SourceCodeViewer({ source }: SourceCodeViewerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Source Code</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="html">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="html">
                <FileCode className="mr-2 h-4 w-4" /> HTML
            </TabsTrigger>
            <TabsTrigger value="css">
                <FileText className="mr-2 h-4 w-4" /> CSS ({source.css.length})
            </TabsTrigger>
            <TabsTrigger value="javascript">
                <FileCode className="mr-2 h-4 w-4" /> JavaScript ({source.js.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="html" className="mt-4">
            <CodeBlock code={source.html} language="html" filename="index.html" />
          </TabsContent>
          <TabsContent value="css" className="mt-4">
            <FileList files={source.css} type="CSS" />
          </TabsContent>
          <TabsContent value="javascript" className="mt-4">
            <FileList files={source.js} type="JavaScript" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
