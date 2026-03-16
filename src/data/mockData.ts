import type { IntakeEntry, VoidingEntry, LeakageEntry, BeverageType, LeakageSize } from '@/types';

// Simple seeded PRNG for deterministic data
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rng = createRng(84842486);

const randInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[randInt(0, arr.length - 1)];

const beverageTypes: BeverageType[] = ['water', 'caffeine', 'soda', 'juice', 'alcohol', 'other'];
const leakageSizes: LeakageSize[] = ['small', 'medium', 'large'];

let idCounter = 0;
const genId = () => `mock-${++idCounter}`;

export const mockIntakeEntries: IntakeEntry[] = [];
export const mockVoidingEntries: VoidingEntry[] = [];
export const mockLeakageEntries: LeakageEntry[] = [];

for (let day = 1; day <= 31; day++) {
  // --- Intake: 4-8 entries, 1500-2500 mL total ---
  const intakeCount = randInt(4, 8);
  const targetTotal = randInt(1500, 2500);
  const rawVolumes = Array.from({ length: intakeCount }, () => randInt(150, 500));
  const rawSum = rawVolumes.reduce((a, b) => a + b, 0);
  const scaledVolumes = rawVolumes.map(v => Math.round((v / rawSum) * targetTotal));

  for (let i = 0; i < intakeCount; i++) {
    const hour = 7 + Math.floor((15 / intakeCount) * i) + randInt(0, 1);
    const minute = randInt(0, 59);
    mockIntakeEntries.push({
      id: genId(),
      type: i === 0 ? 'water' : pick(beverageTypes),
      volume: Math.max(100, scaledVolumes[i]),
      timestamp: new Date(2026, 0, day, hour, minute),
    });
  }

  // --- Voiding: 5-12 daytime, some nights ---
  const voidCount = randInt(5, 12);
  for (let i = 0; i < voidCount; i++) {
    const hour = 7 + Math.floor((15 / voidCount) * i) + randInt(0, 1);
    const minute = randInt(0, 59);
    const hasLeak = rng() < 0.08;
    mockVoidingEntries.push({
      id: genId(),
      volume: randInt(150, 400),
      urgeScale: randInt(1, 5) as 1 | 2 | 3 | 4 | 5,
      isSleep: false,
      hasLeak,
      timestamp: new Date(2026, 0, day, hour, minute),
    });
  }

  // Night voids: ~40% of days get 1-2
  if (rng() < 0.4) {
    const nightCount = randInt(1, 2);
    for (let i = 0; i < nightCount; i++) {
      const hour = pick([23, 0, 1, 2, 3, 4, 5]);
      const nightDay = hour >= 23 ? day : day < 31 ? day + 1 : day;
      mockVoidingEntries.push({
        id: genId(),
        volume: randInt(150, 350),
        urgeScale: randInt(2, 4) as 1 | 2 | 3 | 4 | 5,
        isSleep: true,
        hasLeak: rng() < 0.1,
        timestamp: new Date(2026, 0, nightDay, hour, randInt(0, 59)),
      });
    }
  }

  // --- Leakage: every 2-3 days, 1-3 episodes ---
  if (day % 2 === 0 || (day % 3 === 0 && rng() < 0.6)) {
    const episodes = randInt(1, 3);
    for (let i = 0; i < episodes; i++) {
      const hour = randInt(8, 20);
      mockLeakageEntries.push({
        id: genId(),
        size: pick(leakageSizes),
        timestamp: new Date(2026, 0, day, hour, randInt(0, 59)),
      });
    }
  }
}
