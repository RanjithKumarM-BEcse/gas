import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface HistoricalData {
  timestamp: string;
  gasLevel: number;
  temperature: number;
  humidity: number;
}

export function HistoricalChart() {
  const [data, setData] = useState<HistoricalData[]>([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('gasLevel');

  // Generate mock historical data
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const dataPoints = timeRange === '1h' ? 60 : timeRange === '24h' ? 24 : 7;
      const interval = timeRange === '1h' ? 1 : timeRange === '24h' ? 60 : 1440; // minutes
      
      const newData: HistoricalData[] = [];
      
      for (let i = dataPoints - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - (i * interval * 60000));
        
        // Simulate realistic gas level patterns with occasional spikes
        let gasLevel = 200 + Math.random() * 300;
        if (Math.random() > 0.95) {
          gasLevel += Math.random() * 2000; // Occasional spikes
        }
        
        newData.push({
          timestamp: timeRange === '1h' 
            ? time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
            : timeRange === '24h'
            ? time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
            : time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          gasLevel: Math.round(gasLevel),
          temperature: 20 + Math.random() * 10,
          humidity: 45 + Math.random() * 20
        });
      }
      
      setData(newData);
    };

    generateData();
    const interval = setInterval(generateData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [timeRange]);

  const getMetricConfig = (metric: string) => {
    switch (metric) {
      case 'gasLevel':
        return {
          dataKey: 'gasLevel',
          name: 'Gas Level (PPM)',
          color: '#ef4444',
          yAxisDomain: [0, 'dataMax + 500']
        };
      case 'temperature':
        return {
          dataKey: 'temperature',
          name: 'Temperature (°C)',
          color: '#f97316',
          yAxisDomain: ['dataMin - 2', 'dataMax + 2']
        };
      case 'humidity':
        return {
          dataKey: 'humidity',
          name: 'Humidity (%)',
          color: '#3b82f6',
          yAxisDomain: [0, 100]
        };
      default:
        return {
          dataKey: 'gasLevel',
          name: 'Gas Level (PPM)',
          color: '#ef4444',
          yAxisDomain: [0, 'dataMax + 500']
        };
    }
  };

  const metricConfig = getMetricConfig(selectedMetric);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Historical Data</span>
          <div className="flex gap-2">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasLevel">Gas Level</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="humidity">Humidity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="1h">1 Hour</TabsTrigger>
            <TabsTrigger value="24h">24 Hours</TabsTrigger>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
          </TabsList>
          
          <TabsContent value={timeRange} className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    fontSize={12}
                    angle={timeRange === '1h' ? 0 : -45}
                    textAnchor={timeRange === '1h' ? 'middle' : 'end'}
                    height={timeRange === '1h' ? 30 : 60}
                  />
                  <YAxis 
                    fontSize={12}
                    domain={metricConfig.yAxisDomain}
                  />
                  <Tooltip 
                    labelFormatter={(label) => `Time: ${label}`}
                    formatter={(value, name) => [
                      `${value}${selectedMetric === 'gasLevel' ? ' PPM' : selectedMetric === 'temperature' ? '°C' : '%'}`,
                      metricConfig.name
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={metricConfig.dataKey}
                    stroke={metricConfig.color}
                    strokeWidth={2}
                    dot={false}
                  />
                  {selectedMetric === 'gasLevel' && (
                    <>
                      <ReferenceLine y={1000} stroke="#fbbf24" strokeDasharray="5 5" label="Warning" />
                      <ReferenceLine y={2500} stroke="#ef4444" strokeDasharray="5 5" label="Danger" />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}