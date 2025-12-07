'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { getSiteSource } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/app/header';
import { SourceCodeViewer } from '@/components/app/source-code-viewer';
import { Loader2, Rocket } from 'lucide-react';
import type { SourceCode } from '@/app/actions';
import { Icons } from '@/components/icons';

interface FormState {
  source?: SourceCode;
  error?: string;
  message?: string;
}

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cloning...
        </>
      ) : (
        <>
          <Rocket className="mr-2 h-4 w-4" />
          Clone Source
        </>
      )}
    </Button>
  );
}

export default function Home() {
  const [state, formAction] = useActionState(getSiteSource, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 md:py-16 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <Card className="shadow-2xl rounded-2xl border-2 border-primary/10">
            <CardHeader className="text-center p-8">
              <CardTitle className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                FoxOn Clone
              </CardTitle>
              <CardDescription className="pt-2 text-lg text-muted-foreground max-w-xl mx-auto">
                Enter any website URL to instantly get its complete HTML, CSS, and JavaScript source code.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form action={formAction} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 space-y-4 sm:space-y-0">
                  <Input
                    name="url"
                    type="url"
                    placeholder="https://example.com"
                    required
                    className="flex-grow text-base h-12"
                    aria-label="Website URL"
                  />
                  <SubmitButton />
                </div>
              </form>
            </CardContent>
          </Card>

          {state.source && (
            <div className="mt-12">
              <SourceCodeViewer source={state.source} />
            </div>
          )}
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Icons.logo className="h-6 w-6" />
          <p>&copy; {new Date().getFullYear()} FoxOn Clone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
