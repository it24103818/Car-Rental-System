import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: "available" | "booked" | "maintenance" | "blocked";
  currentBooking?: {
    customer: string;
    startDate: string;
    endDate: string;
  };
  nextAvailable?: string;
  maintenanceScheduled?: string;
}

interface BlockedPeriod {
  id: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

const initialVehicles: Vehicle[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    licensePlate: "ABC-123",
    status: "available",
    nextAvailable: new Date().toISOString(),
  },
  {
    id: "2",
    make: "Honda",
    model: "Accord",
    year: 2024,
    licensePlate: "XYZ-789",
    status: "booked",
    currentBooking: {
      customer: "John Doe",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    },
    nextAvailable: new Date(Date.now() + 3 * 86400000).toISOString(),
  },
  {
    id: "3",
    make: "Ford",
    model: "Explorer",
    year: 2023,
    licensePlate: "DEF-456",
    status: "maintenance",
    maintenanceScheduled: new Date(Date.now() + 86400000).toISOString(),
    nextAvailable: new Date(Date.now() + 2 * 86400000).toISOString(),
  },
  {
    id: "4",
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    licensePlate: "EV-001",
    status: "available",
    nextAvailable: new Date().toISOString(),
  },
  {
    id: "5",
    make: "BMW",
    model: "X5",
    year: 2023,
    licensePlate: "BMW-555",
    status: "blocked",
    nextAvailable: new Date(Date.now() + 5 * 86400000).toISOString(),
  },
];

const AvailabilityManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [blockStartDate, setBlockStartDate] = useState("");
  const [blockEndDate, setBlockEndDate] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const statusConfig = {
    available: { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", variant: "default" as const },
    booked: { icon: Calendar, color: "text-blue-600", bgColor: "bg-blue-50", variant: "secondary" as const },
    maintenance: { icon: AlertTriangle, color: "text-orange-600", bgColor: "bg-orange-50", variant: "destructive" as const },
    blocked: { icon: XCircle, color: "text-red-600", bgColor: "bg-red-50", variant: "outline" as const },
  };

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === "available").length,
    booked: vehicles.filter(v => v.status === "booked").length,
    maintenance: vehicles.filter(v => v.status === "maintenance").length,
    blocked: vehicles.filter(v => v.status === "blocked").length,
  };

  const filteredVehicles = filterStatus === "all" 
    ? vehicles 
    : vehicles.filter(v => v.status === filterStatus);

  const handleBlockVehicle = () => {
    if (!selectedVehicle || !blockStartDate || !blockEndDate || !blockReason) {
      toast.error("Please fill in all fields");
      return;
    }

    const newBlock: BlockedPeriod = {
      id: Date.now().toString(),
      vehicleId: selectedVehicle.id,
      startDate: blockStartDate,
      endDate: blockEndDate,
      reason: blockReason,
    };

    setBlockedPeriods([...blockedPeriods, newBlock]);
    setVehicles(vehicles.map(v => 
      v.id === selectedVehicle.id 
        ? { ...v, status: "blocked", nextAvailable: blockEndDate }
        : v
    ));

    toast.success("Vehicle blocked successfully");
    setSelectedVehicle(null);
    setBlockStartDate("");
    setBlockEndDate("");
    setBlockReason("");
  };

  const handleUnblockVehicle = (vehicleId: string) => {
    setVehicles(vehicles.map(v => 
      v.id === vehicleId 
        ? { ...v, status: "available", nextAvailable: new Date().toISOString() }
        : v
    ));
    setBlockedPeriods(blockedPeriods.filter(bp => bp.vehicleId !== vehicleId));
    toast.success("Vehicle unblocked successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Car className="h-8 w-8" />
              Availability Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage vehicle availability and prevent overbooking
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Vehicles</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Available
              </CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.available}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                Booked
              </CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.booked}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Maintenance
              </CardDescription>
              <CardTitle className="text-3xl text-orange-600">{stats.maintenance}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-600" />
                Blocked
              </CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.blocked}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vehicle Availability Status</CardTitle>
                <CardDescription>Real-time availability tracking for all vehicles</CardDescription>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table" className="w-full">
              <TabsList>
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="blocked">Blocked Periods</TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>License Plate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Current Booking</TableHead>
                      <TableHead>Next Available</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => {
                      const config = statusConfig[vehicle.status];
                      const StatusIcon = config.icon;
                      
                      return (
                        <TableRow key={vehicle.id}>
                          <TableCell>
                            <div className="font-medium">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{vehicle.licensePlate}</TableCell>
                          <TableCell>
                            <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                              <StatusIcon className="h-3 w-3" />
                              {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {vehicle.currentBooking ? (
                              <div className="text-sm">
                                <div className="font-medium">{vehicle.currentBooking.customer}</div>
                                <div className="text-muted-foreground">
                                  {new Date(vehicle.currentBooking.startDate).toLocaleDateString()} - 
                                  {new Date(vehicle.currentBooking.endDate).toLocaleDateString()}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {vehicle.nextAvailable ? (
                              <div className="flex items-center gap-1 text-sm">
                                <Clock className="h-3 w-3" />
                                {new Date(vehicle.nextAvailable).toLocaleDateString()}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {vehicle.status === "blocked" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUnblockVehicle(vehicle.id)}
                                >
                                  Unblock
                                </Button>
                              ) : (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedVehicle(vehicle)}
                                    >
                                      Block
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Block Vehicle Availability</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Vehicle</Label>
                                        <p className="text-sm text-muted-foreground">
                                          {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                                        </p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="startDate">Start Date</Label>
                                        <Input
                                          id="startDate"
                                          type="date"
                                          value={blockStartDate}
                                          onChange={(e) => setBlockStartDate(e.target.value)}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="endDate">End Date</Label>
                                        <Input
                                          id="endDate"
                                          type="date"
                                          value={blockEndDate}
                                          onChange={(e) => setBlockEndDate(e.target.value)}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="reason">Reason</Label>
                                        <Input
                                          id="reason"
                                          placeholder="e.g., Off-site event, repairs, etc."
                                          value={blockReason}
                                          onChange={(e) => setBlockReason(e.target.value)}
                                        />
                                      </div>
                                      <Button onClick={handleBlockVehicle} className="w-full">
                                        Block Vehicle
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="blocked" className="mt-4">
                <div className="space-y-4">
                  {blockedPeriods.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No blocked periods
                    </div>
                  ) : (
                    blockedPeriods.map((period) => {
                      const vehicle = vehicles.find(v => v.id === period.vehicleId);
                      return (
                        <Card key={period.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">
                                  {vehicle?.year} {vehicle?.make} {vehicle?.model}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(period.startDate).toLocaleDateString()} - 
                                  {new Date(period.endDate).toLocaleDateString()}
                                </div>
                                <div className="text-sm mt-1">
                                  <span className="font-medium">Reason:</span> {period.reason}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnblockVehicle(period.vehicleId)}
                              >
                                Remove Block
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AvailabilityManagement;
