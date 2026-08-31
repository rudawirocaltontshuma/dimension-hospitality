import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, type RoomType, type RoomTypePerformanceEntry } from "@/data/hospitality";

export function RoomTypeCard({ type, performance }: { type: RoomType; performance: RoomTypePerformanceEntry }) {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-medium text-lg leading-tight">{type.name}</h2>
            <p className="text-muted-foreground text-sm">{type.tagline}</p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {type.totalRooms} rooms
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">{type.description}</p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
          <Stat label="Capacity" value={`${type.maxAdults} adults, ${type.maxChildren} kids`} />
          <Stat label="Size" value={`${type.sizeSqm} m² · ${type.bedConfig}`} />
          <Stat label="Rate" value={`${formatCurrency(type.baseRate)}/night`} />
          <Stat label="Revenue" value={formatCurrency(performance.revenue)} hint="last 45 days" />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Occupancy</span>
            <span className="tabular-nums">
              {performance.occupied}/{performance.totalRooms} rooms &middot; {performance.occupancyPct}%
            </span>
          </div>
          <Progress value={performance.occupancyPct} />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {type.amenities.map((amenity) => (
            <Badge key={amenity} variant="outline" className="font-normal">
              {amenity}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="tabular-nums">{value}</span>
      {hint ? <span className="text-muted-foreground text-xs">{hint}</span> : null}
    </div>
  );
}
