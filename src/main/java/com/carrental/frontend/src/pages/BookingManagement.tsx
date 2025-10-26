import { useState, useEffect } from "react";
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
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getBookingsWithEmail, createBooking, updateBooking, deleteBooking, BookingWithEmail, Booking } from "@/api/booking";

const BookingManagement = () => {
  const [bookings, setBookings] = useState<BookingWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingWithEmail | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerID: "",
    vehicleID: "",
    pickupDate: "",
    returnDate: "",
    bookingStatus: "pending",
    totalCost: 0,
    pickupLocation: "",
    returnLocation: "",
  });

  // Load bookings on component mount
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await getBookingsWithEmail();
      setBookings(bookingsData);
    } catch (error) {
      toast({
        title: "Error loading bookings",
        description: "Failed to fetch bookings data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBooking(null);
    setFormData({
      customerName: "",
      customerEmail: "",
      customerID: "",
      vehicleID: "",
      pickupDate: "",
      returnDate: "",
      bookingStatus: "pending",
      totalCost: 0,
      pickupLocation: "",
      returnLocation: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (booking: BookingWithEmail) => {
    setEditingBooking(booking);
    setFormData({
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      vehicleID: booking.vehicleID.toString(),
      customerID: booking.customerID.toString(),
      pickupDate: booking.pickupDate,
      returnDate: booking.returnDate,
      bookingStatus: booking.bookingStatus,
      totalCost: booking.totalCost,
      pickupLocation: booking.pickupLocation,
      returnLocation: booking.returnLocation,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    try {
      const success = await deleteBooking(id);
      if (success) {
        setBookings(bookings.filter((booking) => booking.bookingID !== id));
        toast({
          title: "Booking deleted",
          description: "The booking has been removed successfully.",
        });
      } else {
        throw new Error("Failed to delete booking");
      }
    } catch (error) {
      toast({
        title: "Error deleting booking",
        description: "Failed to delete the booking",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const bookingData: Booking = {
        id: editingBooking ? editingBooking.bookingID : 0, // Will be ignored for new bookings
        customerID: parseInt(formData.customerID || "0"), // You need to get this from somewhere
        vehicleID: parseInt(formData.vehicleID),
        customerName: formData.customerName,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        pickupLocation: formData.pickupLocation,
        returnLocation: formData.returnLocation,
        totalCost: formData.totalCost,
        bookingStatus: formData.bookingStatus,
      };

      if (editingBooking) {
        const updatedBooking = await updateBooking(editingBooking.bookingID, bookingData);
        if (updatedBooking) {
          await loadBookings();
          toast({
            title: "Booking updated",
            description: "The booking has been updated successfully.",
          });
        } else {
          throw new Error("Failed to update booking");
        }
      } else {
        const newBooking = await createBooking(bookingData);
        if (newBooking) {
          await loadBookings();
          toast({
            title: "Booking added",
            description: "New booking has been added successfully.",
          });
        } else {
          throw new Error("Failed to create booking");
        }
      }

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: editingBooking ? "Error updating booking" : "Error creating booking",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-blue-600";
      case "active":
        return "text-green-600";
      case "completed":
        return "text-gray-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Booking Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage vehicle reservations and bookings
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Booking
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingBooking ? "Edit Booking" : "Add New Booking"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingBooking
                        ? "Update the booking details below"
                        : "Fill in the booking information below"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                          id="customerName"
                          value={formData.customerName}
                          onChange={(e) =>
                              setFormData({ ...formData, customerName: e.target.value })
                          }
                          required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Customer Email</Label>
                      <Input
                          id="customerEmail"
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) =>
                              setFormData({ ...formData, customerEmail: e.target.value })
                          }
                          required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleID">Vehicle ID</Label>
                    <Input
                        id="vehicleID"
                        type="number"
                        value={formData.vehicleID}
                        onChange={(e) =>
                            setFormData({ ...formData, vehicleID: e.target.value })
                        }
                        placeholder="e.g., 123"
                        required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickupDate">Pickup Date</Label>
                      <Input
                          id="pickupDate"
                          type="date"
                          value={formData.pickupDate}
                          onChange={(e) =>
                              setFormData({ ...formData, pickupDate: e.target.value })
                          }
                          required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="returnDate">Return Date</Label>
                      <Input
                          id="returnDate"
                          type="date"
                          value={formData.returnDate}
                          onChange={(e) =>
                              setFormData({ ...formData, returnDate: e.target.value })
                          }
                          required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bookingStatus">Status</Label>
                      <Select
                          value={formData.bookingStatus}
                          onValueChange={(value) =>
                              setFormData({ ...formData, bookingStatus: value })
                          }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalCost">Total Cost ($)</Label>
                      <Input
                          id="totalCost"
                          type="number"
                          step="0.01"
                          value={formData.totalCost}
                          onChange={(e) =>
                              setFormData({ ...formData, totalCost: parseFloat(e.target.value) })
                          }
                          required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickupLocation">Pickup Location</Label>
                      <Input
                          id="pickupLocation"
                          value={formData.pickupLocation}
                          onChange={(e) =>
                              setFormData({ ...formData, pickupLocation: e.target.value })
                          }
                          required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="returnLocation">Return Location</Label>
                      <Input
                          id="returnLocation"
                          value={formData.returnLocation}
                          onChange={(e) =>
                              setFormData({ ...formData, returnLocation: e.target.value })
                          }
                          required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingBooking ? "Update" : "Add"} Booking
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                View and manage all vehicle bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Vehicle ID</TableHead>
                    <TableHead>Pickup Date</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Pickup</TableHead>
                    <TableHead>Return</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                      <TableRow key={booking.bookingID}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.customerName}</div>
                            <div className="text-sm text-muted-foreground">
                              {booking.customerEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.vehicleID}</TableCell>
                        <TableCell>{booking.pickupDate}</TableCell>
                        <TableCell>{booking.returnDate}</TableCell>
                        <TableCell>
                      <span className={`font-medium capitalize ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus}
                      </span>
                        </TableCell>
                        <TableCell>${booking.totalCost.toFixed(2)}</TableCell>
                        <TableCell>{booking.pickupLocation}</TableCell>
                        <TableCell>{booking.returnLocation}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(booking)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDelete(booking.bookingID)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default BookingManagement;