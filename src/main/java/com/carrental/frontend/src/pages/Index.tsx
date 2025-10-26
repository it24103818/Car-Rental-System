import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Calendar, AlertTriangle, CreditCard, Bell, Users, CheckCircle, Wrench, Menu, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Index = () => {
  const stats = [
    {
      title: "Total Bookings",
      value: "127",
      change: "+12%",
      trend: "up",
      icon: Calendar
    },
    {
      title: "Active Rentals",
      value: "34",
      change: "+5%",
      trend: "up",
      icon: Car
    },
    {
      title: "Revenue (MTD)",
      value: "$24,580",
      change: "+18%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Available Vehicles",
      value: "42",
      change: "-3%",
      trend: "down",
      icon: CheckCircle
    }
  ];

  const modules = [
    {
      icon: Calendar,
      title: "Booking Management",
      description: "Manage reservations and rental schedules",
      count: "127 total",
      href: "/bookings"
    },
    {
      icon: Car,
      title: "Fleet Management",
      description: "Track and manage all vehicles",
      count: "76 vehicles",
      href: "/fleet"
    },
    {
      icon: AlertTriangle,
      title: "Incident Reports",
      description: "Document and track damage reports",
      count: "3 pending",
      href: "/incidents"
    },
    {
      icon: CreditCard,
      title: "Payment Records",
      description: "Track transactions and invoices",
      count: "$24,580 MTD",
      href: "/payments"
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Booking alerts and updates",
      count: "8 unread",
      href: "/notifications"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Manage customers and staff",
      count: "234 users",
      href: "/users"
    },
    {
      icon: CheckCircle,
      title: "Availability",
      description: "Monitor vehicle availability",
      count: "42 available",
      href: "/availability"
    },
    {
      icon: Wrench,
      title: "Maintenance",
      description: "Schedule vehicle maintenance",
      count: "5 scheduled",
      href: "/maintenance"
    }
  ];

  const recentActivity = [
    { type: "booking", text: "New booking for Toyota Camry by John Doe", time: "5 min ago" },
    { type: "return", text: "Honda Accord returned by Jane Smith", time: "1 hour ago" },
    { type: "payment", text: "Payment received: $450 from Mike Johnson", time: "2 hours ago" },
    { type: "maintenance", text: "BMW X5 scheduled for maintenance", time: "3 hours ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Car className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-xl font-bold">CarRental Pro</h1>
              <p className="text-xs text-muted-foreground">Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">Monitor and manage your car rental operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <TrendIcon className={`h-3 w-3 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                    <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Management Modules */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Management Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link key={index} to={module.href}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-primary h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="secondary" className="text-xs">{module.count}</Badge>
                      </div>
                      <CardTitle className="text-base mt-3">{module.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">{module.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your rental operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
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
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                New Booking
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Car className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Incident
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
