import { useState } from "react";
import { Plus, Star, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const menuItems = [
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
];

const MenuPreview = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart } = useCart();

  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => 
        selectedCategory === "Healthy" ? item.isHealthy : item.category === selectedCategory
      );

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

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
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
