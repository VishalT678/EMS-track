import { useEffect, useRef, useState } from "react";
import { Ambulance, Hospital, AlertTriangle, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIPredictionCard from "../ai/AIPredictionCard";
import { 
  predictArrivalTime, 
  analyzeMedicalEmergency, 
  assessEmergencySeverity,
  predictHospitalBedAvailability,
  EmergencySeverity,
  TrafficData,
  HospitalBedPrediction
} from "@/utils/ai/predictionService";
import { Clock, Route, Activity, AlertCircle, Timer } from "lucide-react";
import MapPlaceholder from "./MapPlaceholder";
import SidebarPanels from "./SidebarPanels";

const ambulances = [
  { id: 1, callSign: "Alpha-1", status: "responding", location: { lat: 40.712, lng: -74.006 }, destination: "Manhattan General Hospital", eta: "4 mins" },
  { id: 2, callSign: "Bravo-2", status: "available", location: { lat: 40.715, lng: -74.012 }, destination: null, eta: null },
  { id: 3, callSign: "Charlie-3", status: "transporting", location: { lat: 40.708, lng: -74.003 }, destination: "Downtown Medical Center", eta: "8 mins" },
  { id: 4, callSign: "Delta-4", status: "returning", location: { lat: 40.720, lng: -74.010 }, destination: "Station 3", eta: "12 mins" },
];

const hospitals = [
  { 
    id: 1, 
    name: "Manhattan General Hospital", 
    beds: { total: 50, available: 5 }, 
    trauma: "Level I", 
    location: { lat: 40.710, lng: -74.008 }, 
    er: { waitTime: 45, capacity: 80 }, 
    ambulancesEnRoute: 2 
  },
  { 
    id: 2, 
    name: "Downtown Medical Center", 
    beds: { total: 35, available: 2 }, 
    trauma: "Level II", 
    location: { lat: 40.705, lng: -74.002 }, 
    er: { waitTime: 120, capacity: 95 }, 
    ambulancesEnRoute: 3 
  },
  { 
    id: 3, 
    name: "Riverside Hospital", 
    beds: { total: 60, available: 8 }, 
    trauma: "Level I", 
    location: { lat: 40.725, lng: -74.015 }, 
    er: { waitTime: 25, capacity: 60 }, 
    ambulancesEnRoute: 1 
  },
];

const incidents = [
  { 
    id: 1, 
    type: "Cardiac", 
    location: "355 Park Ave", 
    severity: "Critical", 
    time: "10:42 AM", 
    ambulance: "Alpha-1",
    symptoms: ["chest pain", "shortness of breath", "sweating"],
    vitalSigns: { heartRate: 130, bloodPressure: { systolic: 190, diastolic: 100 }, oxygenSaturation: 88 }
  },
  { 
    id: 2, 
    type: "Traffic Accident", 
    location: "Broadway & 42nd", 
    severity: "Severe", 
    time: "10:30 AM", 
    ambulance: "Charlie-3",
    symptoms: ["head trauma", "bleeding", "unconscious"],
    vitalSigns: { heartRate: 110, bloodPressure: { systolic: 80, diastolic: 60 }, oxygenSaturation: 92 }
  },
  { 
    id: 3, 
    type: "Fall", 
    location: "223 W 43rd St", 
    severity: "Moderate", 
    time: "10:15 AM", 
    ambulance: null,
    symptoms: ["pain in hip", "bruising", "unable to stand"],
    vitalSigns: { heartRate: 90, bloodPressure: { systolic: 140, diastolic: 85 }, oxygenSaturation: 96 }
  },
];

const statusColors = {
  responding: "bg-medical-red text-white",
  available: "bg-green-500 text-white",
  transporting: "bg-yellow-500 text-white",
  returning: "bg-blue-500 text-white",
};

const MapView = ({
  trafficData = { congestionLevel: 0.3, roadClosures: [], accidents: [] },
  showTrafficOverlay = false
}: any) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedAmbulance, setSelectedAmbulance] = useState<number | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<number | null>(null);
  const [ambulancePositions, setAmbulancePositions] = useState(ambulances);
  const [aiPredictions, setAiPredictions] = useState<{
    arrivalTime?: number;
    suggestedRoute?: string;
    routeConfidence?: number;
    severityAssessment?: EmergencySeverity;
    hospitalBedPredictions?: HospitalBedPrediction[];
  }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulancePositions(prev => 
        prev.map(amb => ({
          ...amb,
          location: {
            lat: amb.location.lat + (Math.random() - 0.5) * 0.001,
            lng: amb.location.lng + (Math.random() - 0.5) * 0.001,
          }
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const bedPredictions = predictHospitalBedAvailability(hospitals);
    setAiPredictions(prev => ({
      ...prev,
      hospitalBedPredictions: bedPredictions
    }));
  }, []);

  useEffect(() => {
    if (selectedAmbulance) {
      const ambulance = ambulances.find(a => a.id === selectedAmbulance);
      if (ambulance?.destination) {
        const updatePredictions = async () => {
          try {
            const prediction = await predictArrivalTime(
              ambulance.location,
              { lat: 40.71, lng: -74.01 }, // Mock hospital location
              trafficData
            );
            setAiPredictions(prev => ({
              ...prev,
              arrivalTime: prediction.estimatedArrivalTime,
              suggestedRoute: prediction.suggestedRoute,
              routeConfidence: prediction.confidence
            }));
          } catch (error) {
            console.error('Error updating predictions:', error);
          }
        };
        updatePredictions();
      }
    }
  }, [selectedAmbulance, trafficData]);

  useEffect(() => {
    if (selectedIncident) {
      const incident = incidents.find(i => i.id === selectedIncident);
      if (incident) {
        const updateSeverityPrediction = async () => {
          try {
            const severityAssessment = await assessEmergencySeverity(
              incident.symptoms,
              incident.vitalSigns
            );
            setAiPredictions(prev => ({
              ...prev,
              severityAssessment
            }));
          } catch (error) {
            console.error('Error updating severity prediction:', error);
          }
        };
        updateSeverityPrediction();
      }
    }
  }, [selectedIncident]);

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || "bg-gray-500 text-white";
  };

  const getSeverityColor = (level: string) => {
    switch(level) {
      case 'Critical': return 'bg-medical-red';
      case 'Severe': return 'bg-orange-500';
      case 'Moderate': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-medical-dark">Real-Time Operation Map</h2>
        <div className="flex space-x-2">
          <Button 
            variant={showTrafficOverlay ? "default" : "outline"} 
            size="sm" 
            className={showTrafficOverlay ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          >
            Traffic Level: {Math.round(trafficData.congestionLevel * 100)}%
          </Button>
          <Button variant="outline" size="sm">
            Hospital Capacity
          </Button>
          <Button variant="default" size="sm" className="bg-medical-blue hover:bg-medical-dark">
            Dispatch Ambulance
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <MapPlaceholder
            ambulancePositions={ambulancePositions}
            hospitals={hospitals}
            incidents={incidents}
            showTrafficOverlay={showTrafficOverlay}
            trafficData={trafficData}
            selectedAmbulance={selectedAmbulance}
            setSelectedAmbulance={setSelectedAmbulance}
            selectedIncident={selectedIncident}
            setSelectedIncident={setSelectedIncident}
            selectedHospital={selectedHospital}
            setSelectedHospital={setSelectedHospital}
            getStatusColor={getStatusColor}
            getSeverityColor={getSeverityColor}
          />
        </div>
        <div>
          <SidebarPanels
            aiPredictions={aiPredictions}
            selectedAmbulance={selectedAmbulance}
            ambulances={ambulances}
            selectedIncident={selectedIncident}
            incidents={incidents}
            selectedHospital={selectedHospital}
            hospitals={hospitals}
            getStatusColor={getStatusColor}
            getSeverityColor={getSeverityColor}
            setSelectedIncident={setSelectedIncident}
            setSelectedAmbulance={setSelectedAmbulance}
            setSelectedHospital={setSelectedHospital}
          />
        </div>
      </div>
    </div>
  );
};

export default MapView;
