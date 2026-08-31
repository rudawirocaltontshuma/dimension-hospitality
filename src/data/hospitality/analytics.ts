import { createRng } from "./rng";
import { daysFromToday, isoDate } from "./today";

// Long-running trend lines authored as smooth, seeded series (independent of the ~100 sampled
// reservations, which are too sparse to plot a clean multi-week/month curve from directly).
const rng = createRng(90210);

function wave(index: number, length: number, base: number, amplitude: number, noiseSpan: number) {
  const angle = (index / length) * Math.PI * 2.4;
  const seasonal = Math.sin(angle) * amplitude;
  const noise = rng.float(-noiseSpan, noiseSpan);
  return Math.round((base + seasonal + noise) * 10) / 10;
}

export const occupancyTrend = Array.from({ length: 14 }, (_, i) => {
  const date = daysFromToday(-13 + i);
  return {
    date: isoDate(date),
    label: date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
    occupancy: Math.min(98, Math.max(52, wave(i, 14, 76, 10, 4))),
  };
});

export const adrTrend = Array.from({ length: 14 }, (_, i) => {
  const date = daysFromToday(-13 + i);
  return {
    date: isoDate(date),
    label: date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
    adr: Math.round(Math.min(240, Math.max(150, wave(i, 14, 188, 18, 6)))),
  };
});

export const revParTrend = occupancyTrend.map((entry, i) => ({
  date: entry.date,
  label: entry.label,
  revpar: Math.round((entry.occupancy / 100) * adrTrend[i].adr * 10) / 10,
}));

const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(2026, i, 1);
  return date.toLocaleDateString("en-US", { month: "short" });
});

export const revenueTrend = MONTHS.map((month, i) => {
  const revenue = Math.round(wave(i, 12, 168_000, 42_000, 9000));
  return {
    month,
    revenue,
    target: Math.round(revenue * (0.92 + rng.float(0, 0.14))),
  };
});

export const bookingsTrend = Array.from({ length: 14 }, (_, i) => {
  const date = daysFromToday(-13 + i);
  return {
    date: isoDate(date),
    label: date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
    bookings: Math.max(3, Math.round(wave(i, 14, 15, 6, 3))),
  };
});

export const cancellationRateTrend = MONTHS.map((month, i) => ({
  month,
  rate: Math.max(2, Math.round(wave(i, 12, 6, 2, 1) * 10) / 10),
}));

export const guestSatisfactionTrend = MONTHS.map((month, i) => ({
  month,
  score: Math.min(5, Math.max(3.6, Math.round(wave(i, 12, 4.4, 0.3, 0.1) * 10) / 10)),
}));

export const housekeepingTurnaroundTrend = Array.from({ length: 14 }, (_, i) => {
  const date = daysFromToday(-13 + i);
  return {
    date: isoDate(date),
    label: date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
    minutes: Math.max(18, Math.round(wave(i, 14, 34, 8, 4))),
  };
});
