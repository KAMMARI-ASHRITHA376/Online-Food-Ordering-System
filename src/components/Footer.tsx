import { Leaf, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg gradient-primary p-2">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-['Poppins'] text-xl font-bold text-foreground">
                  FOODONIC
                </h3>
                <p className="text-xs text-muted-foreground">
                  Bite Into Speed & Flavor
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Revolutionary food ordering with drone delivery, real-time tracking, and health-focused options.
            </p>
            <div className="flex gap-3">
              <a href="#" className="rounded-full bg-muted p-2 hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-muted p-2 hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-muted p-2 hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#home" className="hover:text-primary transition-smooth">Home</a></li>
              <li><a href="#menu" className="hover:text-primary transition-smooth">Menu</a></li>
              <li><a href="#tracking" className="hover:text-primary transition-smooth">Track Order</a></li>
              <li><a href="#features" className="hover:text-primary transition-smooth">Features</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">Drone Delivery</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Healthy Options</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Bulk Orders</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Corporate Catering</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@foodonic.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>123 Food Street, Delivery City, DC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 FOODONIC. All rights reserved. | Built with ❤️ for foodies everywhere</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
