import { ArrowRight, Cpu, HardDrive, Zap, Shield, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Evaluation",
      description: "Get instant, accurate valuations of your PC components using advanced AI technology."
    },
    {
      icon: Shield,
      title: "Verified Sellers",
      description: "All sellers are verified with ratings and reviews for safe transactions."
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Track component prices and market trends to make informed buying decisions."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of PC enthusiasts buying and selling quality components."
    }
  ];

  const categories = [
    { name: "Graphics Cards", icon: "🎮", count: "1,247 items" },
    { name: "Processors", icon: "🔧", count: "892 items" },
    { name: "Memory & Storage", icon: "💾", count: "1,456 items" },
    { name: "Motherboards", icon: "🔌", count: "687 items" },
    { name: "Cooling", icon: "❄️", count: "423 items" },
    { name: "Power Supply", icon: "⚡", count: "321 items" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Buy & Sell PC Components
            <span className="block text-ai-accent">Intelligently</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            The first marketplace with AI-powered component evaluation. Get fair prices, verified quality, and instant valuations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button 
              variant="secondary" 
              size="xl"
              onClick={() => navigate("/products")}
              className="group"
            >
              Browse Components
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="ai-accent" 
              size="xl"
              onClick={() => navigate("/ai-evaluation")}
              className="group"
            >
              Try AI Evaluation
              <Zap className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Cpu className="w-24 h-24 text-white animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <HardDrive className="w-32 h-32 text-white animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="hover:shadow-card transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => navigate("/products")}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose PCMarket?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge AI technology with a trusted marketplace to revolutionize how you buy and sell PC components.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of PC enthusiasts already using PCMarket to buy and sell components.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              variant="secondary" 
              size="xl"
              onClick={() => navigate("/products")}
            >
              Start Shopping
            </Button>
            <Button 
              variant="ai-accent" 
              size="xl"
              onClick={() => navigate("/sell")}
            >
              Start Selling
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PCMarket</h3>
              <p className="text-primary-foreground/80">
                The intelligent marketplace for PC components.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Graphics Cards</li>
                <li>Processors</li>
                <li>Memory & Storage</li>
                <li>Motherboards</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Safety Guidelines</li>
                <li>Shipping Info</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 PCMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;