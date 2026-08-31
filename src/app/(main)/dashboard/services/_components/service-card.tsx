import { Star } from "lucide-react";

import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency, type HotelService, SERVICE_STATUS_META } from "@/data/hospitality";

import { ServiceIcon } from "./service-icon";

export function ServiceCard({ service }: { service: HotelService }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted">
            <ServiceIcon icon={service.icon} className="size-5" />
          </div>
          <div>
            <div className="font-medium leading-tight">{service.name}</div>
            <div className="text-muted-foreground text-xs">{service.category}</div>
          </div>
        </div>
        <StatusBadge status={service.status} meta={SERVICE_STATUS_META[service.status]} />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm">{service.description}</p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <Stat label="Requests" value={`${service.requests30d}`} />
          <Stat label="Revenue" value={formatCurrency(service.revenue30d)} />
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs">Rating</span>
            <span className="flex items-center gap-1 tabular-nums">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {service.avgRating.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="text-muted-foreground text-xs">
          {formatCurrency(service.price)} {service.unit}
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
