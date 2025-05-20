export default function Footer() {
  return (
    <footer className="bg-muted/50 py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Revogreen Energy Hub. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          AI-powered electrical advice for Ibadan, Nigeria.
        </p>
      </div>
    </footer>
  );
}
