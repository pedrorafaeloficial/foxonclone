import { Icons } from '@/components/icons';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-2 h-20">
          <div className="flex items-center gap-4">
            <Icons.logo className="h-10 w-10 text-primary" />
            <h1 className="text-2xl font-bold font-headline tracking-tight">FoxOn Clone</h1>
          </div>
          <Button variant="outline" size="icon" asChild>
            <a href="https://github.com/firebase/studio" target="_blank" rel="noopener noreferrer">
              <Github />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
