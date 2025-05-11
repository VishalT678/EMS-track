import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ambulance, Filter, Plus, Search } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

// Mocked ambulance data with more details
const ambulanceData = [
  { 
    id: 1, 
    callSign: "Alpha-1", 
    status: "responding", 
    location: "40.712, -74.006", 
    destination: "Manhattan General Hospital", 
    crew: ["J. Smith", "L. Davis"],
    eta: "4 mins",
    type: "Type III",
    equipment: "Advanced Life Support",
    lastMaintenance: "2024-04-12" 
  },
  { 
    id: 2, 
    callSign: "Bravo-2", 
    status: "available", 
    location: "40.715, -74.012", 
    destination: null, 
    crew: ["M. Johnson", "R. Williams"],
    eta: null,
    type: "Type II",
    equipment: "Basic Life Support",
    lastMaintenance: "2024-04-10" 
  },
  { 
    id: 3, 
    callSign: "Charlie-3", 
    status: "transporting", 
    location: "40.708, -74.003", 
    destination: "Downtown Medical Center", 
    crew: ["S. Brown", "J. Miller"],
    eta: "8 mins",
    type: "Type I",
    equipment: "Advanced Life Support",
    lastMaintenance: "2024-04-15" 
  },
  { 
    id: 4, 
    callSign: "Delta-4", 
    status: "returning", 
    location: "40.720, -74.010", 
    destination: "Station 3", 
    crew: ["A. Wilson", "D. Taylor"],
    eta: "12 mins",
    type: "Type III",
    equipment: "Advanced Life Support",
    lastMaintenance: "2024-04-08" 
  },
  { 
    id: 5, 
    callSign: "Echo-5", 
    status: "maintenance", 
    location: "Station 2", 
    destination: null, 
    crew: [],
    eta: null,
    type: "Type II",
    equipment: "Basic Life Support",
    lastMaintenance: "2024-04-17" 
  },
  { 
    id: 6, 
    callSign: "Foxtrot-6", 
    status: "available", 
    location: "40.725, -74.005", 
    destination: null, 
    crew: ["R. Martinez", "C. Lee"],
    eta: null,
    type: "Type I",
    equipment: "Advanced Life Support",
    lastMaintenance: "2024-04-14" 
  },
  { 
    id: 7, 
    callSign: "Golf-7", 
    status: "available", 
    location: "40.718, -74.008", 
    destination: null, 
    crew: ["E. Harris", "T. Clark"],
    eta: null,
    type: "Type III",
    equipment: "Advanced Life Support",
    lastMaintenance: "2024-04-13" 
  },
  { 
    id: 8, 
    callSign: "Hotel-8", 
    status: "responding", 
    location: "40.723, -74.009", 
    destination: "112 W 34th St", 
    crew: ["B. King", "G. Wright"],
    eta: "6 mins",
    type: "Type II",
    equipment: "Basic Life Support",
    lastMaintenance: "2024-04-11" 
  }
];

const statusColors = {
  responding: "bg-medical-red text-white",
  available: "bg-green-500 text-white",
  transporting: "bg-yellow-500 text-white",
  returning: "bg-blue-500 text-white",
  maintenance: "bg-gray-500 text-white",
};

const AddAmbulanceDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Add New Ambulance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Ambulance</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleNumber">Vehicle Number</Label>
            <Input id="vehicleNumber" placeholder="Enter vehicle number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="driver">Driver Name</Label>
            <Input id="driver" placeholder="Enter driver name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="maintenance">Maintenance</option>
            </Select>
          </div>
          <Button className="w-full">Add Ambulance</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AmbulanceDetailsDialog = ({ ambulance }: { ambulance: any }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View Details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ambulance Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Vehicle Number</Label>
              <p className="text-sm font-medium">{ambulance.callSign}</p>
            </div>
            <div>
              <Label>Status</Label>
              <Badge className={
                ambulance.status === 'available' ? 'bg-green-500' :
                ambulance.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
              }>
                {ambulance.status}
              </Badge>
            </div>
            <div>
              <Label>Driver</Label>
              <p className="text-sm font-medium">{ambulance.crew.join(', ')}</p>
            </div>
            <div>
              <Label>Last Update</Label>
              <p className="text-sm font-medium">{ambulance.eta || ambulance.lastMaintenance}</p>
            </div>
          </div>
          <div>
            <Label>Current Location</Label>
            <div className="mt-2 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              Map View Placeholder
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Ambulances = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const filteredAmbulances = ambulanceData.filter(ambulance => {
    const matchesSearch = ambulance.callSign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (ambulance.destination && ambulance.destination.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter ? ambulance.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (ambulanceId: number) => {
    navigate(`/ambulances/${ambulanceId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-medical-dark">Ambulance Fleet Management</h1>
        <AddAmbulanceDialog />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Ambulance Fleet</CardTitle>
              <CardDescription>Manage and monitor all ambulance units</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search ambulances..."
                  className="pl-10 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={20} />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-40"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="responding">Responding</option>
                  <option value="transporting">Transporting</option>
                  <option value="returning">Returning</option>
                  <option value="maintenance">Maintenance</option>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mt-2">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setStatusFilter(null)}>All</TabsTrigger>
              <TabsTrigger value="available" onClick={() => setStatusFilter("available")}>Available</TabsTrigger>
              <TabsTrigger value="responding" onClick={() => setStatusFilter("responding")}>Responding</TabsTrigger>
              <TabsTrigger value="transporting" onClick={() => setStatusFilter("transporting")}>Transporting</TabsTrigger>
              <TabsTrigger value="returning" onClick={() => setStatusFilter("returning")}>Returning</TabsTrigger>
              <TabsTrigger value="maintenance" onClick={() => setStatusFilter("maintenance")}>Maintenance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Call Sign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Crew</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAmbulances.map((ambulance) => (
                    <TableRow key={ambulance.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Ambulance className="h-4 w-4 text-medical-blue" />
                          {ambulance.callSign}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[ambulance.status as keyof typeof statusColors]}>
                          {ambulance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ambulance.type}</TableCell>
                      <TableCell>{ambulance.location}</TableCell>
                      <TableCell>{ambulance.destination || "-"}</TableCell>
                      <TableCell>
                        {ambulance.crew.length > 0 
                          ? ambulance.crew.join(", ") 
                          : <span className="text-gray-500">No crew assigned</span>}
                      </TableCell>
                      <TableCell>{ambulance.eta || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(ambulance.id)}
                          >
                            Details
                          </Button>
                          <Button variant="outline" size="sm">Track</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            {/* Other tabs have the same content structure */}
            <TabsContent value="available" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Call Sign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Crew</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAmbulances
                  .filter(ambulance => ambulance.status === "available")
                  .map((ambulance) => (
                    <TableRow key={ambulance.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Ambulance className="h-4 w-4 text-medical-blue" />
                          {ambulance.callSign}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[ambulance.status as keyof typeof statusColors]}>
                          {ambulance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ambulance.type}</TableCell>
                      <TableCell>{ambulance.location}</TableCell>
                      <TableCell>{ambulance.destination || "-"}</TableCell>
                      <TableCell>
                        {ambulance.crew.length > 0 
                          ? ambulance.crew.join(", ") 
                          : <span className="text-gray-500">No crew assigned</span>}
                      </TableCell>
                      <TableCell>{ambulance.eta || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(ambulance.id)}
                          >
                            Details
                          </Button>
                          <Button variant="outline" size="sm">Track</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="responding" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Call Sign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Crew</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAmbulances
                  .filter(ambulance => ambulance.status === "responding")
                  .map((ambulance) => (
                    <TableRow key={ambulance.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Ambulance className="h-4 w-4 text-medical-blue" />
                          {ambulance.callSign}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[ambulance.status as keyof typeof statusColors]}>
                          {ambulance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ambulance.type}</TableCell>
                      <TableCell>{ambulance.location}</TableCell>
                      <TableCell>{ambulance.destination || "-"}</TableCell>
                      <TableCell>
                        {ambulance.crew.length > 0 
                          ? ambulance.crew.join(", ") 
                          : <span className="text-gray-500">No crew assigned</span>}
                      </TableCell>
                      <TableCell>{ambulance.eta || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(ambulance.id)}
                          >
                            Details
                          </Button>
                          <Button variant="outline" size="sm">Track</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="transporting" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Call Sign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Crew</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAmbulances
                  .filter(ambulance => ambulance.status === "transporting")
                  .map((ambulance) => (
                    <TableRow key={ambulance.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Ambulance className="h-4 w-4 text-medical-blue" />
                          {ambulance.callSign}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[ambulance.status as keyof typeof statusColors]}>
                          {ambulance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ambulance.type}</TableCell>
                      <TableCell>{ambulance.location}</TableCell>
                      <TableCell>{ambulance.destination || "-"}</TableCell>
                      <TableCell>
                        {ambulance.crew.length > 0 
                          ? ambulance.crew.join(", ") 
                          : <span className="text-gray-500">No crew assigned</span>}
                      </TableCell>
                      <TableCell>{ambulance.eta || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(ambulance.id)}
                          >
                            Details
                          </Button>
                          <Button variant="outline" size="sm">Track</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="returning" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Call Sign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Crew</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAmbulances
                  .filter(ambulance => ambulance.status === "returning")
                  .map((ambulance) => (
                    <TableRow key={ambulance.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Ambulance className="h-4 w-4 text-medical-blue" />
                          {ambulance.callSign}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[ambulance.status as keyof typeof statusColors]}>
                          {ambulance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ambulance.type}</TableCell>
                      <TableCell>{ambulance.location}</TableCell>
                      <TableCell>{ambulance.destination || "-"}</TableCell>
                      <TableCell>
                        {ambulance.crew.length > 0 
                          ? ambulance.crew.join(", ") 
                          : <span className="text-gray-500">No crew assigned</span>}
                      </TableCell>
                      <TableCell>{ambulance.eta || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(ambulance.id)}
                          >
                            Details
                          </Button>
                          <Button variant="outline" size="sm">Track</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="maintenance" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Call Sign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Crew</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAmbulances
                  .filter(ambulance => ambulance.status === "maintenance")
                  .map((ambulance) => (
                    <TableRow key={ambulance.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Ambulance className="h-4 w-4 text-medical-blue" />
                          {ambulance.callSign}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[ambulance.status as keyof typeof statusColors]}>
                          {ambulance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ambulance.type}</TableCell>
                      <TableCell>{ambulance.location}</TableCell>
                      <TableCell>{ambulance.destination || "-"}</TableCell>
                      <TableCell>
                        {ambulance.crew.length > 0 
                          ? ambulance.crew.join(", ") 
                          : <span className="text-gray-500">No crew assigned</span>}
                      </TableCell>
                      <TableCell>{ambulance.eta || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(ambulance.id)}
                          >
                            Details
                          </Button>
                          <Button variant="outline" size="sm">Track</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
            <CardDescription>Current operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Units:</span>
                <span className="font-medium">{ambulanceData.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Available:</span>
                <span className="font-medium">{ambulanceData.filter(a => a.status === "available").length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">In Service:</span>
                <span className="font-medium">
                  {ambulanceData.filter(a => ["responding", "transporting", "returning"].includes(a.status)).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Maintenance:</span>
                <span className="font-medium">{ambulanceData.filter(a => a.status === "maintenance").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipment Overview</CardTitle>
            <CardDescription>Fleet capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Advanced Life Support:</span>
                <span className="font-medium">
                  {ambulanceData.filter(a => a.equipment === "Advanced Life Support").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Basic Life Support:</span>
                <span className="font-medium">
                  {ambulanceData.filter(a => a.equipment === "Basic Life Support").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Type I Units:</span>
                <span className="font-medium">
                  {ambulanceData.filter(a => a.type === "Type I").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Type II Units:</span>
                <span className="font-medium">
                  {ambulanceData.filter(a => a.type === "Type II").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Type III Units:</span>
                <span className="font-medium">
                  {ambulanceData.filter(a => a.type === "Type III").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Schedule</CardTitle>
            <CardDescription>Upcoming maintenance requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ambulanceData
                .sort((a, b) => new Date(a.lastMaintenance).getTime() - new Date(b.lastMaintenance).getTime())
                .slice(0, 3)
                .map(ambulance => (
                  <div key={ambulance.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{ambulance.callSign}</p>
                      <p className="text-xs text-gray-500">Last check: {ambulance.lastMaintenance}</p>
                    </div>
                    <Badge className={
                      new Date(ambulance.lastMaintenance) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ? "bg-medical-red"
                        : "bg-yellow-500"
                    }>
                      {new Date(ambulance.lastMaintenance) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ? "Overdue"
                        : "Soon"}
                    </Badge>
                  </div>
                ))
              }
              <Button variant="outline" className="w-full text-xs">View Full Schedule</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Ambulances;
