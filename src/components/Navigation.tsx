import { useState } from "react";
import { Search, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { AuthModal } from '@/components/AuthModal'
import { useAuth } from '@/hooks/useAuth'
import { Cart } from '@/components/Cart'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

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
            <Cart />
            <Button 
              variant="ghost" 
              onClick={() => navigate("/products")}
            >
              Browse
            </Button>
            {user && (
              <Button 
                variant="ghost" 
                onClick={() => navigate("/orders")}
              >
                Orders
              </Button>
            )}
            {user && user.user_metadata?.role === 'seller' && (
              <Button 
                variant="ghost" 
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
            )}
            <Button 
              variant="ai-accent" 
              onClick={() => navigate("/ai-evaluation")}
            >
              AI Evaluation
            </Button>
            
            {!loading && (
              user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsAuthModalOpen(true)} className="gap-2">
                  <User className="w-4 h-4" />
                  Sign In
                </Button>
              )
            )}
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
            <div className="flex justify-center mb-2">
              <Cart />
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </Button>
            {user && (
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate("/orders")}
              >
                My Orders
              </Button>
            )}
            {user && user.user_metadata?.role === 'seller' && (
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate("/dashboard")}
              >
                Seller Dashboard
              </Button>
            )}
            <Button 
              variant="ai-accent" 
              className="w-full justify-start"
              onClick={() => navigate("/ai-evaluation")}
            >
              AI Evaluation
            </Button>
            {!loading && !user && (
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In / Register
              </Button>
            )}
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
};

export default Navigation;