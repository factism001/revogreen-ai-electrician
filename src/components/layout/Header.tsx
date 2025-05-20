import Link from 'next/link';
import { RevogreenLogo } from '@/components/icons/RevogreenLogo';

export default function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <RevogreenLogo />
          <span className="text-xl font-semibold text-primary hidden sm:inline-block">
            AI Electrician
          </span>
        </Link>
        {/* Navigation can be added here if needed */}
      </div>
    </header>
  );
}
