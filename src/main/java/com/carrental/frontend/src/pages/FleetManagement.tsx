// src/pages/FleetManagement.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import hooks
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Car, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";



// Interface for UI state, using frontend-friendly names
interface Vehicle {
  id: number;
  licensePlate: string;
  make: string; // UI uses 'make'
  model: string;
  year: number;
  colour: string;
  mileageLimitPerDay: number;
  status: "Available" | "Under Maintenance" | "Unavailable" | "Rented";
  weeklyRate: number;
}

// --- API Functions ---
const API_BASE = "http://localhost:8080/api/vehicles"; // Adjust if your endpoint is different

const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error(`Failed to fetch vehicles: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const createVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vehicle),
  });
  if (!response.ok) {
    const errorText = await response.text(); // Get error details if needed
    console.error("Error creating vehicle:", errorText);
    throw new Error(`Failed to create vehicle: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const updateVehicle = async (id: number, vehicle: Vehicle): Promise<Vehicle> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vehicle),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error updating vehicle:", errorText);
    throw new Error(`Failed to update vehicle: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const deleteVehicle = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error deleting vehicle:", errorText);
    throw new Error(`Failed to delete vehicle: ${response.status} ${response.statusText}`);
  }
  // Optionally return response.json() if the backend returns a confirmation object
};

const FleetManagement = () => {
  const queryClient = useQueryClient();

  // Fetch vehicles from the backend using useQuery
  const {
    data: backendVehicles = [],
    isLoading,
    error,
  } = useQuery<Vehicle[]>({
    queryKey: ['vehicles'], // Unique key for caching
    queryFn: getVehicles, // Function to fetch data
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
  });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: (newVehicle) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] }); // Refetch vehicles
      setIsAddOpen(false);
      resetForm();
      toast({
        title: "Vehicle Added",
        description: `${newVehicle.make} ${newVehicle.model} has been added to the fleet.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to add vehicle: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Vehicle }) => updateVehicle(id, data),
    onSuccess: (updatedVehicle) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] }); // Refetch vehicles
      setIsEditOpen(false);
      setCurrentVehicle(null);
      resetForm();
      toast({
        title: "Vehicle Updated",
        description: `${updatedVehicle.make} ${updatedVehicle.model} details have been updated.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update vehicle: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] }); // Refetch vehicles
      toast({
        title: "Vehicle Removed",
        description: "Vehicle has been removed from the fleet.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to remove vehicle: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    colour: "",
    mileageLimitPerDay: 0,
    status: "Available" as Vehicle["status"],
    weeklyRate: 0, // Changed from dailyRate to match backend field
  });

  const resetForm = () => {
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      colour: "",
      mileageLimitPerDay: 0,
      status: "Available",
      weeklyRate: 0,
    });
  };

  // Handle Add (use createMutation.mutate)
  const handleAdd = () => {
    if (!formData.make || !formData.model || !formData.year || !formData.colour || formData.weeklyRate < 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    // Map UI form data to backend vehicle object
    const newBackendVehicle: Omit<Vehicle, 'id'> = {
      make: formData.make,
      model: formData.model,
      year: formData.year,
      licensePlate: formData.licensePlate,
      colour: formData.colour,
      mileageLimitPerDay: formData.mileageLimitPerDay,
      weeklyRate: formData.weeklyRate,
      status: formData.status , // Map status string to boolean
    };

    createMutation.mutate(newBackendVehicle);
  };

  // Handle Edit (set form data from selected vehicle)
  const handleEdit = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setFormData({
      make: vehicle.make, // Map backend 'brand' to UI 'make'
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      colour: vehicle.colour,
      mileageLimitPerDay: vehicle.mileageLimitPerDay,
      status: vehicle.status, // Map boolean to status string
      weeklyRate: vehicle.weeklyRate,
    });
    setIsEditOpen(true);
  };

  // Handle Update (use updateMutation.mutate)
  const handleUpdate = () => {
    if (!currentVehicle) return; // Should not happen if button is disabled correctly

    if (!formData.make || !formData.model || !formData.year || !formData.colour || formData.weeklyRate < 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    // Map UI form data to backend vehicle object, keeping the ID
    const updatedBackendVehicle: Vehicle = {
      ...currentVehicle, // Keep the ID
      make: formData.make,
      model: formData.model,
      year: formData.year,
      licensePlate: formData.licensePlate,
      colour: formData.colour,
      mileageLimitPerDay: formData.mileageLimitPerDay,
      weeklyRate: formData.weeklyRate,
      status: formData.status , // Map status string to boolean
    };

    updateMutation.mutate({ id: currentVehicle.id, data: updatedBackendVehicle });
  };

  // Handle Delete (use deleteMutation.mutate)
  const handleDelete = (id: number) => { // Change id type to number
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      deleteMutation.mutate(id);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading vehicles...</p>
          </div>
        </div>
    );
  }

  // Show error state
  if (error) {
    return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-destructive">Failed to load vehicles.</p>
            <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
            <Button onClick={() => queryClient.refetchQueries({ queryKey: ['vehicles'] })}>
              Try Again
            </Button>
          </div>
        </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<Vehicle["status"], "default" | "destructive" | "secondary" | "outline"> = {
      Available: "default",
      Rented: "secondary",
      "Under Maintenance": "outline",
      Unavailable: "destructive",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Car className="h-8 w-8" />
                  Fleet Management
                </h1>
                <p className="text-muted-foreground">Manage your vehicle inventory</p>
              </div>
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button disabled={createMutation.isPending}> {/* Disable button during mutation */}
                  {createMutation.isPending ? ( // Show spinner if creating
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                  ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Vehicle
                      </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Vehicle</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new vehicle to add to your fleet.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input
                          id="make"
                          value={formData.make}
                          onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                          placeholder="Toyota"
                          disabled={createMutation.isPending} // Disable input during mutation
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                          id="model"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                          placeholder="Camry"
                          disabled={createMutation.isPending} // Disable input during mutation
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                          id="year"
                          type="number"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                          disabled={createMutation.isPending} // Disable input during mutation
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licensePlate">License Plate</Label>
                      <Input
                          id="licensePlate"
                          value={formData.licensePlate}
                          onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                          placeholder="ABC-1234"
                          disabled={createMutation.isPending} // Disable input during mutation
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input
                          id="color"
                          value={formData.colour}
                          onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                          placeholder="Silver"
                          disabled={createMutation.isPending} // Disable input during mutation
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileageLimitPerDay">Mileage Limit Per Day</Label>
                      <Input
                          id="mileageLimitPerDay"
                          type="number"
                          value={formData.mileageLimitPerDay}
                          onChange={(e) => setFormData({ ...formData, mileageLimitPerDay: parseInt(e.target.value) })}
                          disabled={createMutation.isPending} // Disable input during mutation
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weeklyRate">Weekly Rate ($)</Label>
                      <Input
                          id="weeklyRate"
                          type="number"
                          value={formData.weeklyRate}
                          onChange={(e) => setFormData({ ...formData, weeklyRate: parseFloat(e.target.value) })}
                          disabled={createMutation.isPending} // Disable input during mutation
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={formData.status}
                        onValueChange={(value: Vehicle["status"]) =>
                            setFormData({ ...formData, status: value })
                        }
                        disabled={createMutation.isPending} // Disable select during mutation
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                        <SelectItem value="Unavailable">Unavailable</SelectItem>
                        {/* Note: "Rented" status might require separate logic if stored differently */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                      variant="outline"
                      onClick={() => setIsAddOpen(false)}
                      disabled={createMutation.isPending} // Disable button during mutation
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAdd} disabled={createMutation.isPending}> {/* Disable button during mutation */}
                    {createMutation.isPending ? "Adding..." : "Add Vehicle"} {/* Show different text during mutation */}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Inventory</CardTitle>
              <CardDescription>
                Total Vehicles: {backendVehicles.length} | Available: {backendVehicles.filter((v) => v.status === "Available").length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>License Plate</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Mileage Limit/Day</TableHead>
                    <TableHead>Weekly Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backendVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">
                          {vehicle.make} {vehicle.model} {/* Use backend field names */}
                        </TableCell>
                        <TableCell>{vehicle.licensePlate}</TableCell>
                        <TableCell>{vehicle.year}</TableCell>
                        <TableCell>{vehicle.colour}</TableCell>
                        <TableCell>{vehicle.mileageLimitPerDay.toLocaleString()}</TableCell>
                        <TableCell>${vehicle.weeklyRate}/week</TableCell>
                        <TableCell>{getStatusBadge(vehicle.status)}</TableCell> {/* Pass boolean available field */}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(vehicle)} // Pass backend vehicle object
                                disabled={updateMutation.isPending || deleteMutation.isPending} // Disable during other mutations
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDelete(vehicle.id)} // Pass backend vehicle ID
                                disabled={deleteMutation.isPending} // Disable during mutation
                            >
                              {deleteMutation.isPending && deleteMutation.variables === vehicle.id ? ( // Show spinner if deleting this item
                                  <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                  <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Vehicle</DialogTitle>
                <DialogDescription>Update vehicle details</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-make">Make</Label>
                    <Input
                        id="edit-make"
                        value={formData.make}
                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                        disabled={updateMutation.isPending} // Disable input during mutation
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-model">Model</Label>
                    <Input
                        id="edit-model"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        disabled={updateMutation.isPending} // Disable input during mutation
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-year">Year</Label>
                    <Input
                        id="edit-year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        disabled={updateMutation.isPending} // Disable input during mutation
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-licensePlate">License Plate</Label>
                    <Input
                        id="edit-licensePlate"
                        value={formData.licensePlate}
                        onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                        disabled={updateMutation.isPending} // Disable input during mutation
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-color">Color</Label>
                    <Input
                        id="edit-color"
                        value={formData.colour}
                        onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                        disabled={updateMutation.isPending} // Disable input during mutation
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-mileageLimitPerDay">Mileage Limit Per Day</Label>
                    <Input
                        id="edit-mileageLimitPerDay"
                        type="number"
                        value={formData.mileageLimitPerDay}
                        onChange={(e) => setFormData({ ...formData, mileageLimitPerDay: parseInt(e.target.value) })}
                        disabled={updateMutation.isPending} // Disable input during mutation
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-weeklyRate">Weekly Rate ($)</Label>
                    <Input
                        id="edit-weeklyRate"
                        type="number"
                        value={formData.weeklyRate}
                        onChange={(e) => setFormData({ ...formData, weeklyRate: parseFloat(e.target.value) })}
                        disabled={updateMutation.isPending} // Disable input during mutation
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                      value={formData.status}
                      onValueChange={(value: Vehicle["status"]) =>
                          setFormData({ ...formData, status: value })
                      }
                      disabled={updateMutation.isPending} // Disable select during mutation
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="Unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => setIsEditOpen(false)}
                    disabled={updateMutation.isPending} // Disable button during mutation
                >
                  Cancel
                </Button>
                <Button
                    onClick={handleUpdate}
                    disabled={updateMutation.isPending} // Disable button during mutation
                >
                  {updateMutation.isPending ? "Updating..." : "Update Vehicle"} {/* Show different text during mutation */}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
  );
};

export default FleetManagement;