import { MapPin, Package, CheckCircle2, Clock, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import droneIcon from "@/assets/drone-icon.png";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  items: any;
  total_amount: number;
  status: string;
  delivery_address: string;
  created_at: string;
}

interface Profile {
  address: string;
}

const Tracking = () => {
  const { user, loading } = useAuth();
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLatestOrder();
      fetchProfile();
    } else {
      setLoadingData(false);
    }
  }, [user]);

  const fetchLatestOrder = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setLatestOrder(data);
    setLoadingData(false);
  };

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("address")
      .eq("id", user?.id)
      .maybeSingle();

    setProfile(data);
  };

  const getOrderStatus = (status: string) => {
    const allStatuses = [
      { label: "Order Placed", completed: true, time: latestOrder?.created_at ? new Date(latestOrder.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "" },
      { label: "Preparing", completed: status !== "pending", time: "" },
      { label: "Out for Delivery", completed: status === "delivered" || status === "out_for_delivery", time: "" },
      { label: "Delivered", completed: status === "delivered", time: "" },
    ];
    return allStatuses;
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!latestOrder) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-foreground mb-8">
              Track Your <span className="text-gradient">Order</span>
            </h1>
            
            <Card className="p-12 text-center gradient-card border-border">
              <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">No Orders Yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't placed any orders yet. Order some delicious food to track your delivery!
              </p>
              <Link to="/menu">
                <Button className="gradient-primary border-0">Browse Menu</Button>
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const orderStatus = getOrderStatus(latestOrder.status);
  const itemCount = Array.isArray(latestOrder.items) ? latestOrder.items.length : 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-foreground mb-8">
            Track Your <span className="text-gradient">Order</span>
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="space-y-6">
              <Card className="p-6 gradient-card border-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Order #{latestOrder.id.slice(0, 8)}</h3>
                    <p className="text-sm text-muted-foreground">{itemCount} items - ₹{Number(latestOrder.total_amount).toFixed(2)}</p>
                  </div>
                  <Badge className="bg-secondary text-secondary-foreground capitalize">
                    {latestOrder.status === "out_for_delivery" ? (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        En Route
                      </>
                    ) : (
                      latestOrder.status
                    )}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {orderStatus.map((status, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`mt-1 rounded-full p-1 ${
                        status.completed 
                          ? 'bg-secondary text-secondary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-semibold ${
                            status.completed ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {status.label}
                          </p>
                          {status.time && (
                            <span className="text-sm text-muted-foreground">{status.time}</span>
                          )}
                        </div>
                        {index === 2 && latestOrder.status === "out_for_delivery" && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-secondary">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">Drone is on the way</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Delivery Details */}
              <Card className="p-6 gradient-card border-border">
                <h3 className="font-bold text-foreground mb-4">Delivery Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Delivery Address</p>
                      <p className="text-sm text-muted-foreground">
                        {latestOrder.delivery_address || profile?.address || "Address not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Order Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(latestOrder.created_at).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Map Visual */}
            <div>
              <Card className="p-8 gradient-card border-border sticky top-24">
                <div className="aspect-square rounded-2xl bg-muted/50 relative overflow-hidden">
                  {/* Simplified Map Background */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className="border border-muted-foreground/20" />
                      ))}
                    </div>
                  </div>

                  {/* Route Line */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M 100 100 Q 200 150, 300 200 T 400 300"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="10,5"
                      className="animate-pulse-slow"
                    />
                  </svg>

                  {/* Restaurant Pin */}
                  <div className="absolute top-16 left-16 flex flex-col items-center animate-scale-in">
                    <div className="bg-accent text-accent-foreground rounded-full p-3 shadow-lg">
                      <Package className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-foreground mt-2 bg-card px-2 py-1 rounded shadow">
                      Restaurant
                    </span>
                  </div>

                  {/* Drone - only show if out for delivery */}
                  {latestOrder.status === "out_for_delivery" && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float">
                      <img src={droneIcon} alt="Delivery Drone" className="h-20 w-20 drop-shadow-xl" />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <Badge className="bg-primary text-primary-foreground shadow-lg">
                          In Transit
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Destination Pin */}
                  <div className="absolute bottom-16 right-16 flex flex-col items-center animate-scale-in">
                    <div className="bg-secondary text-secondary-foreground rounded-full p-3 shadow-lg">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-foreground mt-2 bg-card px-2 py-1 rounded shadow">
                      Your Location
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tracking;
