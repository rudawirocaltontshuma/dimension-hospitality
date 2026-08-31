export type RoomTypeId = "standard" | "deluxe" | "executive" | "suite" | "family";

export interface RoomType {
  id: RoomTypeId;
  name: string;
  tagline: string;
  description: string;
  baseRate: number;
  maxAdults: number;
  maxChildren: number;
  sizeSqm: number;
  bedConfig: string;
  amenities: string[];
  totalRooms: number;
}

export type RoomStatus = "Available" | "Occupied" | "Cleaning" | "Maintenance" | "Out of Service";
export type HousekeepingStatus = "Clean" | "Dirty" | "Cleaning" | "Inspected" | "Maintenance";

export interface Room {
  id: string;
  number: string;
  floor: number;
  typeId: RoomTypeId;
  rate: number;
  status: RoomStatus;
  housekeeping: HousekeepingStatus;
  view: string;
  occupantGuestId: string | null;
  lastCleaned: string;
  notes?: string;
}

export type VipTier = "None" | "Silver" | "Gold" | "Platinum";

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  vipTier: VipTier;
  totalStays: number;
  totalSpend: number;
  lastVisit: string | null;
  loyaltyPoints: number;
  notes: string;
  createdAt: string;
}

export type Department = "Front Desk" | "Housekeeping" | "Maintenance" | "Restaurant" | "Management";
export type Shift = "Morning" | "Afternoon" | "Night";
export type StaffStatus = "On Duty" | "Off Duty" | "On Leave";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  department: Department;
  role: string;
  shift: Shift;
  status: StaffStatus;
  performance: number;
  hireDate: string;
  tasksCompleted: number;
}

export type ReservationStatus = "Confirmed" | "Pending" | "Checked In" | "Checked Out" | "Cancelled" | "No-show";
export type BookingSource = "Direct" | "Booking.com" | "Expedia" | "Corporate" | "Travel Agent" | "Walk-in";

export interface ReservationServiceCharge {
  id: string;
  serviceId: string;
  date: string;
  quantity: number;
  amount: number;
}

export interface TimelineEvent {
  id: string;
  label: string;
  timestamp: string;
  actor: string;
}

export interface Reservation {
  id: string;
  code: string;
  guestId: string;
  roomId: string;
  typeId: RoomTypeId;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  rate: number;
  status: ReservationStatus;
  source: BookingSource;
  createdAt: string;
  notes: string;
  services: ReservationServiceCharge[];
  timeline: TimelineEvent[];
}

export type MaintenanceCategory = "Electrical" | "Plumbing" | "HVAC" | "Furniture" | "Electronics" | "Structural";
export type MaintenancePriority = "Low" | "Medium" | "High" | "Critical";
export type MaintenanceStatus = "Reported" | "Assigned" | "In Progress" | "Completed";

export interface MaintenanceIssue {
  id: string;
  title: string;
  roomId: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  assignedStaffId: string | null;
  dateReported: string;
  dateResolved: string | null;
  status: MaintenanceStatus;
  description: string;
}

export type HousekeepingPriority = "Low" | "Medium" | "High" | "Urgent";

export interface HousekeepingTask {
  id: string;
  roomId: string;
  housekeeperId: string | null;
  priority: HousekeepingPriority;
  status: HousekeepingStatus;
  lastCleaned: string;
  notes: string;
}

export type ServiceStatus = "Active" | "Paused";

export interface HotelService {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  requests30d: number;
  revenue30d: number;
  status: ServiceStatus;
  avgRating: number;
  icon: string;
}

export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Refunded";
export type PaymentMethod = "Credit Card" | "Debit Card" | "Cash" | "Bank Transfer" | "Corporate Account";

export interface Invoice {
  id: string;
  reservationId: string;
  guestId: string;
  issuedDate: string;
  dueDate: string;
  roomCharges: number;
  serviceCharges: number;
  taxes: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
}
