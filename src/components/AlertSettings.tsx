import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Alert, AlertDescription } from './ui/alert';
import { Bell, Volume2, Vibrate, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AlertSettingsData {
  warningThreshold: number;
  dangerThreshold: number;
  enableAudioAlerts: boolean;
  enableVibration: boolean;
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
  alertVolume: number;
  snoozeTime: number;
  emailAddress: string;
  phoneNumber: string;
  autoEvacuationAlert: boolean;
}

export function AlertSettings() {
  const [settings, setSettings] = useState<AlertSettingsData>({
    warningThreshold: 1000,
    dangerThreshold: 2500,
    enableAudioAlerts: true,
    enableVibration: true,
    enableEmailNotifications: false,
    enableSMSNotifications: false,
    alertVolume: 80,
    snoozeTime: 5,
    emailAddress: '',
    phoneNumber: '',
    autoEvacuationAlert: true
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateSetting = <K extends keyof AlertSettingsData>(
    key: K,
    value: AlertSettingsData[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Validate thresholds
    if (settings.warningThreshold >= settings.dangerThreshold) {
      toast.error('Warning threshold must be less than danger threshold');
      return;
    }

    if (settings.enableEmailNotifications && !settings.emailAddress) {
      toast.error('Email address is required for email notifications');
      return;
    }

    if (settings.enableSMSNotifications && !settings.phoneNumber) {
      toast.error('Phone number is required for SMS notifications');
      return;
    }

    // In a real app, this would save to backend/localStorage
    console.log('Saving settings:', settings);
    setHasUnsavedChanges(false);
    toast.success('Alert settings saved successfully!');
  };

  const handleReset = () => {
    setSettings({
      warningThreshold: 1000,
      dangerThreshold: 2500,
      enableAudioAlerts: true,
      enableVibration: true,
      enableEmailNotifications: false,
      enableSMSNotifications: false,
      alertVolume: 80,
      snoozeTime: 5,
      emailAddress: '',
      phoneNumber: '',
      autoEvacuationAlert: true
    });
    setHasUnsavedChanges(true);
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      {hasUnsavedChanges && (
        <Alert>
          <AlertDescription>
            You have unsaved changes. Don't forget to save your settings.
          </AlertDescription>
        </Alert>
      )}

      {/* Gas Level Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Gas Level Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="warningThreshold">Warning Threshold (PPM)</Label>
            <Input
              id="warningThreshold"
              type="number"
              value={settings.warningThreshold}
              onChange={(e) => updateSetting('warningThreshold', parseInt(e.target.value) || 0)}
              min="0"
              max="5000"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Alert will trigger when gas level exceeds this value
            </p>
          </div>
          
          <div>
            <Label htmlFor="dangerThreshold">Danger Threshold (PPM)</Label>
            <Input
              id="dangerThreshold"
              type="number"
              value={settings.dangerThreshold}
              onChange={(e) => updateSetting('dangerThreshold', parseInt(e.target.value) || 0)}
              min="0"
              max="10000"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Critical alert will trigger when gas level exceeds this value
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <Label htmlFor="audioAlerts">Audio Alerts</Label>
            </div>
            <Switch
              id="audioAlerts"
              checked={settings.enableAudioAlerts}
              onCheckedChange={(checked) => updateSetting('enableAudioAlerts', checked)}
            />
          </div>

          {settings.enableAudioAlerts && (
            <div>
              <Label>Alert Volume: {settings.alertVolume}%</Label>
              <Slider
                value={[settings.alertVolume]}
                onValueChange={(value) => updateSetting('alertVolume', value[0])}
                max={100}
                min={0}
                step={10}
                className="mt-2"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Vibrate className="h-4 w-4" />
              <Label htmlFor="vibration">Vibration</Label>
            </div>
            <Switch
              id="vibration"
              checked={settings.enableVibration}
              onCheckedChange={(checked) => updateSetting('enableVibration', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <Label htmlFor="emailNotifications">Email Notifications</Label>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.enableEmailNotifications}
              onCheckedChange={(checked) => updateSetting('enableEmailNotifications', checked)}
            />
          </div>

          {settings.enableEmailNotifications && (
            <div>
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                value={settings.emailAddress}
                onChange={(e) => updateSetting('emailAddress', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
            </div>
            <Switch
              id="smsNotifications"
              checked={settings.enableSMSNotifications}
              onCheckedChange={(checked) => updateSetting('enableSMSNotifications', checked)}
            />
          </div>

          {settings.enableSMSNotifications && (
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={settings.phoneNumber}
                onChange={(e) => updateSetting('phoneNumber', e.target.value)}
                placeholder="+1234567890"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="snoozeTime">Alert Snooze Time</Label>
            <Select 
              value={settings.snoozeTime.toString()} 
              onValueChange={(value) => updateSetting('snoozeTime', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 minute</SelectItem>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoEvacuation">Auto Evacuation Alert</Label>
              <p className="text-xs text-muted-foreground">
                Automatically suggest evacuation for danger-level alerts
              </p>
            </div>
            <Switch
              id="autoEvacuation"
              checked={settings.autoEvacuationAlert}
              onCheckedChange={(checked) => updateSetting('autoEvacuationAlert', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          Save Settings
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}