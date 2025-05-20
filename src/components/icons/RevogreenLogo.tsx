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
      <g transform="translate(10, 5)"> {/* Position the new R icon */}
        {/* Orange part of R, offset by 1px from left edge of its group for "border" effect */}
        <path d="M1 0 H11 V40 H1 Z" fill="hsl(var(--accent))" />
        {/* Green part of R, starts after orange bar + 1px gap */}
        {/* Outer curve: M12,0 to M12,20 (height 20), bulging right by 16 (rx). Leg tip at x=22. */}
        <path d="M12 0 A16 10 0 0 1 12 20 L22 40 L12 40 Z" fill="hsl(var(--primary))" />
      </g>
      
      <text
        x="55" // Position of the "Revogreen" text
        y="33" // Vertical alignment of the text
        fontFamily="var(--font-geist-sans), sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="hsl(var(--primary))" // Color of the text
      >
        Revogreen
      </text>
    </svg>
  );
}
