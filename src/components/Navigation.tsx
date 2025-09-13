import { useState } from "react";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div 
              className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate("/")}
            >
              PCMarket
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for CPUs, GPUs, RAM..."
                className="pl-10 pr-4 w-full"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/sell")}
            >
              Sell Components
            </Button>
            <Button 
              variant="ai-accent" 
              onClick={() => navigate("/ai-evaluation")}
            >
              AI Evaluation
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <User className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search components..."
              className="pl-10 pr-4 w-full"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/sell")}
            >
              Sell Components
            </Button>
            <Button 
              variant="ai-accent" 
              className="w-full justify-start"
              onClick={() => navigate("/ai-evaluation")}
            >
              AI Evaluation
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;