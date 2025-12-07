import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 12h16" />
      <path d="m8 8-4 4 4 4" />
      <path d="M14 4h2a2 2 0 0 1 2 2v2" />
      <path d="M4 14v2a2 2 0 0 0 2 2h2" />
      <path d="M20 10V8a2 2 0 0 0-2-2h-2" />
    </svg>
  ),
};
