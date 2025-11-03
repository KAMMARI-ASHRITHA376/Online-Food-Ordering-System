import { useState } from "react";
import { Plus, Star, Leaf, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

const allMenuItems = [
  {
    id: 1,
    name: "Gourmet Burger Deluxe",
    description: "Premium beef patty with fresh veggies and special sauce",
    price: 329,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    category: "Burgers",
    isHealthy: false,
    calories: 650,
  },
  {
    id: 2,
    name: "Mediterranean Salad Bowl",
    description: "Fresh greens, feta cheese, olives, and olive oil dressing",
    price: 279,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
    category: "Healthy",
    isHealthy: true,
    calories: 320,
  },
  {
    id: 3,
    name: "Pepperoni Pizza",
    description: "Classic Italian pizza with premium mozzarella",
    price: 449,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    category: "Pizza",
    isHealthy: false,
    calories: 890,
  },
  {
    id: 4,
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with quinoa and steamed vegetables",
    price: 649,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=300&fit=crop",
    category: "Healthy",
    isHealthy: true,
    calories: 420,
  },
  {
    id: 5,
    name: "Chicken Caesar Wrap",
    description: "Grilled chicken, romaine lettuce, parmesan, caesar dressing",
    price: 199,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
    category: "Burgers",
    isHealthy: false,
    calories: 580,
  },
  {
    id: 6,
    name: "Veggie Supreme Pizza",
    description: "Loaded with fresh vegetables and mozzarella cheese",
    price: 399,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    category: "Pizza",
    isHealthy: false,
    calories: 720,
  },
  {
    id: 7,
    name: "Quinoa Buddha Bowl",
    description: "Nutrient-packed bowl with quinoa, avocado, and roasted veggies",
    price: 299,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    category: "Healthy",
    isHealthy: true,
    calories: 380,
  },
  {
    id: 8,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center and vanilla ice cream",
    price: 179,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
    category: "Desserts",
    isHealthy: false,
    calories: 520,
  },
];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();

  const categories = ["All", "Burgers", "Pizza", "Healthy", "Desserts"];

  const filteredItems = allMenuItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

          {/* Filter Pills */}
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

          {/* Menu Grid */}
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
