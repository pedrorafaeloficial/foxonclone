'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';

import { getSiteSource } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/app/header';
import { SourceCodeViewer } from '@/components/app/source-code-viewer';
import { Loader2, Rocket } from 'lucide-react';
import type { SourceCode } from '@/app/actions';

interface FormState {
  source?: SourceCode;
  error?: string;
  message?: string;
}

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
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
  const [state, formAction] = useFormState(getSiteSource, initialState);
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
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-center">Website Source Code Cloner</CardTitle>
              <CardDescription className="text-center pt-2">
                Enter any website URL to fetch its HTML, CSS, and JavaScript source code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 space-y-2 sm:space-y-0">
                  <Input
                    name="url"
                    type="url"
                    placeholder="https://example.com"
                    required
                    className="flex-grow"
                    aria-label="Website URL"
                  />
                  <SubmitButton />
                </div>
              </form>
            </CardContent>
          </Card>

          {state.source && (
            <div className="mt-8">
              <SourceCodeViewer source={state.source} />
            </div>
          )}
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SourceClone. All rights reserved.</p>
      </footer>
    </div>
  );
}
