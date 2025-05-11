
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Hospital, 
  Bed, 
  Ambulance as AmbulanceIcon, 
  Heart, 
  Pill, 
  Clock 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mocked hospital data with more details
const hospitalData = [
  { 
    id: 1, 
    name: "Manhattan General Hospital", 
    address: "123 Park Avenue, Manhattan, NY",
    beds: { total: 50, available: 5 }, 
    icu: { total: 15, available: 1 },
    er: { waitTime: 45, capacity: 80 },
    trauma: "Level I",
    specialties: ["Cardiac", "Neurology", "Trauma"],
    ambulancesEnRoute: 2,
    status: "High Capacity"
  },
  { 
    id: 2, 
    name: "Downtown Medical Center", 
    address: "456 Broadway, Manhattan, NY",
    beds: { total: 35, available: 2 }, 
    icu: { total: 10, available: 0 },
    er: { waitTime: 120, capacity: 95 },
    trauma: "Level II",
    specialties: ["Pediatrics", "Surgery"],
    ambulancesEnRoute: 3,
    status: "Critical Capacity"
  },
  { 
    id: 3, 
    name: "Riverside Hospital", 
    address: "789 West Street, Manhattan, NY",
    beds: { total: 60, available: 8 }, 
    icu: { total: 20, available: 3 },
    er: { waitTime: 25, capacity: 60 },
    trauma: "Level I",
    specialties: ["Trauma", "Burns", "Orthopedics"],
    ambulancesEnRoute: 1,
    status: "Normal"
  },
  { 
    id: 4, 
    name: "Eastside Health", 
    address: "321 East Avenue, Manhattan, NY",
    beds: { total: 40, available: 12 }, 
    icu: { total: 12, available: 4 },
    er: { waitTime: 15, capacity: 40 },
    trauma: "Level III",
    specialties: ["Internal Medicine", "Geriatrics"],
    ambulancesEnRoute: 0,
    status: "Normal"
  },
  { 
    id: 5, 
    name: "Central Emergency", 
    address: "555 Central Park West, Manhattan, NY",
    beds: { total: 30, available: 4 }, 
    icu: { total: 8, available: 1 },
    er: { waitTime: 60, capacity: 85 },
    trauma: "Level II",
    specialties: ["Emergency Medicine", "Critical Care"],
    ambulancesEnRoute: 1,
    status: "High Capacity"
  },
  { 
    id: 6, 
    name: "Queens Medical Complex", 
    address: "123 Queens Blvd, Queens, NY",
    beds: { total: 45, available: 7 }, 
    icu: { total: 14, available: 2 },
    er: { waitTime: 30, capacity: 65 },
    trauma: "Level II",
    specialties: ["Cardiology", "Respiratory"],
    ambulancesEnRoute: 1,
    status: "Normal"
  },
  { 
    id: 7, 
    name: "Brooklyn Heights Medical", 
    address: "456 Atlantic Ave, Brooklyn, NY",
    beds: { total: 38, available: 3 }, 
    icu: { total: 11, available: 0 },
    er: { waitTime: 90, capacity: 90 },
    trauma: "Level III",
    specialties: ["General Surgery", "Orthopedics"],
    ambulancesEnRoute: 2,
    status: "High Capacity"
  },
  { 
    id: 8, 
    name: "Bronx Trauma Center", 
    address: "789 Grand Concourse, Bronx, NY",
    beds: { total: 55, available: 9 }, 
    icu: { total: 18, available: 3 },
    er: { waitTime: 35, capacity: 70 },
    trauma: "Level I",
    specialties: ["Trauma", "Emergency Medicine", "Neurosurgery"],
    ambulancesEnRoute: 2,
    status: "Normal"
  }
];

