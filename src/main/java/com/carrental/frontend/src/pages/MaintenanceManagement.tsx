import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Wrench, Plus, Pencil, Trash2, Loader2, Search, Check, X } from "lucide-react";
import {
  getMaintenanceByCar,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from "@/api/maintenance";
import { checkVehicleExists, getVehicles } from "@/api/vehicles";

interface MaintenanceRecord {
  id: number;
  vehicleId: string;
  serviceDate: string;
  issue: string;
  cost: number;
  status: "pending" | "in-progress" | "completed";
  mechanicName: string;
}

interface Vehicle {
  id: number;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
}

// --- Status mapping helpers ---
const mapStatusToUI = (apiStatus: string): MaintenanceRecord["status"] => {
  switch (apiStatus?.toLowerCase()) {
    case "pending": return "pending";
    case "in_progress":
    case "in-progress": return "in-progress";
    case "completed": return "completed";
    default: return "pending";
  }
};

const mapStatusToAPI = (uiStatus: MaintenanceRecord["status"]): string => {
  switch (uiStatus) {
    case "pending": return "PENDING";
    case "in-progress": return "IN_PROGRESS";
    case "completed": return "COMPLETED";
  }
};

// --- Transform API data to match UI ---
const transformApiData = (apiData: any[] = []): MaintenanceRecord[] => {
  return apiData.map(item => ({
    id: item.id,
    vehicleId: item.vehicle?.id?.toString() || "N/A",
    serviceDate: item.maintenanceDate || item.serviceDate || new Date().toISOString().split('T')[0],
    issue: item.issue || "",
    cost: Number(item.cost || 0),
    status: mapStatusToUI(item.status),
    mechanicName: item.mechanicName || "Unknown Mechanic"
  }));
};

export default function MaintenanceManagement() {
  const queryClient = useQueryClient();
  const [searchVehicleId, setSearchVehicleId] = useState<string>("");
  const [activeVehicleId, setActiveVehicleId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleInput, setVehicleInput] = useState("");
  const [isCheckingVehicle, setIsCheckingVehicle] = useState(false);
  const [vehicleExists, setVehicleExists] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    serviceDate: "",
    issue: "",
    cost: "",
    status: "pending" as MaintenanceRecord["status"],
    mechanicName: ""
  });

  // Fetch available vehicles
  const { data: vehiclesData = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  useEffect(() => {
    setVehicles(vehiclesData);
  }, [vehiclesData]);

  // Check vehicle existence when typing
  useEffect(() => {
    const checkVehicle = async () => {
      const vehicleId = parseInt(vehicleInput);
      if (!isNaN(vehicleId) && vehicleId > 0) {
        setIsCheckingVehicle(true);
        const exists = await checkVehicleExists(vehicleId);
        setVehicleExists(exists);
        setActiveVehicleId(exists ? vehicleId : null);
        setIsCheckingVehicle(false);
      } else {
        setVehicleExists(null);
        setActiveVehicleId(null);
      }
    };
    const timeoutId = setTimeout(checkVehicle, 500);
    return () => clearTimeout(timeoutId);
  }, [vehicleInput]);

  // Fetch maintenance records
  const { data: records = [], isLoading, error } = useQuery({
    queryKey: ["maintenance", activeVehicleId],
    queryFn: () => activeVehicleId ? getMaintenanceByCar(activeVehicleId) : [],
    select: transformApiData,
    enabled: !!activeVehicleId,
  });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: createMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", activeVehicleId] });
      toast({ title: "Record added", description: "Maintenance record created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create maintenance record.", variant: "destructive" });
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateMaintenance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", activeVehicleId] });
      toast({ title: "Record updated", description: "Maintenance record updated successfully." });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update maintenance record.", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", activeVehicleId] });
      toast({ title: "Record deleted", description: "Maintenance record removed successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete maintenance record.", variant: "destructive" });
    }
  });

  // --- Form logic ---
  const resetForm = () => {
    setFormData({
      serviceDate: "",
      issue: "",
      cost: "",
      status: "pending",
      mechanicName: ""
    });
    setEditingRecord(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (record: MaintenanceRecord) => {
    setEditingRecord(record);
    const vehicleIdFromRecord = parseInt(record.vehicleId.replace("VH-", ""));
    setVehicleInput(vehicleIdFromRecord.toString());
    setFormData({
      serviceDate: record.serviceDate,
      issue: record.issue,
      cost: record.cost.toString(),
      status: record.status,
      mechanicName: record.mechanicName
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleInput || !formData.serviceDate || !formData.issue || !formData.cost || !formData.mechanicName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const vehicleIdNum = Number(vehicleInput.replace(/\D/g, ""));
    if (Number.isNaN(vehicleIdNum) || vehicleIdNum <= 0) {
      toast({
        title: "Validation Error",
        description: "Vehicle ID must be a valid number.",
        variant: "destructive"
      });
      return;
    }

    const maintenanceData = {
      vehicle: { id: activeVehicleId },
      issue: formData.issue,
      cost: parseFloat(formData.cost),
      maintenanceDate: formData.serviceDate,
      serviceDate: formData.serviceDate,
      status: mapStatusToAPI(formData.status),
      mechanicName: formData.mechanicName
    };

    if (editingRecord) {
      updateMutation.mutate({ id: editingRecord.id, data: maintenanceData });
    } else {
      createMutation.mutate(maintenanceData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  // --- Helpers ---
  const getStatusBadgeClass = (status: MaintenanceRecord["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const getVehicleDisplayInfo = () => {
    if (!activeVehicleId) return null;
    const vehicle = vehicles.find(v => v.id === activeVehicleId);
    return vehicle
        ? `${vehicle.licensePlate} - ${vehicle.make} ${vehicle.model} (${vehicle.year})`
        : `Vehicle ID: ${activeVehicleId}`;
  };

  // --- Loading / Error states ---
  if (isLoading) {
    return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading maintenance records...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-destructive">Failed to load maintenance records.</p>
            <Button onClick={() => queryClient.refetchQueries({ queryKey: ["maintenance", activeVehicleId] })}>
              Try Again
            </Button>
          </div>
        </div>
    );
  }

  // --- Main UI ---
  return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* New Header Section */}
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div>
              <Wrench className="h-10 w-10 text-primary mx-auto mb-2" />
              <h1 className="text-3xl font-bold text-foreground">Maintenance Management</h1>
              <p className="text-muted-foreground">
                Track and manage vehicle maintenance records
              </p>
              {activeVehicleId && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Currently viewing: {getVehicleDisplayInfo()}
                  </p>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2">
                <Input
                    type="text"
                    placeholder="Search by Vehicle ID..."
                    value={searchVehicleId}
                    onChange={(e) => setSearchVehicleId(e.target.value)}
                    className="w-48"
                />
                <Button
                    onClick={() => {
                      const id = parseInt(searchVehicleId);
                      if (!isNaN(id)) {
                        setActiveVehicleId(id);
                      } else {
                        toast({
                          title: "Invalid input",
                          description: "Please enter a valid numeric Vehicle ID.",
                          variant: "destructive",
                        });
                      }
                    }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAdd} disabled={createMutation.isPending}>
                    {createMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="mr-2 h-4 w-4" />
                    )}
                    Add Maintenance
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>{editingRecord ? "Edit" : "Add"} Maintenance Record</DialogTitle>
                    <DialogDescription>
                      {editingRecord ? "Update" : "Enter"} the maintenance details below.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicleId">Vehicle ID *</Label>
                        <div className="relative">
                          <Input
                              id="vehicleId"
                              value={vehicleInput}
                              onChange={(e) => setVehicleInput(e.target.value)}
                              placeholder="Enter Vehicle ID (e.g., 1, 2, 3...)"
                              required
                          />
                          {isCheckingVehicle && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />}
                          {vehicleExists === true && <Check className="absolute right-3 top-3 h-4 w-4 text-green-600" />}
                          {vehicleExists === false && <X className="absolute right-3 top-3 h-4 w-4 text-red-600" />}
                        </div>
                        {vehicleExists === true && activeVehicleId && (
                            <p className="text-sm text-green-600">✓ Vehicle found: {getVehicleDisplayInfo()}</p>
                        )}
                        {vehicleExists === false && (
                            <p className="text-sm text-red-600">✗ Vehicle not found. Please enter a valid Vehicle ID.</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serviceDate">Service Date *</Label>
                        <Input
                            id="serviceDate"
                            type="date"
                            value={formData.serviceDate}
                            onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                            required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="issue">Issue/Service Details *</Label>
                        <Textarea
                            id="issue"
                            value={formData.issue}
                            onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                            placeholder="Describe the maintenance work needed or performed"
                            required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cost">Cost ($) *</Label>
                        <Input
                            id="cost"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.cost}
                            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                            placeholder="150.00"
                            required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value as MaintenanceRecord["status"] })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mechanicName">Mechanic Name *</Label>
                        <Input
                            id="mechanicName"
                            value={formData.mechanicName}
                            onChange={(e) => setFormData({ ...formData, mechanicName: e.target.value })}
                            placeholder="John Doe"
                            required
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          disabled={createMutation.isPending || updateMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                          type="submit"
                          disabled={createMutation.isPending || updateMutation.isPending || !vehicleExists}
                      >
                        {(createMutation.isPending || updateMutation.isPending) && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {editingRecord ? "Update" : "Add"} Record
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Maintenance records display */}
          {!activeVehicleId ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a Vehicle</h3>
                    <p className="text-muted-foreground mb-6">
                      Enter a Vehicle ID above to view and manage maintenance records.
                    </p>
                  </div>
                </CardContent>
              </Card>
          ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance History for {getVehicleDisplayInfo()}</CardTitle>
                  <CardDescription>View and manage maintenance records for this vehicle</CardDescription>
                </CardHeader>
                <CardContent>
                  {records.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No maintenance records found for this vehicle.
                      </div>
                  ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Vehicle ID</TableHead>
                              <TableHead>Service Date</TableHead>
                              <TableHead>Issue</TableHead>
                              <TableHead>Mechanic</TableHead>
                              <TableHead>Cost</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {records.map((record) => (
                                <TableRow key={record.id}>
                                  <TableCell className="font-medium">{record.vehicleId}</TableCell>
                                  <TableCell>{new Date(record.serviceDate).toLocaleDateString()}</TableCell>
                                  <TableCell className="max-w-xs truncate">{record.issue}</TableCell>
                                  <TableCell>{record.mechanicName}</TableCell>
                                  <TableCell>${record.cost.toFixed(2)}</TableCell>
                                  <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(record.status)}`}>
                              {record.status.replace("-", " ")}
                            </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button variant="ghost" size="icon" onClick={() => handleEdit(record)}>
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleDelete(record.id)}
                                          disabled={deleteMutation.isPending}
                                      >
                                        {deleteMutation.isPending && deleteMutation.variables === record.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        )}
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                  )}
                </CardContent>
              </Card>
          )}
        </div>
      </div>
  );
}