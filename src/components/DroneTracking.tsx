import { MapPin, Package, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import droneIcon from "@/assets/drone-icon.png";

const DroneTracking = () => {
  const orderStatus = [
    { label: "Order Placed", time: "2:30 PM", completed: true },
    { label: "Preparing", time: "2:35 PM", completed: true },
    { label: "Out for Delivery", time: "2:45 PM", completed: true },
    { label: "Arriving", time: "2:55 PM", completed: false },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30" id="tracking">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Tracking Demo */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge className="bg-primary text-primary-foreground">
                Live Tracking
              </Badge>
              <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-foreground">
                Track Your <span className="text-gradient">Drone Delivery</span> Live
              </h2>
              <p className="text-lg text-muted-foreground">
                Real-time GPS tracking lets you monitor your order from kitchen to doorstep. 
                Watch your drone fly to you with precision timing!
              </p>
            </div>

            {/* Order Timeline */}
            <Card className="p-6 gradient-card border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-foreground text-lg">Order #FD-1234</h3>
                  <p className="text-sm text-muted-foreground">Mediterranean Salad Bowl + Drinks</p>
                </div>
                <Badge className="bg-secondary text-secondary-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  10 min away
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
                        <span className="text-sm text-muted-foreground">{status.time}</span>
                      </div>
                      {index === 2 && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-secondary">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">Drone is 2.3 km away</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center gradient-card border-border">
                <Package className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">250+</p>
                <p className="text-xs text-muted-foreground">Orders Today</p>
              </Card>
              <Card className="p-4 text-center gradient-card border-border">
                <Clock className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">15min</p>
                <p className="text-xs text-muted-foreground">Avg Time</p>
              </Card>
              <Card className="p-4 text-center gradient-card border-border">
                <MapPin className="h-6 w-6 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">5km</p>
                <p className="text-xs text-muted-foreground">Max Range</p>
              </Card>
            </div>
          </div>

          {/* Right - Map Visual */}
          <div className="relative">
            <Card className="p-8 gradient-card border-border">
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

                {/* Drone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float">
                  <img src={droneIcon} alt="Delivery Drone" className="h-20 w-20 drop-shadow-xl" />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <Badge className="bg-primary text-primary-foreground shadow-lg">
                      In Transit
                    </Badge>
                  </div>
                </div>

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
    </section>
  );
};

export default DroneTracking;
