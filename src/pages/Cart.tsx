import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 49 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to place an order.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Get user profile for address
    const { data: profile } = await supabase
      .from("profiles")
      .select("address")
      .eq("id", user.id)
      .single();

    // Create order in database
    const { error } = await supabase.from("orders").insert([{
      user_id: user.id,
      items: cartItems as any,
      total_amount: total,
      delivery_address: profile?.address || "Not specified",
      status: "pending",
    }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Placed!",
      description: "Your order has been placed successfully. Redirecting to tracking...",
    });
    clearCart();
    setTimeout(() => navigate("/tracking"), 1500);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-foreground mb-8">
            Your <span className="text-gradient">Cart</span>
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
              <Link to="/menu">
                <Button className="gradient-primary border-0">Browse Menu</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                <Card key={item.id} className="p-4 gradient-card border-border">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-foreground">{item.name}</h3>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-lg font-bold text-primary mb-3">
                        ₹{item.price}
                      </p>
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold text-foreground w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 gradient-card border-border sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between text-foreground text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full gradient-primary border-0 shadow-md hover:shadow-glow mb-3"
                  onClick={handleCheckout}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                </Button>
                
                <Link to="/menu">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
