import Image from 'next/image';
import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <Image
      src="https://agenciafoxon.com.br/wp-content/uploads/2023/11/cropped-Ativo-1-1.png"
      alt="FoxOn Logo"
      width={32}
      height={32}
      className={props.className}
    />
  ),
};
