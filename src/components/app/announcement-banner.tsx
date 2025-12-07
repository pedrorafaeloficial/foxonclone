import { Megaphone } from 'lucide-react';

export function AnnouncementBanner() {
  return (
    <a 
      href="https://wa.me/5511972202587?text=Ola%20Pedro%2C%20quero%20aprender%20a%20Vender%20Sites%2C%20pode%20me%20ajudar%3F" 
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
