import { useState, useEffect } from "react"; // MODIFIED
import { Plus, Star, Leaf, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

// --- NEW: Define the shape of data from your database ---
type MenuItemFromDB = {
  item_id: number;
  restaurant_id: number;
  item_name: string;
  description: string;
  price: number;
  item_availability: boolean;
  category: string;
  health_score: number;
  item_rating: number;
  image_url: string;
};

// --- NEW: Define the shape of data your component expects ---
type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  isHealthy: boolean;
  calories: number;
};

// --- REMOVED the hardcoded 'allMenuItems' array ---

const Menu = () => {
  // --- NEW: State for loading data from the API ---
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- Your existing states are perfect ---
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();

  // --- NEW: useEffect to fetch all menu items on component load ---
  useEffect(() => {
    const fetchAllMenuData = async () => {
      try {
        // Fetch from the general /api/menu endpoint to get ALL items
        const response = await fetch("http://localhost:3001/api/menu");

        if (!response.ok) {
          throw new Error("Failed to fetch menu. Is the backend server running?");
        }

        const data: MenuItemFromDB[] = await response.json();

        // Transform database data into the format your component expects
        const transformedData = data.map(item => ({
          id: item.item_id,
          name: item.item_name,
          description: item.description,
          price: parseFloat(String(item.price)),
          rating: parseFloat(String(item.item_rating)),
          image: item.image_url,
          category: item.category,
          isHealthy: item.category === 'Healthy',
          calories: item.health_score,
        }));

        setMenuItems(transformedData); // Save the transformed data to state
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllMenuData();
  }, []); // Empty array means this runs once on load

  // --- MODIFIED: Dynamically create categories from the fetched data ---
  // We use 'new Set' to get only unique category names
  const categories = ["All", ...new Set(menuItems.map(item => item.category))];

  // --- MODIFIED: Changed 'allMenuItems.filter' to 'menuItems.filter' ---
  const filteredItems = menuItems.filter((item) => {
    // Determine if the category matches
    let matchesCategory = false;
    if (selectedCategory === "All") {
      matchesCategory = true;
    } else if (selectedCategory === "Healthy") {
      matchesCategory = item.isHealthy;
    } else {
      matchesCategory = item.category === selectedCategory;
    }

    // Determine if the search query matches
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // --- NEW: Add loading and error states ---
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">Loading full menu...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center text-red-500">
            <strong>Error:</strong> {error}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Your existing JSX (no changes needed) ---
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h1 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-foreground">
              Full <span className="text-gradient">Menu</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our complete collection of delicious meals
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Pills (This now maps over your dynamic categories) */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "gradient-primary border-0" : ""}
              >
                {category === "Healthy" && <Leaf className="h-4 w-4 mr-2" />}
                {category}
              </Button>
            ))}
          </div>

          {/* Menu Grid (This now maps over your filtered items from the DB) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden gradient-card border-border hover-lift cursor-pointer"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {item.isHealthy && (
                      <Badge className="bg-secondary text-secondary-foreground shadow-md">
                        <Leaf className="h-3 w-3 mr-1" />
                        Healthy
                      </Badge>
                    )}
                    <Badge className="bg-card text-foreground shadow-md">
                      {item.calories} cal
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-foreground">{item.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-tertiary text-tertiary" />
                        <span className="text-sm font-semibold text-foreground">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-bold text-primary">
                      ₹{item.price}
                    </span>
                    <Button 
                      size="sm" 
                      className="gradient-primary border-0 shadow-md hover:shadow-glow"
                      onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Menu;