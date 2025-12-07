'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import type { SourceCode } from '@/app/actions';
import { editCode } from '@/ai/flows/edit-code-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Sparkles, User, Bot } from 'lucide-react';

interface AiEditorProps {
  initialSourceCode: SourceCode;
  onSourceCodeUpdate: (newSourceCode: SourceCode) => void;
}

export function AiEditor({ initialSourceCode, onSourceCodeUpdate }: AiEditorProps) {
  const [sourceCode, setSourceCode] = useState<SourceCode>(initialSourceCode);
  const [isThinking, setIsThinking] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/genkit/flow/editCodeFlow',
    body: {
      sourceCode: sourceCode,
    },
    onResponse: (response) => {
      if (!response.ok) {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            role: 'assistant',
            content: "Sorry, an API error occurred. Please try again.",
          },
        ]);
      }
    },
    onFinish: (message) => {
      try {
        const newSource = JSON.parse(message.content) as SourceCode;
        onSourceCodeUpdate(newSource);
        setSourceCode(newSource);
      } catch (e) {
        console.error("Failed to parse AI response:", e);
        // If parsing fails, append the raw content as a bot error message
        setMessages([...messages, message, {
            id: String(Date.now()),
            role: 'assistant',
            content: "Sorry, I received an invalid response. Please try rephrasing your request."
        }]);
      } finally {
        setIsThinking(false);
      }
    },
    onError: (error) => {
      console.error('Chat Error:', error);
      setIsThinking(false);
       setMessages([...messages, {
            id: String(Date.now()),
            role: 'assistant',
            content: "Sorry, an error occurred. I couldn't process your request."
        }]);
    }
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || isThinking) return;
    setIsThinking(true);
    handleSubmit(e);
  };
  
  // Filter out the final data message from the AI
  const visibleMessages = messages.filter(m => {
    try {
        JSON.parse(m.content);
        return m.role !== 'assistant';
    } catch {
        return true;
    }
  });


  return (
    <Card className="shadow-xl rounded-2xl h-[70vh] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="font-headline text-3xl">AI Code Editor</CardTitle>
                <CardDescription>Use plain language to modify your cloned website.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-col">
        <ScrollArea className="flex-grow p-6">
          <div className="space-y-6">
             {visibleMessages.map((m) => (
              <div key={m.id} className="flex gap-3">
                 <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>
                    {m.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className="p-3 rounded-lg bg-secondary max-w-[85%]">
                    <p className="font-semibold text-sm mb-1">{m.role === 'user' ? 'You' : 'AI Assistant'}</p>
                    <div className="prose prose-sm text-foreground">{m.content}</div>
                </div>
              </div>
            ))}
             {isThinking && (
                 <div className="flex gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Bot className="h-5 w-5" />
                    </div>
                    <div className="p-3 rounded-lg bg-secondary flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm text-muted-foreground">Thinking...</p>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-background/80">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="e.g., 'Change the background color to blue'"
              className="flex-grow h-12 text-base"
              disabled={isThinking}
            />
            <Button type="submit" size="lg" disabled={!input || isThinking}>
               {isThinking ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
