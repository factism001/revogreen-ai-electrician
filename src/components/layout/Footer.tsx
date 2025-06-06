
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageSquare, Phone } from "lucide-react";

export default function Footer() {
  const catalogueUrl = "https://wa.me/c/2347067844630";
  const whatsappChatUrl = "https://wa.me/2347067844630"; // Updated variable name for clarity
  const phoneNumber = "+2347067844630"; // Used for tel: link, includes '+'

  return (
    <footer className="bg-muted/50 py-8 text-center">
      <div className="container mx-auto px-4">
        <div className="mb-6 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto bg-card hover:bg-accent/10 border-primary text-primary"
            onClick={() => window.open(catalogueUrl, '_blank')}
          >
            <ShoppingCart className="mr-2 h-5 w-5" /> Shop Accessories
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto bg-card hover:bg-accent/10 border-primary text-primary"
            onClick={() => window.open(whatsappChatUrl, '_blank')}
          >
            <MessageSquare className="mr-2 h-5 w-5" /> Chat on WhatsApp
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto bg-card hover:bg-accent/10 border-primary text-primary"
            onClick={() => window.location.href = `tel:${phoneNumber}`}
          >
            <Phone className="mr-2 h-5 w-5" /> Call Us
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Revogreen Energy Hub. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          AI-powered electrical advice for Nigeria.
        </p>
      </div>
    </footer>
  );
}
