import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HospitalDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-sm text-gray-500">Out of 50 total beds</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Emergency Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-sm text-gray-500">Patients en route</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Staff on Duty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-gray-500">Emergency staff available</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incoming Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 1, condition: "Cardiac Arrest", eta: "5 mins", ambulance: "AMB-001" },
              { id: 2, condition: "Traffic Accident", eta: "10 mins", ambulance: "AMB-003" },
            ].map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{patient.condition}</h3>
                  <p className="text-sm text-gray-500">Ambulance: {patient.ambulance}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge>ETA: {patient.eta}</Badge>
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AmbulanceDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500">Available</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today's Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-gray-500">Emergency calls attended</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.5</div>
            <p className="text-sm text-gray-500">Minutes per call</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Emergency Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 1, type: "Cardiac Emergency", location: "123 Main St", time: "10 mins ago", status: "Completed" },
              { id: 2, type: "Traffic Accident", location: "456 Park Ave", time: "30 mins ago", status: "Completed" },
              { id: 3, type: "Medical Emergency", location: "789 Oak Rd", time: "1 hour ago", status: "Completed" },
            ].map((call) => (
              <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{call.type}</h3>
                  <p className="text-sm text-gray-500">{call.location}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{call.time}</span>
                  <Badge variant={call.status === "Completed" ? "secondary" : "default"}>
                    {call.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {user.role === 'hospital' && <HospitalDashboard />}
        {user.role === 'ambulance' && <AmbulanceDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;
