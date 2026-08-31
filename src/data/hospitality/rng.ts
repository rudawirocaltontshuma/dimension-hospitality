/**
 * Deterministic pseudo-random helpers used to generate the fictional Dimension Hospitality
 * dataset. Using a seeded generator (instead of Math.random) keeps every render - server
 * and client - identical, which avoids hydration mismatches for data created at module load.
 */
export function createRng(seed: number) {
  let state = seed >>> 0;

  function next() {
    // mulberry32
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    next,
    int(min: number, max: number) {
      return Math.floor(next() * (max - min + 1)) + min;
    },
    float(min: number, max: number, precision = 2) {
      const value = next() * (max - min) + min;
      const factor = 10 ** precision;
      return Math.round(value * factor) / factor;
    },
    bool(probability = 0.5) {
      return next() < probability;
    },
    pick<T>(items: readonly T[]): T {
      return items[Math.floor(next() * items.length)];
    },
    weightedPick<T>(items: readonly (readonly [T, number])[]): T {
      const total = items.reduce((sum, [, weight]) => sum + weight, 0);
      let roll = next() * total;
      for (const [item, weight] of items) {
        roll -= weight;
        if (roll <= 0) return item;
      }
      return items[items.length - 1][0];
    },
    shuffle<T>(items: readonly T[]): T[] {
      const copy = [...items];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },
  };
}

export type Rng = ReturnType<typeof createRng>;
