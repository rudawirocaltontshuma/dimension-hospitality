import { BedDouble, Clock3, DollarSign, Gauge, LogIn, LogOut, Sparkles, TrendingUp } from "lucide-react";

import { StatCard } from "@/app/(main)/dashboard/_components/hospitality/stat-card";
import {
  availableRoomsCount,
  averageDailyRate,
  formatCurrency,
  occupancyRate,
  pendingReservationsCount,
  revenueLast30Days,
  rooms,
  roomsCleaningCount,
  todaysArrivals,
  todaysDepartures,
} from "@/data/hospitality";

export function KpiGrid() {
  const occupancy = occupancyRate();
  const available = availableRoomsCount();
  const arrivals = todaysArrivals().length;
  const departures = todaysDepartures().length;
  const adr = averageDailyRate();
  const revenue = revenueLast30Days();
  const pending = pendingReservationsCount();
  const cleaning = roomsCleaningCount();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Occupancy" value={`${occupancy}%`} icon={Gauge} hint={`${rooms.length} total rooms`} />
      <StatCard label="Available Rooms" value={`${available}`} icon={BedDouble} hint="ready for arrival" />
      <StatCard label="Today's Arrivals" value={`${arrivals}`} icon={LogIn} hint="expected today" />
      <StatCard label="Today's Departures" value={`${departures}`} icon={LogOut} hint="checking out today" />
      <StatCard label="Average Daily Rate" value={formatCurrency(adr)} icon={DollarSign} hint="per occupied room" />
      <StatCard label="Revenue" value={formatCurrency(revenue)} icon={TrendingUp} hint="trailing 30 days" />
      <StatCard label="Pending Reservations" value={`${pending}`} icon={Clock3} hint="awaiting confirmation" />
      <StatCard label="Rooms Cleaning" value={`${cleaning}`} icon={Sparkles} hint="in housekeeping queue" />
    </div>
  );
}
