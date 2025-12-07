import Image from 'next/image';
import type { SVGProps } from "react";

export const FoxOnLogo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <Image
    src="https://agenciafoxon.com.br/wp-content/uploads/2025/11/Ativo-1-1.png"
    alt="FoxOn Logo"
    width={64}
    height={64}
    {...props}
    unoptimized
  />
);
