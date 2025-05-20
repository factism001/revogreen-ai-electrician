import type { SVGProps } from 'react';

export function RevogreenLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="120"
      height="30"
      aria-label="Revogreen Logo"
      {...props}
    >
      <rect width="200" height="50" fill="transparent" />
      {/* Simple placeholder: A green leaf-like shape and a yellow bolt */}
      <path 
        d="M30 25 C 10 25, 10 5, 30 5 C 50 5, 50 25, 30 25 M30 5 C 30 0, 40 15, 25 20 M30 25 C 30 45, 10 45, 15 30" 
        fill="hsl(var(--primary))" 
      />
      <polygon points="35,15 45,15 40,25 50,25 30,45 38,30 28,30" fill="hsl(var(--accent))" />
      
      <text
        x="55"
        y="33"
        fontFamily="var(--font-geist-sans), sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        Revogreen
      </text>
    </svg>
  );
}
