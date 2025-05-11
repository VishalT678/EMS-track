import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Wrench, Users, Clock, Activity } from "lucide-react";

interface AmbulanceDetails {
  id: string;
  registrationNumber: string;
  vehicleModel: string;
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  lastMaintenance: string;
  nextMaintenance: string;
  crew: {
    driver: string;
    paramedic: string;
  };
}

const statusColors = {
  responding: "bg-medical-red text-white",
  available: "bg-green-500 text-white",
  transporting: "bg-yellow-500 text-white",
  returning: "bg-blue-500 text-white",
  maintenance: "bg-gray-500 text-white",
};

const AmbulanceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ambulance, setAmbulance] = useState<AmbulanceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAmbulanceDetails = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(`/api/ambulances/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch ambulance details');
        }
        const data = await response.json();
        setAmbulance(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAmbulanceDetails();
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!ambulance) {
    return <div className="p-4">Ambulance not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/ambulances")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ambulances
        </Button>
        <h1 className="text-2xl font-bold">Ambulance Details - {ambulance.registrationNumber}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>Real-time information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge className={statusColors[ambulance.status as keyof typeof statusColors]}>
                {ambulance.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Location:</span>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{`${ambulance.currentLocation.latitude}, ${ambulance.currentLocation.longitude}`}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>Technical specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Registration Number:</span>
              <span>{ambulance.registrationNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Vehicle Model:</span>
              <span>{ambulance.vehicleModel}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crew Information</CardTitle>
            <CardDescription>Current crew assignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Driver:</span>
              <span>{ambulance.crew.driver}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Paramedic:</span>
              <span>{ambulance.crew.paramedic}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance</CardTitle>
            <CardDescription>Service information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Maintenance:</span>
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-gray-500" />
                <span>{ambulance.lastMaintenance}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Next Maintenance:</span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{ambulance.nextMaintenance}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Location Tracking</CardTitle>
            <CardDescription>Real-time map view</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
              Map View Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AmbulanceDetails; 