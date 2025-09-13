import { useState } from "react";
import { Grid, List, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import Navigation from "@/components/Navigation";

// Mock data
const mockProducts = [
  {
    id: "1",
    title: "NVIDIA RTX 4080 Gaming Graphics Card - Excellent Condition",
    price: 899.99,
    originalPrice: 1199.99,
    condition: "Excellent",
    image: "/api/placeholder/300/300",
    seller: "TechDeals Pro",
    rating: 4.8,
  },
  {
    id: "2", 
    title: "AMD Ryzen 9 5900X CPU Processor - Barely Used",
    price: 299.99,
    originalPrice: 549.99,
    condition: "Very Good",
    image: "/api/placeholder/300/300",
    seller: "PC Builder",
    rating: 4.9,
  },
  {
    id: "3",
    title: "Corsair 32GB DDR4 3200MHz RAM Kit",
    price: 149.99,
    originalPrice: 229.99,
    condition: "Good",
    image: "/api/placeholder/300/300",
    seller: "Memory Store",
    rating: 4.7,
  },
  {
    id: "4",
    title: "ASUS ROG Strix B550-F Gaming Motherboard",
    price: 179.99,
    originalPrice: 249.99,
    condition: "Very Good",
    image: "/api/placeholder/300/300",
    seller: "ASUS Direct",
    rating: 4.6,
  },
  {
    id: "5",
    title: "Samsung 980 PRO 1TB NVMe SSD",
    price: 89.99,
    originalPrice: 149.99,
    condition: "Excellent",
    image: "/api/placeholder/300/300",
    seller: "Storage Solutions",
    rating: 4.8,
  },
  {
    id: "6",
    title: "Cooler Master Hyper 212 RGB CPU Cooler",
    price: 39.99,
    originalPrice: 59.99,
    condition: "Good",
    image: "/api/placeholder/300/300",
    seller: "Cooling Expert",
    rating: 4.5,
  },
];

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handleQuickView = (id: string) => {
    console.log("Quick view product:", id);
    // Implement quick view modal
  };

  const handleAddToCart = (id: string) => {
    console.log("Add to cart:", id);
    // Implement add to cart functionality
  };

  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = mockProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold mb-2">PC Components</h1>
            <p className="text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, mockProducts.length)} of {mockProducts.length} products
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          : "flex flex-col space-y-4"
        }>
          {currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onQuickView={handleQuickView}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 mt-12">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className="w-10"
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Products;