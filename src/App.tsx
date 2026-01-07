import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { GasDashboard } from './components/GasDashboard';
import { HistoricalChart } from './components/HistoricalChart';
import { DeviceManagement } from './components/DeviceManagement';
import { AlertSettings } from './components/AlertSettings';
import { Toaster } from './components/ui/sonner';
import { Activity, History, Settings, Smartphone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-center">LPG Gas Detector</h1>
          <p className="text-sm text-center opacity-90 mt-1">Real-time Safety Monitoring</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 gap-1">
            <TabsTrigger value="dashboard" className="text-xs flex flex-col items-center gap-1">
              <Activity className="h-4 w-4" />
              Live
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs flex flex-col items-center gap-1">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="devices" className="text-xs flex flex-col items-center gap-1">
              <Smartphone className="h-4 w-4" />
              Devices
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs flex flex-col items-center gap-1">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <GasDashboard deviceId="lpg-001" />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <HistoricalChart />
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <DeviceManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <AlertSettings />
          </TabsContent>
        </Tabs>
      </div>

      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)'
          }
        }}
      />

      {/* Emergency Contact Info */}
      <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <p className="text-red-800 text-sm">
            🚨 <strong>Emergency:</strong> Gas leak detected? Call <strong>101</strong> immediately!
          </p>
        </div>
      </div>
    </div>
  );
}