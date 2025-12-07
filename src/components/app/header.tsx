import { Icons } from '@/components/icons';

export function AppHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 h-16">
          <Icons.logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold font-headline">FoxOn Clone</h1>
        </div>
      </div>
    </header>
  );
}
