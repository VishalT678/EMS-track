
import MapView from "@/components/map/MapView";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrafficData } from "@/utils/ai/predictionService";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Map = () => {
  const [trafficData, setTrafficData] = useState<TrafficData>({
    congestionLevel: 0.4,
    roadClosures: ["Broadway & 7th", "Park Ave & 42nd"],
    accidents: [
      { location: "34th & 5th", severity: 2 },
      { location: "Canal St & Broadway", severity: 1 }
    ]
  });

  const [showTrafficOverlay, setShowTrafficOverlay] = useState(false);
  const isMobile = useIsMobile();

  const toggleTrafficOverlay = () => {
    setShowTrafficOverlay(!showTrafficOverlay);
  };

  const TrafficControls = () => (
    <Card className="border border-gray-200 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Traffic Analysis Controls</CardTitle>
        <CardDescription className="text-xs">Configure real-time traffic data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button 
          variant={showTrafficOverlay ? "default" : "outline"} 
          size="sm" 
          className="w-full"
          onClick={toggleTrafficOverlay}
        >
          {showTrafficOverlay ? "Hide Traffic Overlay" : "Show Traffic Overlay"}
        </Button>
        
        <Tabs defaultValue="congestion">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="congestion">Congestion</TabsTrigger>
            <TabsTrigger value="closures">Closures</TabsTrigger>
            <TabsTrigger value="accidents">Accidents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="congestion" className="pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Congestion Level:</span>
                <span>{Math.round(trafficData.congestionLevel * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={trafficData.congestionLevel}
                onChange={(e) => setTrafficData({...trafficData, congestionLevel: parseFloat(e.target.value)})}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Adjusting congestion affects arrival time predictions
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="closures" className="pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Road Closures:</span>
                <span>{trafficData.roadClosures.length}</span>
              </div>
              <div className="max-h-32 overflow-y-auto">
                {trafficData.roadClosures.map((closure, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-xs">{closure}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2"
                      onClick={() => setTrafficData({
                        ...trafficData, 
                        roadClosures: trafficData.roadClosures.filter((_, i) => i !== index)
                      })}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="accidents" className="pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Accidents:</span>
                <span>{trafficData.accidents.length}</span>
              </div>
              <div className="max-h-32 overflow-y-auto">
                {trafficData.accidents.map((accident, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-xs">{accident.location} (Severity: {accident.severity})</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2"
                      onClick={() => setTrafficData({
                        ...trafficData, 
                        accidents: trafficData.accidents.filter((_, i) => i !== index)
                      })}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  return (
    <div className="relative h-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Traffic controls for both desktop and mobile - fixed on the left */}
        <div className="md:col-span-1">
          <div className="space-y-4">
            <TrafficControls />
            
            {/* Additional information or controls can be placed here below the traffic controls */}
            <Card className="border border-gray-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Map Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-medical-red"></div>
                    <span>Critical incidents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-medical-blue"></div>
                    <span>Hospitals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span>Available ambulances</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Map view - takes more space */}
        <div className="md:col-span-3">
          <MapView trafficData={trafficData} showTrafficOverlay={showTrafficOverlay} />
        </div>
      </div>
    </div>
  );
};

export default Map;
