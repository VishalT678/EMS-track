import StatCard from "@/components/dashboard/StatCard";
import { Ambulance, Clock, MapPin, Activity, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { ambulanceAPI } from "@/lib/api";
import ResponseTimeChart from "@/components/dashboard/ResponseTimeChart";

interface Emergency {
  id: string;
  type: string;
  location: string;
  time: string;
  status: string;
  priority: string;
  distance: string;
}

const AmbulanceDashboard = () => {
  const [ambulanceData, setAmbulanceData] = useState({
    status: "available",
    totalResponses: 0,
    avgResponseTime: 0,
    currentLocation: { lat: 0, lng: 0 }
  });

  const emergencies: Emergency[] = [
    {
      id: "1",
      type: "Cardiac Emergency",
      location: "123 Main St",
      time: "10:30 AM",
      status: "Pending",
      priority: "High",
      distance: "2.5 km"
    },
    {
      id: "2",
      type: "Traffic Accident",
      location: "456 Park Ave",
      time: "10:45 AM",
      status: "En Route",
      priority: "High",
      distance: "1.8 km"
    },
    {
      id: "3",
      type: "Medical Assistance",
      location: "789 Oak Rd",
      time: "11:00 AM",
      status: "Pending",
      priority: "Medium",
      distance: "3.2 km"
    }
  ];

  useEffect(() => {
    const fetchAmbulanceData = async () => {
      try {
        // Replace with actual API call to get ambulance data
        const response = await ambulanceAPI.getById("your-ambulance-id");
        // Update state with real data
      } catch (error) {
        console.error("Error fetching ambulance data:", error);
      }
    };

    fetchAmbulanceData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-medical-dark">Ambulance Dashboard</h1>
        <Button className="bg-medical-red hover:bg-medical-dark">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Update Status
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Current Status"
          value="Available"
          icon={<Ambulance className="h-4 w-4 text-medical-green" />}
          description="Ready for dispatch"
        />
        <StatCard 
          title="Response Time"
          value="8.5 min"
          icon={<Clock className="h-4 w-4 text-medical-blue" />}
          description="Average today"
        />
        <StatCard 
          title="Total Responses"
          value="12"
          icon={<Activity className="h-4 w-4 text-medical-red" />}
          trend={{ value: 3, isPositive: true }}
        />
        <StatCard 
          title="Distance Covered"
          value="145 km"
          icon={<MapPin className="h-4 w-4 text-yellow-500" />}
          description="Today's total"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nearby Emergencies</CardTitle>
            <CardDescription>Available emergency calls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergencies.map((emergency) => (
                <div key={emergency.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`rounded-full p-2 text-white ${
                    emergency.priority === "High" ? "bg-medical-red" :
                    emergency.priority === "Medium" ? "bg-yellow-500" :
                    "bg-medical-blue"
                  }`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{emergency.type}</p>
                      <Badge className={
                        emergency.status === "Pending" ? "bg-yellow-500" :
                        emergency.status === "En Route" ? "bg-medical-blue" :
                        "bg-medical-green"
                      }>
                        {emergency.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {emergency.location}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{emergency.time}</span>
                      <span>Distance: {emergency.distance}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full text-xs">View All Emergencies</Button>
            </div>
          </CardContent>
        </Card>

        <ResponseTimeChart />
      </div>
    </div>
  );
};

export default AmbulanceDashboard; 