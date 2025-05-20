import type { SVGProps } from 'react';

export function RevogreenLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 50" // Widened viewBox for longer text
      width="145"         // Adjusted width to maintain aspect ratio and fit
      height="26"         // Adjusted height
      aria-label="Revogreen Energy Hub Logo" // Updated aria-label
      {...props}
    >
      <g transform="translate(10, 5)"> {/* Position the R icon */}
        {/* Orange part of R */}
        <path d="M1 0 H11 V40 H1 Z" fill="hsl(var(--accent))" />
        {/* Green part of R */}
        <path d="M12 0 A16 10 0 0 1 12 20 L22 40 L12 40 Z" fill="hsl(var(--primary))" />
      </g>
      
      <text
        x="45" // Start text after the 'R' icon with some padding
        y="33" // Vertical alignment of the text baseline
        fontFamily="var(--font-geist-sans), sans-serif"
        fontSize="18" // Adjusted font size to fit
        fontWeight="bold"
      >
        <tspan fill="hsl(var(--primary))">REVOGREEN</tspan>
        <tspan fill="hsl(var(--accent))" dx="0.3em">ENERGY HUB</tspan> {/* dx for space between words */}
      </text>
    </svg>
  );
}
