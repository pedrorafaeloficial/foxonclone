import { Megaphone } from 'lucide-react';

export function AnnouncementBanner() {
  return (
    <a 
      href="https://pay.hotmart.com/E93335198M?off=l50n2vqq" 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 h-12">
          <Megaphone className="h-6 w-6 flex-shrink-0" />
          <p className="text-sm sm:text-base font-medium text-center">
            Quer aprender a vender pelo menos 1 site por dia de forma simples?{' '}
            <span className="font-bold underline">
              Clique aqui e aprenda!
            </span>
          </p>
        </div>
      </div>
    </a>
  );
}
