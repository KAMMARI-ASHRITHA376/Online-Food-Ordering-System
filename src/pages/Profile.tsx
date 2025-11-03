import { User, MapPin, CreditCard, Heart, Settings, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

interface Profile {
  full_name: string;
  email: string;
  phone: string;
  address: string;
}

interface Order {
  id: string;
  items: any;
  total_amount: number;
  status: string;
  created_at: string;
}

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format").optional().or(z.literal("")),
  address: z.string().trim().min(5, "Address must be at least 5 characters").max(500, "Address must be less than 500 characters").optional().or(z.literal("")),
});

const Profile = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Profile>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
      fetchFavorites();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (data) {
      setProfile(data);
      setFormData(data);
    }
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (data) setOrders(data);
  };

  const fetchFavorites = async () => {
    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user?.id);

    if (data) setFavorites(data);
  };

  const handleUpdateProfile = async () => {
    try {
      const validated = profileSchema.parse(formData);
      
      const { error } = await supabase
        .from("profiles")
        .update(validated)
        .eq("id", user?.id);

      if (!error) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        setProfile(validated as Profile);
        setEditMode(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-foreground mb-8">
            My <span className="text-gradient">Profile</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="p-6 gradient-card border-border text-center">
                <div className="w-24 h-24 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {profile?.full_name || "User"}
                </h2>
                <p className="text-muted-foreground mb-4">{profile?.email}</p>
                <Badge className="bg-primary text-primary-foreground">
                  Member
                </Badge>
              </Card>

              <Card className="p-4 gradient-card border-border">
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setEditMode(!editMode)}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Personal Info
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Heart className="h-5 w-5 mr-3" />
                    Favorites
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center gradient-card border-border">
                  <Package className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </Card>
                <Card className="p-4 text-center gradient-card border-border">
                  <Heart className="h-6 w-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{favorites.length}</p>
                  <p className="text-xs text-muted-foreground">Favorites</p>
                </Card>
                <Card className="p-4 text-center gradient-card border-border">
                  <CreditCard className="h-6 w-6 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">₹{totalSpent.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </Card>
              </div>

              {/* Edit Profile Form */}
              {editMode && (
                <Card className="p-6 gradient-card border-border">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Edit Profile</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, full_name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Recent Orders */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Recent Orders</h2>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <Card className="p-8 text-center gradient-card border-border">
                      <p className="text-muted-foreground">No orders yet</p>
                    </Card>
                  ) : (
                    orders.map((order) => (
                      <Card key={order.id} className="p-4 gradient-card border-border hover-lift cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground">Order #{order.id.slice(0, 8)}</h3>
                              <p className="text-sm text-muted-foreground">
                                {Array.isArray(order.items) ? order.items.length : 0} items
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-secondary text-secondary-foreground">
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                          <span className="font-bold text-primary">₹{Number(order.total_amount).toFixed(2)}</span>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Saved Addresses */}
              {profile?.address && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-foreground">Saved Address</h2>
                  </div>
                  <Card className="p-4 gradient-card border-border">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground mb-1">Primary Address</h3>
                        <p className="text-sm text-muted-foreground">{profile.address}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setEditMode(true)}>
                        Edit
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
