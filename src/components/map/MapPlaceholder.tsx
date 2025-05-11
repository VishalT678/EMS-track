
import { Ambulance, Hospital, AlertTriangle } from "lucide-react";
import React from "react";

interface AmbulanceType {
  id: number;
  callSign: string;
  status: string;
  location: { lat: number; lng: number };
  destination: string | null;
  eta: string | null;
}

interface HospitalType {
  id: number;
  name: string;
  beds: { total: number; available: number };
  trauma: string;
  location: { lat: number; lng: number };
  er: { waitTime: number; capacity: number };
  ambulancesEnRoute: number;
}

interface IncidentType {
  id: number;
  type: string;
  location: string;
  severity: string;
  time: string;
  ambulance: string | null;
  symptoms: string[];
  vitalSigns: any;
}

interface TrafficData {
  congestionLevel: number;
  roadClosures: string[];
  accidents: { location: string; severity: number }[];
}

interface MapPlaceholderProps {
  className?: string;
  ambulancePositions: AmbulanceType[];
  hospitals: HospitalType[];
  incidents: IncidentType[];
  showTrafficOverlay: boolean;
  trafficData: TrafficData;
  selectedAmbulance: number | null;
  setSelectedAmbulance: (id: number | null) => void;
  selectedIncident: number | null;
  setSelectedIncident: (id: number | null) => void;
  selectedHospital: number | null;
  setSelectedHospital: (id: number | null) => void;
  getStatusColor: (status: string) => string;
  getSeverityColor: (level: string) => string;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  className,
  ambulancePositions,
  hospitals,
  incidents,
  showTrafficOverlay,
  trafficData,
  selectedAmbulance,
  setSelectedAmbulance,
  selectedIncident,
  setSelectedIncident,
  selectedHospital,
  setSelectedHospital,
  getStatusColor,
  getSeverityColor
}) => {
  return (
    <div className={`relative w-full h-[600px] bg-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-10 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.712,-74.006&zoom=13&size=800x600&maptype=roadmap&style=feature:road|color:0x333333&style=feature:water|color:0x66ccff&key=YOUR_API_KEY')]"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Interactive map would be implemented with Google Maps or Mapbox API</p>
      </div>
      
      {showTrafficOverlay && (
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-yellow-500/10 opacity-70"
            style={{ opacity: trafficData.congestionLevel * 0.7 }}
          ></div>
          {trafficData.roadClosures.map((closure, index) => (
            <div 
              key={index}
              className="absolute bg-red-500 rounded-full w-6 h-6 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 border-2 border-white"
              style={{ 
                left: `${30 + (index * 10)}%`, 
                top: `${40 + (index * 5)}%` 
              }}
            >
              <span className="text-white text-xs">X</span>
            </div>
          ))}
          {trafficData.accidents.map((accident, index) => (
            <div 
              key={index}
              className="absolute bg-orange-500 rounded-full w-5 h-5 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 border border-white animate-pulse"
              style={{ 
                left: `${60 - (index * 8)}%`, 
                top: `${50 + (index * 7)}%`,
                width: `${16 + (accident.severity * 4)}px`,
                height: `${16 + (accident.severity * 4)}px`
              }}
            >
              <span className="text-white text-[10px]">!</span>
            </div>
          ))}
        </div>
      )}

      {ambulancePositions.map(amb => (
        <div 
          key={amb.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out cursor-pointer ${selectedAmbulance === amb.id ? 'z-10' : 'z-0'}`}
          style={{ 
            left: `${(amb.location.lng + 74.02) * 20000}%`, 
            top: `${(40.73 - amb.location.lat) * 20000}%` 
          }}
          onClick={() => setSelectedAmbulance(amb.id)}
        >
          <div className={`rounded-full p-1 ${getStatusColor(amb.status)}`}>
            <Ambulance size={selectedAmbulance === amb.id ? 28 : 20} />
          </div>
          {selectedAmbulance === amb.id && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white p-2 rounded shadow-lg text-xs min-w-[120px]">
              <p className="font-bold">{amb.callSign}</p>
              <p>{amb.status}</p>
              {amb.destination && <p>To: {amb.destination}</p>}
              {amb.eta && <p>ETA: {amb.eta}</p>}
            </div>
          )}
        </div>
      ))}

      {hospitals.map(hospital => (
        <div 
          key={hospital.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ 
            left: `${(hospital.location.lng + 74.02) * 20000}%`, 
            top: `${(40.73 - hospital.location.lat) * 20000}%` 
          }}
          onClick={() => setSelectedHospital(hospital.id)}
        >
          <div className="bg-medical-blue rounded-full p-1">
            <Hospital size={20} className="text-white" />
          </div>
          {selectedHospital === hospital.id && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white p-2 rounded shadow-lg text-xs min-w-[120px]">
              <p className="font-bold">{hospital.name}</p>
              <p>Beds: {hospital.beds.available} available</p>
              <p>Trauma: {hospital.trauma}</p>
              <p>ER Wait: {hospital.er.waitTime} mins</p>
            </div>
          )}
        </div>
      ))}

      {incidents.map(incident => (
        <div 
          key={incident.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer animate-pulse-emergency"
          style={{ 
            left: `${50 + (Math.random() - 0.5) * 40}%`, 
            top: `${50 + (Math.random() - 0.5) * 40}%` 
          }}
          onClick={() => setSelectedIncident(incident.id)}
        >
          <div className={`${
            incident.severity === "Critical"
              ? "bg-medical-red" 
              : incident.severity === "Severe"
                ? "bg-orange-500" 
                : "bg-yellow-500"
          } rounded-full p-1`}>
            <AlertTriangle size={24} className="text-white" />
          </div>
          {selectedIncident === incident.id && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white p-2 rounded shadow-lg text-xs min-w-[150px]">
              <p className="font-bold">{incident.type}</p>
              <p>Location: {incident.location}</p>
              <p>Severity: {incident.severity}</p>
              <p>Time: {incident.time}</p>
              {incident.ambulance ? <p>Unit: {incident.ambulance}</p> : <p>Unassigned</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MapPlaceholder;

