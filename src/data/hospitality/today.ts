// Fixed reference date for the fictional Dimension Hospitality demo dataset.
// Keeping this static (instead of `new Date()`) makes every generated record and every
// chart deterministic across server render, client hydration, and every day this demo runs.
export const TODAY = new Date(2026, 7, 31);

export function daysFromToday(offset: number) {
  const date = new Date(TODAY);
  date.setDate(date.getDate() + offset);
  return date;
}

export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function isoDateTime(date: Date) {
  return date.toISOString();
}

export const TODAY_ISO = isoDate(TODAY);
