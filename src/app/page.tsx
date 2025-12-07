'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

import { getSiteSource } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/app/header';
import { Loader2, Rocket } from 'lucide-react';
import type { SourceCode } from '@/app/actions';
import { FoxOnLogo } from '@/components/icons';
import { AnnouncementBanner } from '@/components/app/announcement-banner';

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
          Clonando...
        </>
      ) : (
        <>
          <Rocket className="mr-2 h-4 w-4" />
          Clonar Código
        </>
      )}
    </Button>
  );
}

export default function Home() {
  const [state, formAction] = useActionState(getSiteSource, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Ocorreu um erro',
        description: state.error,
      });
    }

    if (state.source) {
      sessionStorage.setItem('siteSource', JSON.stringify(state.source));
      router.push('/preview');
    }
  }, [state, toast, router]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <AnnouncementBanner />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 md:py-16 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <Card className="shadow-2xl rounded-2xl border-2 border-primary/10">
            <CardHeader className="text-center p-8">
              <div className="flex justify-center items-center mb-4">
                <FoxOnLogo className="h-16 w-16" />
              </div>
              <CardTitle className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                FoxOn Clone
              </CardTitle>
              <CardDescription className="pt-2 text-lg text-muted-foreground max-w-xl mx-auto">
                Digite a URL de qualquer site para obter instantaneamente seu código-fonte completo em HTML, CSS e JavaScript.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form action={formAction} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 space-y-4 sm:space-y-0">
                  <Input
                    name="url"
                    type="url"
                    placeholder="https://exemplo.com"
                    required
                    className="flex-grow text-base h-12"
                    aria-label="URL do site"
                  />
                  <SubmitButton />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
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
