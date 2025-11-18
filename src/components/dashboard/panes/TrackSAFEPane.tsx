
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    google: typeof google;
  }
}

const TrackSAFEPane = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Churchill Downs coordinates
  const churchillDownsLocation = { lat: 38.2026, lng: -85.7685 };

  const initializeMap = () => {
    if (!mapRef.current || !window.google || !apiKey || !isScriptLoaded) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: churchillDownsLocation,
      zoom: 18,
      mapTypeId: window.google.maps.MapTypeId.SATELLITE,
      tilt: 0,
    });

    // Heat map data points along Churchill Downs track (approximate oval shape)
    const heatMapData = [
      { location: new window.google.maps.LatLng(38.2028, -85.7680), weight: 0.8 },
      { location: new window.google.maps.LatLng(38.2030, -85.7675), weight: 0.6 },
      { location: new window.google.maps.LatLng(38.2032, -85.7670), weight: 0.9 },
      { location: new window.google.maps.LatLng(38.2034, -85.7668), weight: 0.7 },
      { location: new window.google.maps.LatLng(38.2036, -85.7670), weight: 0.5 },
      { location: new window.google.maps.LatLng(38.2038, -85.7675), weight: 0.8 },
      { location: new window.google.maps.LatLng(38.2038, -85.7680), weight: 0.9 },
      { location: new window.google.maps.LatLng(38.2038, -85.7685), weight: 0.6 },
      { location: new window.google.maps.LatLng(38.2038, -85.7690), weight: 0.7 },
      { location: new window.google.maps.LatLng(38.2036, -85.7695), weight: 0.8 },
      { location: new window.google.maps.LatLng(38.2034, -85.7698), weight: 0.5 },
      { location: new window.google.maps.LatLng(38.2032, -85.7700), weight: 0.9 },
      { location: new window.google.maps.LatLng(38.2030, -85.7698), weight: 0.7 },
      { location: new window.google.maps.LatLng(38.2028, -85.7695), weight: 0.6 },
      { location: new window.google.maps.LatLng(38.2026, -85.7690), weight: 0.8 },
      { location: new window.google.maps.LatLng(38.2024, -85.7685), weight: 0.9 },
      { location: new window.google.maps.LatLng(38.2024, -85.7680), weight: 0.7 },
      { location: new window.google.maps.LatLng(38.2026, -85.7675), weight: 0.5 },
    ];

    // Create heat map
    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: heatMapData,
      map: mapInstance,
      radius: 20,
      opacity: 0.8,
      gradient: [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(255, 63, 0, 1)',
        'rgba(255, 127, 0, 1)',
        'rgba(255, 191, 0, 1)',
        'rgba(255, 255, 0, 1)'
      ]
    });

    setMap(mapInstance);
  };

  const loadGoogleMapsScript = () => {
    if (window.google || !apiKey) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization`;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    document.head.appendChild(script);
  };

  useEffect(() => {
    if (apiKey && !isScriptLoaded) {
      loadGoogleMapsScript();
    }
  }, [apiKey]);

  useEffect(() => {
    if (isScriptLoaded) {
      initializeMap();
    }
  }, [isScriptLoaded]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>TrackSAFE - Churchill Downs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Track safety monitoring with real-time heat map overlay showing track conditions and safety metrics.
          </p>
          
          {!apiKey && (
            <div className="mb-4 space-y-2">
              <Label htmlFor="google-maps-key">Google Maps API Key</Label>
              <Input
                id="google-maps-key"
                type="text"
                placeholder="Enter your Google Maps API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="max-w-md"
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from{" "}
                <a 
                  href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Cloud Console
                </a>
              </p>
            </div>
          )}
          
          <div 
            ref={mapRef} 
            className="w-full h-96 rounded-lg border border-gray-300"
            style={{ display: apiKey ? 'block' : 'none' }}
          />
          
          {!apiKey && (
            <div className="w-full h-96 rounded-lg border border-gray-300 bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Enter Google Maps API key to view map</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Heat Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">High Risk Areas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm">Moderate Risk Areas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Low Risk Areas</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Heat map shows track surface conditions, moisture levels, and safety metrics in real-time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackSAFEPane;
