"use client";

import * as React from "react";

import { Save } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const CURRENCIES = ["USD", "EUR", "GBP", "AED"];
const TIMEZONES = ["Eastern Time (US)", "Central Time (US)", "Pacific Time (US)", "GMT", "Central European Time"];

function saveSettings(section: string) {
  toast.success(`${section} saved.`, { description: "This is a frontend demonstration - no data was persisted." });
}

export function SettingsView() {
  const [notifications, setNotifications] = React.useState({
    newReservations: true,
    cancellations: true,
    maintenanceAlerts: true,
    housekeepingAlerts: false,
    dailySummaryEmail: true,
    lowInventoryAlerts: false,
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Settings" description="Configure property details, billing, and notification preferences." />

      <Tabs defaultValue="property">
        <TabsList>
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="policies">Booking Policies</TabsTrigger>
          <TabsTrigger value="billing">Billing &amp; Tax</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="property" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-normal">Property Profile</CardTitle>
              <CardDescription>Basic information shown across the platform.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Property name" defaultValue="Nexora Hospitality Downtown" />
                <Field label="Brand" defaultValue="Nexora Hospitality" />
                <Field label="Contact email" type="email" defaultValue="frontdesk@nexorahospitality.com" />
                <Field label="Contact phone" defaultValue="+1 (415) 555-0134" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" rows={2} defaultValue="480 Market Street, San Francisco, CA 94104" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue={TIMEZONES[0]}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Field label="Total rooms" defaultValue="78" disabled />
              </div>
              <Separator />
              <Button className="w-fit" onClick={() => saveSettings("Property profile")}>
                <Save />
                Save changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-normal">Booking Policies</CardTitle>
              <CardDescription>Default check-in/out windows and cancellation rules.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Check-in time" type="time" defaultValue="15:00" />
                <Field label="Check-out time" type="time" defaultValue="11:00" />
                <Field label="Cancellation window (hours)" type="number" defaultValue="48" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Minimum stay (nights)" type="number" defaultValue="1" />
                <Field label="Maximum stay (nights)" type="number" defaultValue="30" />
                <Field label="Overbooking buffer (%)" type="number" defaultValue="3" />
              </div>
              <Separator />
              <Button className="w-fit" onClick={() => saveSettings("Booking policies")}>
                <Save />
                Save changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-normal">Billing &amp; Tax</CardTitle>
              <CardDescription>Currency, tax rate, and invoicing defaults.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue={CURRENCIES[0]}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Field label="Tax rate (%)" type="number" defaultValue="12" />
                <Field label="City tax (per night)" type="number" defaultValue="3" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Invoice prefix" defaultValue="INV-" />
                <Field label="Payment terms (days)" type="number" defaultValue="14" />
              </div>
              <Separator />
              <Button className="w-fit" onClick={() => saveSettings("Billing settings")}>
                <Save />
                Save changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-normal">Notifications</CardTitle>
              <CardDescription>Choose which operational alerts your team receives.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <ToggleRow
                label="New reservations"
                description="Notify front desk when a new reservation is created."
                checked={notifications.newReservations}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, newReservations: checked }))}
              />
              <ToggleRow
                label="Cancellations"
                description="Notify when a guest cancels or no-shows."
                checked={notifications.cancellations}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, cancellations: checked }))}
              />
              <ToggleRow
                label="Maintenance alerts"
                description="High and critical priority maintenance issues."
                checked={notifications.maintenanceAlerts}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, maintenanceAlerts: checked }))}
              />
              <ToggleRow
                label="Housekeeping alerts"
                description="Rooms overdue for cleaning or inspection."
                checked={notifications.housekeepingAlerts}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, housekeepingAlerts: checked }))}
              />
              <ToggleRow
                label="Daily summary email"
                description="A recap of arrivals, departures, and revenue each morning."
                checked={notifications.dailySummaryEmail}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, dailySummaryEmail: checked }))}
              />
              <ToggleRow
                label="Low inventory alerts"
                description="Notify when a room type is nearly sold out."
                checked={notifications.lowInventoryAlerts}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, lowInventoryAlerts: checked }))}
              />
              <Separator className="my-3" />
              <Button className="w-fit" onClick={() => saveSettings("Notification preferences")}>
                <Save />
                Save changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof Input>) {
  const id = React.useId();
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const id = React.useId();
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
