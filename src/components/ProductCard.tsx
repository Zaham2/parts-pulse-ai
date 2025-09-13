import { useState } from "react";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  condition: string;
  image: string;
  seller: string;
  rating: number;
  isLiked?: boolean;
  onQuickView: (id: string) => void;
  onAddToCart: (id: string) => void;
}

const ProductCard = ({
  id,
  title,
  price,
  originalPrice,
  condition,
  image,
  seller,
  rating,
  isLiked = false,
  onQuickView,
  onAddToCart,
}: ProductCardProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [imageError, setImageError] = useState(false);

  const conditionColor = {
    'Excellent': 'bg-success text-success-foreground',
    'Very Good': 'bg-ai-accent text-ai-accent-foreground',
    'Good': 'bg-warning text-warning-foreground',
    'Fair': 'bg-secondary text-secondary-foreground',
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-card hover:scale-[1.02]">
      {/* Favorite Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          setLiked(!liked);
        }}
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
      </Button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {imageError ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={handleImageError}
          />
        )}
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(id);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </Button>
          <Button
            variant="ai-accent"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(id);
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>

        {/* Condition Badge */}
        <Badge className={`absolute top-2 left-2 ${conditionColor[condition as keyof typeof conditionColor] || 'bg-muted'}`}>
          {condition}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
            {title}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                ${price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{seller}</span>
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">★</span>
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;