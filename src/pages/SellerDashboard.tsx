import { useState } from "react";
import { Package, TrendingUp, DollarSign, Eye, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navigation from "@/components/Navigation";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const stats = [
    {
      title: "Total Listings",
      value: "12",
      change: "+3 this month",
      icon: Package,
      color: "text-primary"
    },
    {
      title: "Total Sales",
      value: "$2,847",
      change: "+$420 this month",
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Views This Month",
      value: "1,234",
      change: "+156 from last month",
      icon: Eye,
      color: "text-ai-accent"
    },
    {
      title: "Success Rate",
      value: "85%",
      change: "+5% from last month",
      icon: TrendingUp,
      color: "text-warning"
    }
  ];

  const listings = [
    {
      id: "1",
      title: "NVIDIA RTX 4080 Gaming Graphics Card",
      price: 899.99,
      status: "Active",
      views: 234,
      watchers: 12,
      datePosted: "2024-01-15",
      image: "/api/placeholder/100/100"
    },
    {
      id: "2",
      title: "AMD Ryzen 9 5900X CPU Processor",
      price: 299.99,
      status: "Sold",
      views: 189,
      watchers: 8,
      datePosted: "2024-01-10",
      image: "/api/placeholder/100/100"
    },
    {
      id: "3",
      title: "Corsair 32GB DDR4 3200MHz RAM",
      price: 149.99,
      status: "Pending",
      views: 67,
      watchers: 5,
      datePosted: "2024-01-20",
      image: "/api/placeholder/100/100"
    }
  ];

  const recentActivity = [
    { type: "sale", message: "AMD Ryzen 9 5900X sold for $299.99", time: "2 hours ago" },
    { type: "view", message: "RTX 4080 received 15 new views", time: "4 hours ago" },
    { type: "message", message: "New message about RAM kit", time: "6 hours ago" },
    { type: "listing", message: "New listing created: SSD 1TB", time: "1 day ago" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-success text-success-foreground";
      case "Sold": return "bg-muted text-muted-foreground";
      case "Pending": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your listings and track performance</p>
          </div>
          <Button variant="ai-accent" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Create New Listing
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates on your listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 pb-3 border-b border-border last:border-b-0">
                        <div className="w-2 h-2 bg-ai-accent rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Listing
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Manage Inventory
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>My Listings</CardTitle>
                <CardDescription>Manage all your active and past listings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Watchers</TableHead>
                      <TableHead>Date Posted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img 
                              src={listing.image} 
                              alt={listing.title}
                              className="w-12 h-12 rounded object-cover bg-muted"
                            />
                            <div>
                              <p className="font-medium">{listing.title}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${listing.price}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(listing.status)}>
                            {listing.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{listing.views}</TableCell>
                        <TableCell>{listing.watchers}</TableCell>
                        <TableCell>{listing.datePosted}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Detailed insights about your listings performance</CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Analytics dashboard would go here</p>
                  <p className="text-sm">Charts and graphs showing performance metrics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Communicate with potential buyers</CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Message center would go here</p>
                  <p className="text-sm">Inbox for buyer inquiries and communications</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SellerDashboard;