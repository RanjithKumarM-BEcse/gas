import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Thermometer,
  Wind,
} from "lucide-react";

interface GasReading {
  id: string;
  deviceId: string;
  gasLevel: number; // PPM (parts per million)
  temperature: number;
  humidity: number;
  timestamp: Date;
  location: string;
}

interface GasDashboardProps {
  deviceId: string;
}

export function GasDashboard({ deviceId }: GasDashboardProps) {
  const [currentReading, setCurrentReading] =
    useState<GasReading | null>(null);
  const [alertThreshold] = useState({
    warning: 1000,
    danger: 2500,
  }); // PPM thresholds
  const [isConnected, setIsConnected] = useState(true);

  // Mock real-time data simulation
  useEffect(() => {
    const simulateReading = () => {
      // Simulate varying gas levels with occasional spikes
      const baseLevel = Math.random() * 500;
      const spike =
        Math.random() > 0.9 ? Math.random() * 3000 : 0;
      const gasLevel = baseLevel + spike;

      const newReading: GasReading = {
        id: Date.now().toString(),
        deviceId,
        gasLevel: Math.round(gasLevel),
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 30,
        timestamp: new Date(),
        location: "Kitchen Area",
      };

      setCurrentReading(newReading);
    };

    // Initial reading
    simulateReading();

    // Update every 2 seconds
    const interval = setInterval(simulateReading, 2000);

    // Simulate connection status changes
    const connectionCheck = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(connectionCheck);
    };
  }, [deviceId]);

  const getGasLevelStatus = (level: number) => {
    if (level >= alertThreshold.danger)
      return {
        status: "danger",
        color: "destructive",
        icon: XCircle,
      };
    if (level >= alertThreshold.warning)
      return {
        status: "warning",
        color: "secondary",
        icon: AlertTriangle,
      };
    return {
      status: "safe",
      color: "default",
      icon: CheckCircle,
    };
  };

  const getGasLevelPercentage = (level: number) => {
    const maxDisplay = 5000; // Maximum PPM to display at 100%
    return Math.min((level / maxDisplay) * 100, 100);
  };

  if (!currentReading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  const gasStatus = getGasLevelStatus(currentReading.gasLevel);
  const StatusIcon = gasStatus.icon;

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="text-sm">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <Badge variant="outline">
          {currentReading.location}
        </Badge>
      </div>

      {/* Alert Banner */}
      {currentReading.gasLevel >= alertThreshold.warning && (
        <Alert
          className={
            gasStatus.status === "danger"
              ? "border-destructive bg-destructive/10"
              : "border-yellow-500 bg-yellow-50"
          }
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {gasStatus.status === "danger"
              ? "DANGER: High gas concentration detected! Evacuate immediately!"
              : "WARNING: Elevated gas levels detected. Check for leaks."}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Gas Level Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>LPG Gas Level</span>
            <Badge
              variant={
                gasStatus.color === "destructive"
                  ? "destructive"
                  : gasStatus.color === "secondary"
                    ? "secondary"
                    : "default"
              }
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {gasStatus.status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">
              {currentReading.gasLevel} PPM
            </div>
            <Progress
              value={getGasLevelPercentage(
                currentReading.gasLevel,
              )}
              className={`h-3 ${
                gasStatus.status === "danger"
                  ? "[&>div]:bg-red-500"
                  : gasStatus.status === "warning"
                    ? "[&>div]:bg-yellow-500"
                    : "[&>div]:bg-green-500"
              }`}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0 PPM</span>
              <span>Safe: {alertThreshold.warning}</span>
              <span>5000+ PPM</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Data */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Temperature</span>
            </div>
            <div className="text-2xl">
              {currentReading.temperature.toFixed(1)}°C
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Humidity</span>
            </div>
            <div className="text-2xl">
              {currentReading.humidity.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="text-center text-xs text-muted-foreground">
        Last updated:{" "}
        {currentReading.timestamp.toLocaleTimeString()}
      </div>
    </div>
  );
}