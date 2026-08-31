import {
  CarFront,
  ConciergeBell,
  MapPinned,
  Printer,
  Sparkles,
  UtensilsCrossed,
  WashingMachine,
  Wine,
} from "lucide-react";

const ICONS = {
  ConciergeBell,
  WashingMachine,
  Sparkles,
  CarFront,
  UtensilsCrossed,
  Wine,
  MapPinned,
  Printer,
} as const;

export function ServiceIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = ICONS[icon as keyof typeof ICONS] ?? ConciergeBell;
  return <Icon className={className} />;
}