const Hospitals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const filteredHospitals = hospitalData.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hospital.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? hospital.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-medical-dark">Hospital Network</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            Resource Exchange
          </Button>
          <Button className="bg-medical-blue hover:bg-medical-dark">
            Request Capacity Update
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Hospitals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Hospital className="h-5 w-5 text-medical-blue mr-2" />
              <span className="text-2xl font-bold">{hospitalData.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Available Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Bed className="h-5 w-5 text-medical-blue mr-2" />
              <span className="text-2xl font-bold">
                {hospitalData.reduce((total, hospital) => total + hospital.beds.available, 0)}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                of {hospitalData.reduce((total, hospital) => total + hospital.beds.total, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Available ICU</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-medical-red mr-2" />
              <span className="text-2xl font-bold">
                {hospitalData.reduce((total, hospital) => total + hospital.icu.available, 0)}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                of {hospitalData.reduce((total, hospital) => total + hospital.icu.total, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Ambulances En Route</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AmbulanceIcon className="h-5 w-5 text-medical-red mr-2" />
              <span className="text-2xl font-bold">
                {hospitalData.reduce((total, hospital) => total + hospital.ambulancesEnRoute, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Hospital Network Status</CardTitle>
              <CardDescription>Real-time capacity and resource availability</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search hospitals..."
                  className="pl-10 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-x-2 mb-4">
            <Button 
              variant={statusFilter === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter(null)}
              className={statusFilter === null ? "bg-medical-blue" : ""}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === "Normal" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("Normal")}
              className={statusFilter === "Normal" ? "bg-green-500" : ""}
            >
              Normal Capacity
            </Button>
            <Button 
              variant={statusFilter === "High Capacity" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("High Capacity")}
              className={statusFilter === "High Capacity" ? "bg-yellow-500" : ""}
            >
              High Capacity
            </Button>
            <Button 
              variant={statusFilter === "Critical Capacity" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("Critical Capacity")}
              className={statusFilter === "Critical Capacity" ? "bg-medical-red" : ""}
            >
              Critical Capacity
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <div className="flex items-center">
                    Hospital
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Beds
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>ICU</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    ER Wait
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Trauma Level</TableHead>
                <TableHead>Specialties</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHospitals.map((hospital) => (
                <TableRow key={hospital.id}>
                  <TableCell className="font-medium">
                    <div>
                      {hospital.name}
                      <p className="text-xs text-gray-500">{hospital.address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{hospital.beds.available}</span>
                        <span className="text-gray-500">of {hospital.beds.total}</span>
                      </div>
                      <Progress 
                        value={hospital.beds.available / hospital.beds.total * 100} 
                        className="h-2"
                        indicatorClassName={
                          hospital.beds.available <= 3 
                            ? "bg-medical-red" 
                            : hospital.beds.available <= 5 
                              ? "bg-yellow-500" 
                              : "bg-green-500"
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{hospital.icu.available}</span>
                        <span className="text-gray-500">of {hospital.icu.total}</span>
                      </div>
                      <Progress 
                        value={hospital.icu.available / hospital.icu.total * 100} 
                        className="h-2"
                        indicatorClassName={
                          hospital.icu.available === 0 
                            ? "bg-medical-red" 
                            : hospital.icu.available <= 2 
                              ? "bg-yellow-500" 
                              : "bg-green-500"
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className={
                        hospital.er.waitTime >= 60 
                          ? "text-medical-red font-medium" 
                          : hospital.er.waitTime >= 30 
                            ? "text-yellow-500" 
                            : ""
                      }>
                        {hospital.er.waitTime} min
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {hospital.er.capacity}% capacity
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      hospital.trauma === "Level I" 
                        ? "bg-medical-red" 
                        : hospital.trauma === "Level II" 
                          ? "bg-yellow-500" 
                          : "bg-blue-500"
                    }>
                      {hospital.trauma}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {hospital.specialties.slice(0, 2).map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {hospital.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{hospital.specialties.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        hospital.status === "Critical Capacity"
                          ? "bg-medical-red"
                          : hospital.status === "High Capacity"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }
                    >
                      {hospital.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Details</Button>
                      <Button variant="outline" size="sm">Contact</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Specialty Distribution</CardTitle>
            <CardDescription>Available medical specialties across network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Trauma", "Cardiac", "Neurology", "Orthopedics", "Emergency Medicine"].map((specialty) => (
                <div key={specialty} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Pill className="h-4 w-4 mr-2 text-medical-blue" />
                    <span>{specialty}</span>
                  </div>
                  <div>
                    <Badge variant="outline">
                      {hospitalData.filter(h => h.specialties.includes(specialty)).length} hospitals
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critical Alerts</CardTitle>
            <CardDescription>Immediate attention required</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hospitalData
                .filter(h => h.status === "Critical Capacity" || h.beds.available <= 2 || h.icu.available === 0)
                .map(hospital => (
                  <div key={hospital.id} className="p-3 bg-red-50 border border-medical-red rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{hospital.name}</p>
                        <p className="text-xs text-gray-500">{hospital.address}</p>
                      </div>
                      <Badge className="bg-medical-red">Critical</Badge>
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                      {hospital.beds.available <= 2 && (
                        <p className="text-medical-red">
                          Critical bed capacity: {hospital.beds.available}/{hospital.beds.total}
                        </p>
                      )}
                      {hospital.icu.available === 0 && (
                        <p className="text-medical-red">
                          ICU at capacity: {hospital.icu.available}/{hospital.icu.total}
                        </p>
                      )}
                      {hospital.er.capacity >= 90 && (
                        <p className="text-medical-red">
                          ER at {hospital.er.capacity}% capacity
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex justify-end gap-2">
                      <Button variant="outline" size="sm">Contact</Button>
                      <Button className="bg-medical-red hover:bg-medical-red/80" size="sm">Divert</Button>
                    </div>
                  </div>
                ))}
              {hospitalData.filter(h => h.status === "Critical Capacity" || h.beds.available <= 2 || h.icu.available === 0).length === 0 && (
                <div className="p-4 text-center text-green-600">
                  <p>No critical alerts at this time</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Hospitals;
