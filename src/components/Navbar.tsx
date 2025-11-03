import { ShoppingCart, User, Menu, Leaf, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-lg gradient-primary p-2">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-['Poppins'] text-xl font-bold text-foreground">
              FOODONIC
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium -mt-1">
              Bite Into Speed & Flavor
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
            Home
          </Link>
          <Link to="/menu" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
            Menu
          </Link>
          <Link to="/tracking" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
            Track Order
          </Link>
          <Link to="/menu" className="text-sm font-medium text-foreground hover:text-primary transition-smooth flex items-center gap-1">
            <Leaf className="h-4 w-4 text-secondary" />
            Healthy Options
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-primary text-xs font-bold text-primary-foreground flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex"
                onClick={signOut}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="secondary" size="sm" className="hidden md:flex">
                Sign In
              </Button>
            </Link>
          )}

          <Link to="/menu">
            <Button className="hidden md:flex gradient-primary border-0 shadow-md hover:shadow-glow">
              Order Now
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
