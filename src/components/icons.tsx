import Image from 'next/image';
import type { SVGProps } from "react";

export const FoxOnLogo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <Image
    src="https://agenciafoxon.com.br/wp-content/uploads/2024/02/logo-foxon-group-novo.png"
    alt="FoxOn Logo"
    width={64}
    height={64}
    {...props}
    unoptimized
  />
);
