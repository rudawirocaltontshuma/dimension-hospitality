import { EMAIL_DOMAINS, GUEST_FIRST_NAMES, GUEST_LAST_NAMES, NATIONALITIES } from "./names";
import type { Rng } from "./rng";
import { daysFromToday, isoDate } from "./today";
import type { Guest, VipTier } from "./types";

const NOTE_POOL = [
  "Prefers a high floor room.",
  "Celebrating an anniversary on this stay.",
  "Requested extra pillows.",
  "Allergic to feather bedding.",
  "Frequent late check-out request.",
  "Prefers rooms away from the elevator.",
  "Traveling for a conference.",
  "Enjoys the spa on every visit.",
  "Vegetarian meal preference on file.",
  "Loyalty member since 2021.",
  "",
  "",
  "",
];

const VIP_WEIGHTS: [VipTier, number][] = [
  ["None", 0.55],
  ["Silver", 0.24],
  ["Gold", 0.14],
  ["Platinum", 0.07],
];

export function generateGuests(rng: Rng, count: number): Guest[] {
  const guests: Guest[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    let firstName = rng.pick(GUEST_FIRST_NAMES);
    let lastName = rng.pick(GUEST_LAST_NAMES);
    let fullName = `${firstName} ${lastName}`;
    let attempts = 0;

    while (usedNames.has(fullName) && attempts < 10) {
      firstName = rng.pick(GUEST_FIRST_NAMES);
      lastName = rng.pick(GUEST_LAST_NAMES);
      fullName = `${firstName} ${lastName}`;
      attempts++;
    }
    usedNames.add(fullName);

    const vipTier = rng.weightedPick(VIP_WEIGHTS);
    const totalStays = vipTier === "None" ? rng.int(1, 3) : rng.int(2, 14);
    const avgSpendPerStay = rng.int(180, 1450);
    const totalSpend = totalStays * avgSpendPerStay;
    const hasVisited = rng.bool(0.85);
    const domain = rng.pick(EMAIL_DOMAINS);

    guests.push({
      id: `guest-${String(i + 1).padStart(4, "0")}`,
      name: fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      phone: `+1 (${rng.int(200, 989)}) 555-${rng.int(1000, 9999)}`,
      nationality: rng.pick(NATIONALITIES),
      vipTier,
      totalStays,
      totalSpend,
      lastVisit: hasVisited ? isoDate(daysFromToday(-rng.int(0, 260))) : null,
      loyaltyPoints: totalSpend > 0 ? Math.round(totalSpend * 1.5) : 0,
      notes: rng.pick(NOTE_POOL),
      createdAt: isoDate(daysFromToday(-rng.int(30, 900))),
    });
  }

  return guests;
}
