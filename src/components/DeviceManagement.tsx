import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Plus, Wifi, WifiOff, Battery, Settings, Trash2 } from 'lucide-react';

interface IoTDevice {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'warning';
  batteryLevel: number;
  lastSeen: Date;
  gasLevel: number;
  ipAddress: string;
}

export function DeviceManagement() {
  const [devices, setDevices] = useState<IoTDevice[]>([
    {
      id: 'lpg-001',
      name: 'Kitchen Sensor',
      location: 'Kitchen Area',
      status: 'online',
      batteryLevel: 85,
      lastSeen: new Date(),
      gasLevel: 320,
      ipAddress: '192.168.1.101'
    },
    {
      id: 'lpg-002',
      name: 'Garage Sensor',
      location: 'Garage',
      status: 'warning',
      batteryLevel: 25,
      lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
      gasLevel: 150,
      ipAddress: '192.168.1.102'
    },
    {
      id: 'lpg-003',
      name: 'Basement Sensor',
      location: 'Basement',
      status: 'offline',
      batteryLevel: 0,
      lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
      gasLevel: 0,
      ipAddress: '192.168.1.103'
    }
  ]);

  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    location: '',
    ipAddress: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'default';
      case 'warning': return 'secondary';
      case 'offline': return 'destructive';
      default: return 'default';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-500';
    if (level > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleAddDevice = () => {
    if (newDevice.name && newDevice.location && newDevice.ipAddress) {
      const device: IoTDevice = {
        id: `lpg-${String(devices.length + 1).padStart(3, '0')}`,
        name: newDevice.name,
        location: newDevice.location,
        status: 'online',
        batteryLevel: 100,
        lastSeen: new Date(),
        gasLevel: Math.round(Math.random() * 500),
        ipAddress: newDevice.ipAddress
      };
      
      setDevices([...devices, device]);
      setNewDevice({ name: '', location: '', ipAddress: '' });
      setIsAddingDevice(false);
    }
  };

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(devices.filter(device => device.id !== deviceId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2>Connected Devices</h2>
        <Dialog open={isAddingDevice} onOpenChange={setIsAddingDevice}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New LPG Sensor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="deviceName">Device Name</Label>
                <Input
                  id="deviceName"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                  placeholder="e.g., Kitchen Sensor"
                />
              </div>
              <div>
                <Label htmlFor="deviceLocation">Location</Label>
                <Input
                  id="deviceLocation"
                  value={newDevice.location}
                  onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
                  placeholder="e.g., Kitchen Area"
                />
              </div>
              <div>
                <Label htmlFor="deviceIP">IP Address</Label>
                <Input
                  id="deviceIP"
                  value={newDevice.ipAddress}
                  onChange={(e) => setNewDevice({...newDevice, ipAddress: e.target.value})}
                  placeholder="e.g., 192.168.1.104"
                />
              </div>
              <Button onClick={handleAddDevice} className="w-full">
                Add Device
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {devices.length === 0 && (
        <Alert>
          <AlertDescription>
            No devices connected. Add your first LPG sensor to start monitoring.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {devices.map((device) => (
          <Card key={device.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium">{device.name}</h3>
                  <p className="text-sm text-muted-foreground">{device.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(device.status)}>
                    {device.status === 'online' ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                    {device.status.toUpperCase()}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveDevice(device.id)}
                    className="p-1 h-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Battery className={`h-3 w-3 ${getBatteryColor(device.batteryLevel)}`} />
                    Battery
                  </div>
                  <div className={getBatteryColor(device.batteryLevel)}>
                    {device.batteryLevel}%
                  </div>
                </div>
                
                <div>
                  <div className="text-muted-foreground mb-1">Gas Level</div>
                  <div>{device.gasLevel} PPM</div>
                </div>
                
                <div>
                  <div className="text-muted-foreground mb-1">IP Address</div>
                  <div className="font-mono text-xs">{device.ipAddress}</div>
                </div>
                
                <div>
                  <div className="text-muted-foreground mb-1">Last Seen</div>
                  <div className="text-xs">
                    {device.status === 'online' 
                      ? 'Now' 
                      : device.lastSeen.toLocaleTimeString()
                    }
                  </div>
                </div>
              </div>

              {device.status === 'warning' && device.batteryLevel < 30 && (
                <Alert className="mt-3 border-yellow-500 bg-yellow-50">
                  <AlertDescription className="text-sm">
                    Low battery warning. Replace batteries soon.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}