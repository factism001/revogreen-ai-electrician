
import type { SVGProps } from 'react';

export function RevogreenRLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 25 40" // Adjusted viewBox to tightly fit the R mark
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="20" // Default width, can be overridden by props
      height="20" // Default height, can be overridden by props
      aria-label="Revogreen R Logo"
      {...props}
    >
      {/* Orange part of R */}
      <path d="M1 0 H11 V40 H1 Z" fill="hsl(var(--accent))" />
      {/* Green part of R */}
      <path d="M12 0 A16 10 0 0 1 12 20 L22 40 L12 40 Z" fill="hsl(var(--primary))" />
    </svg>
  );
}
