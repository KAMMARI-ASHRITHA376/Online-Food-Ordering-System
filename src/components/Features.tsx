import { Plane, Leaf, MapPin, Shield, Clock, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import healthyFood from "@/assets/healthy-food.jpg";

const features = [
  {
    icon: Plane,
    title: "Drone Delivery",
    description: "Eco-friendly electric drones deliver your food faster, bypassing traffic for 15-min average delivery.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: MapPin,
    title: "Real-Time Tracking",
    description: "Track your order and drone location live with GPS precision. Know exactly when your food arrives.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Leaf,
    title: "Health-Focused Filters",
    description: "Smart recommendations for nutritious meals. Filter by calories, dietary preferences, and health goals.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Multiple payment options with bank-grade encryption. Your transactions are always protected.",
    color: "text-tertiary",
    bgColor: "bg-tertiary/10",
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description: "Pre-order meals and schedule deliveries. Perfect for busy professionals and planned events.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Heart,
    title: "Sustainability",
    description: "Reduced carbon footprint with electric drones and eco-friendly packaging. Good for you and Earth.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30" id="features">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in">
          <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-foreground">
            Why Choose <span className="text-gradient">FOODONIC</span>?
          </h2>
          <p className="text-lg text-muted-foreground">
            Revolutionary features that make food ordering faster, healthier, and more sustainable
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 gradient-card border-border hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`${feature.bgColor} ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Healthy Options Highlight */}
        <Card className="gradient-card border-border overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="p-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                <Leaf className="h-4 w-4 text-secondary" />
                <span className="text-sm font-semibold text-secondary">
                  Featured Benefit
                </span>
              </div>
              
              <h3 className="font-['Poppins'] text-3xl md:text-4xl font-bold text-foreground">
                Promoting Healthier Food Choices
              </h3>
              
              <p className="text-muted-foreground text-lg">
                Our database-driven recommendation engine suggests nutritious meals based on your preferences and health goals. Filter by calories, dietary restrictions, and nutritional value to make informed choices.
              </p>

              <div className="flex flex-wrap gap-3 pt-4">
                <div className="px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium text-sm">
                  Calorie Tracking
                </div>
                <div className="px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium text-sm">
                  Dietary Filters
                </div>
                <div className="px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium text-sm">
                  Nutrition Info
                </div>
              </div>
            </div>

            <div className="relative h-full min-h-[300px]">
              <img 
                src={healthyFood} 
                alt="Fresh healthy salad bowl with vibrant vegetables"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-card/50" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Features;
