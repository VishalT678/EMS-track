
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TriangleAlert } from "lucide-react";

// Updated hospital data to use the same structure as in MapView
const hospitals = [
  { 
    name: "Manhattan General Hospital", 
    beds: { total: 50, available: 5 }, 
    trauma: "Level I",
    ambulances: 2,
    status: "High Capacity"
  },
  { 
    name: "Downtown Medical Center", 
    beds: { total: 35, available: 2 }, 
    trauma: "Level II",
    ambulances: 3,
    status: "Critical Capacity"
  },
  { 
    name: "Riverside Hospital", 
    beds: { total: 60, available: 8 }, 
    trauma: "Level I",
    ambulances: 1,
    status: "Normal"
  },
  { 
    name: "Eastside Health", 
    beds: { total: 40, available: 12 }, 
    trauma: "Level III",
    ambulances: 0,
    status: "Normal"
  },
  { 
    name: "Central Emergency", 
    beds: { total: 30, available: 4 }, 
    trauma: "Level II",
    ambulances: 1,
    status: "High Capacity"
  },
];

const HospitalCapacityTable = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Hospital Capacity Status</CardTitle>
        <CardDescription>Current resource availability across network hospitals</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hospital</TableHead>
              <TableHead>Beds Available</TableHead>
              <TableHead>Trauma Level</TableHead>
              <TableHead>Ambulances En Route</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hospitals.map((hospital) => (
              <TableRow key={hospital.name}>
                <TableCell className="font-medium">{hospital.name}</TableCell>
                <TableCell>
                  <span className={hospital.beds.available <= 3 ? "text-medical-red font-medium" : ""}>
                    {hospital.beds.available} / {hospital.beds.total}
                  </span>
                </TableCell>
                <TableCell>{hospital.trauma}</TableCell>
                <TableCell>{hospital.ambulances}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
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
                    {hospital.status === "Critical Capacity" && (
                      <TriangleAlert className="h-4 w-4 text-medical-red" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HospitalCapacityTable;
