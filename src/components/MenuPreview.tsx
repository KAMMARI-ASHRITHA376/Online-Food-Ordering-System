// --- Imports ---
import { useState, useEffect } from "react"; // <-- MODIFIED (added useEffect)
import { Plus, Star, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
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

// --- REMOVED the hardcoded 'menuItems' array ---

const MenuPreview = () => {
  // --- NEW: State for loading data from the API ---
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]); // This will hold our data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- This is your existing code, it's perfect ---
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart } = useCart();

  // --- NEW: useEffect to fetch data on component load ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Fetch from restaurant_id = 1 (Foodonic)
        const response = await fetch("http://localhost:3001/api/restaurants/1/menu");

        if (!response.ok) {
          throw new Error("Failed to fetch menu. Is the backend server running?");
        }

        const data: MenuItemFromDB[] = await response.json();

        // --- NEW: Transform database data into the format your component expects ---
        const transformedData = data.map(item => ({
          id: item.item_id,
          name: item.item_name,
          description: item.description,
          price: parseFloat(String(item.price)),
          rating: parseFloat(String(item.item_rating)),
          image: item.image_url,
          category: item.category,
          isHealthy: item.category === 'Healthy', // We derive this
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

    fetchMenu();
  }, []); // Empty array means this runs once on load

  // --- This is your existing filter logic. It works perfectly! ---
  // It now uses the `menuItems` state variable populated from the database.
  const filteredItems = selectedCategory === "All"
    ? menuItems
    : menuItems.filter(item =>
        selectedCategory === "Healthy" ? item.isHealthy : item.category === selectedCategory
      );

  // --- NEW: Add loading and error states ---
  if (loading) {
    return (
      <section className="py-16 md:py-24" id="menu">
        <div className="container mx-auto px-4 text-center">Loading menu...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24" id="menu">
        <div className="container mx-auto px-4 text-center text-red-500">
          <strong>Error:</strong> {error}
        </div>
      </section>
    );
  }

  // --- Your existing JSX (no changes needed) ---
  return (
    <section className="py-16 md:py-24" id="menu">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-foreground">
            Popular <span className="text-gradient">Menu Items</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From healthy bowls to comfort food – we've got something for every craving
          </p>
        </div>

        {/* Filter Pills (This logic is perfect) */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {/* Your Button components... (no changes) */}
           <Button 
             variant={selectedCategory === "All" ? "default" : "outline"}
             onClick={() => setSelectedCategory("All")}
             className={selectedCategory === "All" ? "gradient-primary border-0" : ""}
           >
             All Items
           </Button>
           <Button 
             variant={selectedCategory === "Burgers" ? "default" : "outline"}
             onClick={() => setSelectedCategory("Burgers")}
             className={selectedCategory === "Burgers" ? "gradient-primary border-0" : ""}
           >
             Burgers
           </Button>
           <Button 
             variant={selectedCategory === "Pizza" ? "default" : "outline"}
             onClick={() => setSelectedCategory("Pizza")}
             className={selectedCategory === "Pizza" ? "gradient-primary border-0" : ""}
           >
             Pizza
           </Button>
           <Button 
             variant={selectedCategory === "Healthy" ? "default" : "outline"}
             onClick={() => setSelectedCategory("Healthy")}
             className={selectedCategory === "Healthy" ? "gradient-primary border-0" : ""}
           >
             <Leaf className="h-4 w-4 mr-2" />
             Healthy Options
           </Button>
           <Button 
             variant={selectedCategory === "Desserts" ? "default" : "outline"}
             onClick={() => setSelectedCategory("Desserts")}
             className={selectedCategory === "Desserts" ? "gradient-primary border-0" : ""}
           >
             Desserts
           </Button>
        </div>

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id}
              className="group overflow-hidden gradient-card border-border hover-lift cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={item.image} // This now comes from your DB's 'image_url'
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
                    {item.calories} cal {/* This now comes from 'health_score' */}
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
                  {/* Your addToCart logic works perfectly with the new data */}
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

        {/* View More */}
        <div className="text-center mt-12">
          <Link to="/menu">
            <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
              View Full Menu
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;