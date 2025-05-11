import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Lock, Globe, User, Mail, Phone } from "lucide-react";

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <Input id="name" defaultValue="John Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <Input id="phone" type="tel" defaultValue="+1 234-567-8900" />
              </div>
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your security preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-gray-500" />
                <Input id="current-password" type="password" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-gray-500" />
                <Input id="new-password" type="password" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-gray-500" />
                <Input id="confirm-password" type="password" />
              </div>
            </div>
            <Button className="w-full">Update Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <Label htmlFor="push-notifications">Push Notifications</Label>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
              </div>
              <Switch id="emergency-alerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Manage system preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <Label htmlFor="language">Language</Label>
              </div>
              <select
                id="language"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue="en"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <Label htmlFor="timezone">Timezone</Label>
              </div>
              <select
                id="timezone"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue="UTC"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings; 