export interface ServiceCatalogEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  icon: string;
}

export const SERVICES_CATALOG: ServiceCatalogEntry[] = [
  {
    id: "svc-room-service",
    name: "Room Service",
    category: "Dining",
    description: "In-room dining available around the clock from the full restaurant menu.",
    price: 34,
    unit: "per order",
    icon: "ConciergeBell",
  },
  {
    id: "svc-laundry",
    name: "Laundry & Pressing",
    category: "Housekeeping",
    description: "Same-day laundry, dry cleaning, and pressing service.",
    price: 22,
    unit: "per bag",
    icon: "WashingMachine",
  },
  {
    id: "svc-spa",
    name: "Spa & Wellness",
    category: "Wellness",
    description: "Massages, facials, and sauna access at the Nexora wellness spa.",
    price: 120,
    unit: "per session",
    icon: "Sparkles",
  },
  {
    id: "svc-airport-transfer",
    name: "Airport Transfer",
    category: "Transport",
    description: "Private chauffeured transfer between the hotel and the airport.",
    price: 65,
    unit: "per trip",
    icon: "CarFront",
  },
  {
    id: "svc-restaurant",
    name: "Restaurant & Dining",
    category: "Dining",
    description: "Table reservations at the signature on-site restaurant.",
    price: 58,
    unit: "per cover",
    icon: "UtensilsCrossed",
  },
  {
    id: "svc-minibar",
    name: "Minibar",
    category: "Dining",
    description: "In-room minibar restocked daily with snacks and beverages.",
    price: 18,
    unit: "per restock",
    icon: "Wine",
  },
  {
    id: "svc-concierge",
    name: "Concierge & Tours",
    category: "Experiences",
    description: "Curated local tours, tickets, and reservations booked by the concierge desk.",
    price: 45,
    unit: "per booking",
    icon: "MapPinned",
  },
  {
    id: "svc-business-center",
    name: "Business Center",
    category: "Business",
    description: "Meeting room, printing, and workstation access for business travelers.",
    price: 40,
    unit: "per hour",
    icon: "Printer",
  },
];
