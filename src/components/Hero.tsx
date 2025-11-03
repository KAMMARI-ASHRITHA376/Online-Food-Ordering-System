import { ArrowRight, Zap, Leaf, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroFood from "@/assets/hero-food.jpg";
import droneIcon from "@/assets/drone-icon.png";

const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-hero py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Now with Drone Delivery!
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-['Poppins'] text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gradient">FOODONIC</span>
                <br />
                <span className="text-foreground">Bite Into</span>
                <br />
                <span className="text-primary">Speed & Flavor!</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Revolutionary food ordering with eco-friendly drone delivery, 
                real-time tracking, and health-focused options. Fast, sustainable, 
                and delicious!
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/menu">
                <Button 
                  size="lg" 
                  className="gradient-primary border-0 shadow-lg hover:shadow-glow text-base font-semibold group"
                >
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
                </Button>
              </Link>
              <Link to="/tracking">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
                >
                  Track Your Order
                </Button>
              </Link>
            </div>

            {/* Features Pills */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                <Leaf className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">Healthy Options</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Super Fast</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Live Tracking</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={heroFood} 
                alt="Delicious food dishes including burgers, pizza, and fresh salads"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>

            {/* Floating Drone Badge */}
            <div className="absolute -top-4 -right-4 bg-card rounded-2xl shadow-lg p-4 animate-float border border-border">
              <div className="flex items-center gap-3">
                <img src={droneIcon} alt="Delivery Drone" className="h-12 w-12" />
                <div>
                  <p className="font-bold text-foreground">Drone Delivery</p>
                  <p className="text-sm text-muted-foreground">Eco-Friendly & Fast</p>
                </div>
              </div>
            </div>

            {/* Stats Badge */}
            <div className="absolute bottom-4 left-4 bg-card rounded-xl shadow-lg p-4 border border-border">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">15min</p>
                  <p className="text-xs text-muted-foreground">Avg Delivery</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">98%</p>
                  <p className="text-xs text-muted-foreground">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
