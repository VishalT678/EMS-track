import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AIPredictionCard from "../ai/AIPredictionCard";
import { Brain, Clock, Hospital, Route, Timer, Activity } from "lucide-react";

const SidebarPanels = ({
  aiPredictions,
  selectedAmbulance,
  ambulances,
  selectedIncident,
  incidents,
  selectedHospital,
  hospitals,
  getStatusColor,
  getSeverityColor,
  setSelectedIncident,
  setSelectedAmbulance,
  setSelectedHospital
}: any) => {
  return (
    <div className="space-y-6">
      {/* AI Prediction Cards */}
      {selectedAmbulance && aiPredictions.arrivalTime && (
        <div className="space-y-4">
          <AIPredictionCard
            title="AI-Estimated Arrival Time"
            prediction={`${Math.round(aiPredictions.arrivalTime)} mins`}
            confidence={aiPredictions.routeConfidence || 0}
            icon={<Clock className="h-4 w-4 text-primary" />}
          />
          <AIPredictionCard
            title="Optimal Route"
            prediction={aiPredictions.suggestedRoute || "Calculating..."}
            confidence={aiPredictions.routeConfidence || 0}
            icon={<Route className="h-4 w-4 text-primary" />}
          />
        </div>
      )}

      {selectedIncident && aiPredictions.severityAssessment && (
        <div className="space-y-4">
          <AIPredictionCard
            title="Emergency Severity"
            prediction={aiPredictions.severityAssessment.level}
            confidence={aiPredictions.severityAssessment.score / 100}
            icon={<Activity className="h-4 w-4 text-primary" />}
          />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recommended Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {aiPredictions.severityAssessment.recommendedResources.map((resource: string, index: number) => (
                  <Badge 
                    key={index} 
                    className={`mr-1 ${
                      aiPredictions.severityAssessment?.level === 'Critical' 
                        ? 'bg-medical-red' 
                        : aiPredictions.severityAssessment?.level === 'Severe' 
                          ? 'bg-orange-500' 
                          : 'bg-blue-500'
                    }`}
                  >
                    {resource}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedHospital && aiPredictions.hospitalBedPredictions && (
        <div className="space-y-4">
          {aiPredictions.hospitalBedPredictions
            .filter((pred: any) => pred.hospitalId === selectedHospital)
            .map((prediction: any) => (
              <div key={prediction.hospitalId} className="space-y-4">
                <AIPredictionCard
                  title="Beds Available in 1 Hour"
                  prediction={prediction.predictedAvailableIn1Hour.toString()}
                  confidence={prediction.confidence}
                  icon={<Timer className="h-4 w-4 text-primary" />}
                />
                <AIPredictionCard
                  title="Beds Available in 3 Hours"
                  prediction={prediction.predictedAvailableIn3Hours.toString()}
                  confidence={prediction.confidence}
                  icon={<Hospital className="h-4 w-4 text-primary" />}
                />
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Capacity Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Hourly Discharge Rate:</span>
                        <span>{prediction.dischargeRate} patients</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hourly Admission Rate:</span>
                        <span>{prediction.admissionRate} patients</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
        </div>
      )}

      {/* TABS */}
      <Tabs defaultValue="incidents">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="ambulances">Ambulances</TabsTrigger>
          <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="incidents" className="space-y-4 pt-4">
          {incidents.map((incident: any) => (
            <Card 
              key={incident.id} 
              className={`overflow-hidden ${selectedIncident === incident.id ? 'border-2 border-primary' : ''}`}
              onClick={() => setSelectedIncident(incident.id)}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-sm font-medium">{incident.type}</CardTitle>
                    <CardDescription className="text-xs">{incident.location}</CardDescription>
                  </div>
                  <Badge 
                    className={incident.severity === "Critical" 
                      ? "bg-medical-red" 
                      : incident.severity === "Severe" 
                        ? "bg-orange-500" 
                        : "bg-yellow-500"}
                  >
                    {incident.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{incident.time}</span>
                  <span>{incident.ambulance ? `Assigned: ${incident.ambulance}` : "Unassigned"}</span>
                </div>
                {selectedIncident === incident.id && aiPredictions.severityAssessment && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center">
                        <Brain className="h-3 w-3 mr-1 text-primary" />
                        AI Assessment:
                      </span>
                      <Badge className={getSeverityColor(aiPredictions.severityAssessment.level)}>
                        {aiPredictions.severityAssessment.level}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          <Button className="w-full text-xs" variant="outline">View All Incidents</Button>
        </TabsContent>
        
        <TabsContent value="ambulances" className="space-y-4 pt-4">
          {ambulances.map((ambulance: any) => (
            <Card 
              key={ambulance.id} 
              className={`overflow-hidden ${selectedAmbulance === ambulance.id ? 'border-2 border-primary' : ''}`}
              onClick={() => setSelectedAmbulance(ambulance.id)}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">{ambulance.callSign}</CardTitle>
                  <Badge className={getStatusColor(ambulance.status)}>
                    {ambulance.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xs space-y-1">
                  {ambulance.destination && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Destination:</span>
                      <span>{ambulance.destination}</span>
                    </div>
                  )}
                  {ambulance.eta && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">ETA:</span>
                      <span>{ambulance.eta}</span>
                    </div>
                  )}
                  {selectedAmbulance === ambulance.id && aiPredictions.arrivalTime && (
                    <div className="flex justify-between text-xs pt-1 mt-1 border-t border-gray-100">
                      <span className="flex items-center">
                        <Brain className="h-3 w-3 mr-1 text-primary" />
                        AI ETA:
                      </span>
                      <span className="font-medium">{Math.round(aiPredictions.arrivalTime)} mins</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          <Button className="w-full text-xs" variant="outline">View All Ambulances</Button>
        </TabsContent>
        
        <TabsContent value="hospitals" className="space-y-4 pt-4">
          {hospitals.map((hospital: any) => (
            <Card 
              key={hospital.id} 
              className={`overflow-hidden ${selectedHospital === hospital.id ? 'border-2 border-primary' : ''}`}
              onClick={() => setSelectedHospital(hospital.id)}
            >
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">{hospital.name}</CardTitle>
                <CardDescription className="text-xs">{hospital.trauma} Trauma Center</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Available Beds:</span>
                  <Badge className={hospital.beds.available <= 2 ? "bg-medical-red" : "bg-green-500"}>
                    {hospital.beds.available}
                  </Badge>
                </div>
                {selectedHospital === hospital.id && aiPredictions.hospitalBedPredictions && (
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs">
                    {aiPredictions.hospitalBedPredictions
                      .filter((pred: any) => pred.hospitalId === hospital.id)
                      .map((prediction: any) => (
                        <div key={prediction.hospitalId} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="flex items-center">
                              <Brain className="h-3 w-3 mr-1 text-primary" />
                              Predicted in 1h:
                            </span>
                            <Badge className={prediction.predictedAvailableIn1Hour <= 2 ? "bg-medical-red" : "bg-green-500"}>
                              {prediction.predictedAvailableIn1Hour}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="flex items-center">
                              <Brain className="h-3 w-3 mr-1 text-primary" />
                              Predicted in 3h:
                            </span>
                            <Badge className={prediction.predictedAvailableIn3Hours <= 2 ? "bg-medical-red" : "bg-green-500"}>
                              {prediction.predictedAvailableIn3Hours}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          <Button className="w-full text-xs" variant="outline">View All Hospitals</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default SidebarPanels;
