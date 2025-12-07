import Link from "next/link";
import { FoxOnLogo } from '@/components/icons';

export function AppHeader() {
  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-2 h-20">
          <Link href="/" className="flex items-center gap-4">
            <FoxOnLogo className="h-10 w-10 text-primary" />
            <h1 className="text-2xl font-bold font-headline tracking-tight">FoxOn Clone</h1>
          </Link>
        </div>
      </div>
    </header>
  );
}
