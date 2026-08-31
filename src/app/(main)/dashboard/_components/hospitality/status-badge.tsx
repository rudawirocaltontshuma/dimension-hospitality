import { Badge } from "@/components/ui/badge";
import type { StatusMeta } from "@/data/hospitality";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, meta, className }: { status: string; meta: StatusMeta; className?: string }) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 border px-2 py-1 font-medium", meta.badgeClass, className)}>
      <span className={cn("size-1.5 shrink-0 rounded-full", meta.dotClass)} />
      {status}
    </Badge>
  );
}
