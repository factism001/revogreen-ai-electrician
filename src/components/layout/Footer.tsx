
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageSquare, Phone } from "lucide-react";

export default function Footer() {
  // IMPORTANT: Replace these placeholders with your actual contact information and links!
  const catalogueUrl = "https://shop.revogreenenergyhub.com"; // Example: Your online store URL
  const whatsappNumber = "2348012345678"; // Example: Your WhatsApp number (international format without '+')
  const phoneNumber = "+2348012345678"; // Example: Your business phone number

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
            onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
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
          AI-powered electrical advice for Ibadan, Nigeria.
        </p>
      </div>
    </footer>
  );
}
