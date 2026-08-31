"use client";

import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Calendar } from "./calendar";
import { ReservationTimeline } from "./reservation-timeline";

export function HospitalityCalendar() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Calendar" description="Occupancy across Month, Week, and Timeline views." />

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="mt-4">
          <Calendar />
        </TabsContent>
        <TabsContent value="timeline" className="mt-4">
          <ReservationTimeline />
        </TabsContent>
      </Tabs>
    </div>
  );
}
