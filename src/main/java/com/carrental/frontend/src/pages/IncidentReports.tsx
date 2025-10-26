import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Plus, Pencil, Trash2, Car, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { getIncidentReports, createIncidentReport, updateIncidentReport, deleteIncidentReport, IncidentReport } from "@/api/incidents";

const IncidentReports = () => {
  const { toast } = useToast();
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentIncident, setCurrentIncident] = useState<IncidentReport | null>(null);
  const [formData, setFormData] = useState({
    vehicleID: "",
    vehicleDescription: "",
    incidentDate: "",
    incidentType: "",
    severity: "",
    description: "",
    reporterName: "",
    status: "Reported",
    estimatedCost: "",
    resolutionNotes: ""
  });

  // Load incidents on component mount
  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const incidentsData = await getIncidentReports();
      setIncidents(incidentsData);
    } catch (error) {
      toast({
        title: "Error loading incidents",
        description: "Failed to fetch incident reports",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleID: "",
      vehicleDescription: "",
      incidentDate: "",
      incidentType: "",
      severity: "",
      description: "",
      reporterName: "",
      status: "Reported",
      estimatedCost: "",
      resolutionNotes: ""
    });
  };

  const handleAdd = async () => {
    try {
      const incidentData = {
        vehicleID: formData.vehicleID ? parseInt(formData.vehicleID) : null,
        vehicleDescription: formData.vehicleDescription,
        incidentDate: formData.incidentDate,
        incidentType: formData.incidentType,
        severity: formData.severity,
        description: formData.description,
        reporterName: formData.reporterName,
        status: formData.status,
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost.replace('$', '').replace(',', '')) : null,
        resolutionNotes: formData.resolutionNotes
      };

      const newIncident = await createIncidentReport(incidentData);
      if (newIncident) {
        await loadIncidents();
        setIsAddDialogOpen(false);
        resetForm();
        toast({
          title: "Incident Report Added",
          description: "The incident report has been successfully added."
        });
      } else {
        throw new Error("Failed to create incident report");
      }
    } catch (error) {
      toast({
        title: "Error adding incident",
        description: "Failed to add incident report",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (incident: IncidentReport) => {
    setCurrentIncident(incident);
    setFormData({
      vehicleID: incident.vehicleID?.toString() || "",
      vehicleDescription: incident.vehicleDescription,
      incidentDate: incident.incidentDate,
      incidentType: incident.incidentType,
      severity: incident.severity,
      description: incident.description,
      reporterName: incident.reporterName,
      status: incident.status,
      estimatedCost: incident.estimatedCost?.toString() || "",
      resolutionNotes: incident.resolutionNotes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!currentIncident) return;

    try {
      const incidentData = {
        vehicleID: formData.vehicleID ? parseInt(formData.vehicleID) : null,
        vehicleDescription: formData.vehicleDescription,
        incidentDate: formData.incidentDate,
        incidentType: formData.incidentType,
        severity: formData.severity,
        description: formData.description,
        reporterName: formData.reporterName,
        status: formData.status,
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost.replace('$', '').replace(',', '')) : null,
        resolutionNotes: formData.resolutionNotes
      };

      const updatedIncident = await updateIncidentReport(currentIncident.id, incidentData);
      if (updatedIncident) {
        await loadIncidents();
        setIsEditDialogOpen(false);
        setCurrentIncident(null);
        resetForm();
        toast({
          title: "Incident Report Updated",
          description: "The incident report has been successfully updated."
        });
      } else {
        throw new Error("Failed to update incident report");
      }
    } catch (error) {
      toast({
        title: "Error updating incident",
        description: "Failed to update incident report",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this incident report?")) {
      return;
    }

    try {
      const success = await deleteIncidentReport(id);
      if (success) {
        await loadIncidents();
        toast({
          title: "Incident Report Deleted",
          description: "The incident report has been successfully deleted.",
          variant: "destructive"
        });
      } else {
        throw new Error("Failed to delete incident report");
      }
    } catch (error) {
      toast({
        title: "Error deleting incident",
        description: "Failed to delete incident report",
        variant: "destructive"
      });
    }
  };
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Resolved":
      case "Closed":
        return "default";
      case "Under Investigation":
        return "secondary";
      case "Reported":
        return "outline";
      default:
        return "outline";
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "Severe":
        return "bg-red-500 text-white";
      case "Moderate":
        return "bg-orange-500 text-white";
      case "Minor":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <AlertTriangle className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Incident Reports</h1>
              <p className="text-xs text-muted-foreground">Document and track damage reports</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Report Incident
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Report New Incident</DialogTitle>
                <DialogDescription>Add details about the incident or damage report</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <Input
                    id="vehicle"
                    placeholder="e.g., Toyota Camry - ABC123"
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="incidentDate">Incident Date</Label>
                    <Input
                      id="incidentDate"
                      type="date"
                      value={formData.incidentDate}
                      onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="incidentType">Incident Type</Label>
                    <Select value={formData.incidentType} onValueChange={(value) => setFormData({ ...formData, incidentType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Accident">Accident</SelectItem>
                        <SelectItem value="Damage">Damage</SelectItem>
                        <SelectItem value="Theft">Theft</SelectItem>
                        <SelectItem value="Vandalism">Vandalism</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Minor">Minor</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Reported">Reported</SelectItem>
                        <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what happened..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reporterName">Reporter Name</Label>
                    <Input
                      id="reporterName"
                      placeholder="Name of person reporting"
                      value={formData.reporterName}
                      onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="estimatedCost">Estimated Cost</Label>
                    <Input
                      id="estimatedCost"
                      placeholder="e.g., $1,000"
                      value={formData.estimatedCost}
                      onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="resolutionNotes">Resolution Notes</Label>
                  <Textarea
                    id="resolutionNotes"
                    placeholder="Notes about resolution (if any)..."
                    value={formData.resolutionNotes}
                    onChange={(e) => setFormData({ ...formData, resolutionNotes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Add Incident Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Incident Reports</CardTitle>
            <CardDescription>View and manage all incident and damage reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">{incident.vehicle}</TableCell>
                    <TableCell>{incident.incidentDate}</TableCell>
                    <TableCell>{incident.incidentType}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityBadgeColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{incident.reporterName}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(incident.status)}>
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{incident.estimatedCost}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(incident)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(incident.id)}
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
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Incident Report</DialogTitle>
            <DialogDescription>Update incident report details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-vehicle">Vehicle</Label>
              <Input
                id="edit-vehicle"
                value={formData.vehicle}
                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-incidentDate">Incident Date</Label>
                <Input
                  id="edit-incidentDate"
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-incidentType">Incident Type</Label>
                <Select value={formData.incidentType} onValueChange={(value) => setFormData({ ...formData, incidentType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Accident">Accident</SelectItem>
                    <SelectItem value="Damage">Damage</SelectItem>
                    <SelectItem value="Theft">Theft</SelectItem>
                    <SelectItem value="Vandalism">Vandalism</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-severity">Severity</Label>
                <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Minor">Minor</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reported">Reported</SelectItem>
                    <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-reporterName">Reporter Name</Label>
                <Input
                  id="edit-reporterName"
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-estimatedCost">Estimated Cost</Label>
                <Input
                  id="edit-estimatedCost"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-resolutionNotes">Resolution Notes</Label>
              <Textarea
                id="edit-resolutionNotes"
                value={formData.resolutionNotes}
                onChange={(e) => setFormData({ ...formData, resolutionNotes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Incident Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncidentReports;
