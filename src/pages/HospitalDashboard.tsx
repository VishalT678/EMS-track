import StatCard from "@/components/dashboard/StatCard";
import { Hospital, BedDouble, Users, Clock, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { hospitalAPI } from "@/lib/api";

interface Patient {
  id: string;
  name: string;
  condition: string;
  admissionTime: string;
  status: string;
  department: string;
}

const HospitalDashboard = () => {
  const [hospitalData, setHospitalData] = useState({
    totalBeds: 0,
    availableBeds: 0,
    occupancyRate: 0,
    emergencyWaitTime: 0
  });

  const recentPatients: Patient[] = [
    {
      id: "1",
      name: "John Doe",
      condition: "Cardiac Emergency",
      admissionTime: "10:30 AM",
      status: "Critical",
      department: "ICU"
    },
    {
      id: "2",
      name: "Jane Smith",
      condition: "Trauma",
      admissionTime: "11:15 AM",
      status: "Stable",
      department: "Emergency"
    },
    {
      id: "3",
      name: "Mike Johnson",
      condition: "Respiratory Issues",
      admissionTime: "11:45 AM",
      status: "Under Observation",
      department: "Pulmonology"
    }
  ];

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        // Replace with actual API call to get hospital data
        const response = await hospitalAPI.getById("your-hospital-id");
        // Update state with real data
      } catch (error) {
        console.error("Error fetching hospital data:", error);
      }
    };

    fetchHospitalData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-medical-dark">Hospital Dashboard</h1>
        <Button className="bg-medical-blue hover:bg-medical-dark">
          Update Bed Availability
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Beds"
          value="200"
          icon={<BedDouble className="h-4 w-4 text-medical-blue" />}
          description="Facility capacity"
        />
        <StatCard 
          title="Available Beds"
          value="45"
          icon={<Hospital className="h-4 w-4 text-medical-green" />}
          description="Ready for admission"
        />
        <StatCard 
          title="Current Patients"
          value="155"
          icon={<Users className="h-4 w-4 text-medical-red" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="Avg. Wait Time"
          value="25 min"
          icon={<Clock className="h-4 w-4 text-yellow-500" />}
          description="Emergency department"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Admissions</CardTitle>
            <CardDescription>Latest patient entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`rounded-full p-2 text-white ${
                    patient.status === "Critical" ? "bg-medical-red" :
                    patient.status === "Stable" ? "bg-medical-green" :
                    "bg-yellow-500"
                  }`}>
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{patient.name}</p>
                      <Badge className={
                        patient.status === "Critical" ? "bg-medical-red" :
                        patient.status === "Stable" ? "bg-medical-green" :
                        "bg-yellow-500"
                      }>
                        {patient.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      {patient.condition}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{patient.admissionTime}</span>
                      <span>Dept: {patient.department}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full text-xs">View All Patients</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Status</CardTitle>
            <CardDescription>Current department capacities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Emergency", capacity: "85%", available: 3 },
                { name: "ICU", capacity: "90%", available: 2 },
                { name: "General Ward", capacity: "60%", available: 20 },
                { name: "Pediatrics", capacity: "45%", available: 15 }
              ].map((dept) => (
                <div key={dept.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{dept.name}</p>
                    <p className="text-sm text-gray-500">{dept.available} beds available</p>
                  </div>
                  <div className="w-24">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          parseInt(dept.capacity) > 80 ? "bg-medical-red" :
                          parseInt(dept.capacity) > 60 ? "bg-yellow-500" :
                          "bg-medical-green"
                        }`}
                        style={{ width: dept.capacity }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-right mt-1">{dept.capacity}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalDashboard; 