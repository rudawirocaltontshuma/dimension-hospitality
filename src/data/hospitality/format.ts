import { differenceInCalendarDays, format, parseISO } from "date-fns";

import { TODAY } from "./today";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyFormatterPrecise = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number, precise = false) {
  return precise ? currencyFormatterPrecise.format(value) : currencyFormatter.format(value);
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(iso: string, pattern = "MMM d, yyyy") {
  return format(parseISO(iso), pattern);
}

export function formatDateTime(iso: string) {
  return format(parseISO(iso), "MMM d, yyyy 'at' h:mm a");
}

export function formatPercent(value: number, fractionDigits = 0) {
  return `${value.toFixed(fractionDigits)}%`;
}

export function relativeDayLabel(iso: string) {
  const days = differenceInCalendarDays(parseISO(iso), TODAY);

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days > 1) return `In ${days} days`;
  return `${Math.abs(days)} days ago`;
}

export function nightsBetween(checkIn: string, checkOut: string) {
  return differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
}
