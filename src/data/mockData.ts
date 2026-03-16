import type { IntakeEntry, VoidingEntry, LeakageEntry, BeverageType, LeakageSize, LeakageType } from '@/types';

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
const pick = <T,>(arr: T[]): T => arr[randInt(0, arr.length - 1)];

const beverageTypes: BeverageType[] = ['water', 'caffeine', 'soda', 'juice', 'alcohol', 'other'];
const leakageSizes: LeakageSize[] = ['drops', 'small', 'large'];
const leakageTypes: LeakageType[] = ['stress', 'urge', 'mixed', 'unknown'];

let idCounter = 0;
const genId = () => `mock-${++idCounter}`;

// Use relative dates (today minus N days) so data appears current
const today = new Date();
const daysAgo = (n: number, hour: number, minute: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d;
};

export const mockIntakeEntries: IntakeEntry[] = [];
export const mockVoidingEntries: VoidingEntry[] = [];
export const mockLeakageEntries: LeakageEntry[] = [];

for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
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
      timestamp: daysAgo(dayOffset, hour, minute),
    });
  }

  const voidCount = randInt(5, 10);
  for (let i = 0; i < voidCount; i++) {
    const hour = 7 + Math.floor((15 / voidCount) * i) + randInt(0, 1);
    const minute = randInt(0, 59);
    mockVoidingEntries.push({
      id: genId(),
      volume: randInt(150, 400),
      urgeScale: randInt(0, 4) as 0 | 1 | 2 | 3 | 4,
      isSleep: false,
      hasLeak: rng() < 0.08,
      timestamp: daysAgo(dayOffset, hour, minute),
    });
  }

  if (rng() < 0.4) {
    const nightCount = randInt(1, 2);
    for (let i = 0; i < nightCount; i++) {
      const hour = pick([23, 0, 1, 2, 3, 4, 5]);
      mockVoidingEntries.push({
        id: genId(),
        volume: randInt(150, 350),
        urgeScale: randInt(1, 3) as 0 | 1 | 2 | 3 | 4,
        isSleep: true,
        hasLeak: rng() < 0.1,
        timestamp: daysAgo(dayOffset, hour, randInt(0, 59)),
      });
    }
  }

  if (dayOffset % 2 === 0) {
    const episodes = randInt(1, 2);
    for (let i = 0; i < episodes; i++) {
      const hour = randInt(8, 20);
      mockLeakageEntries.push({
        id: genId(),
        size: pick(leakageSizes),
        activity: pick(['coughing', 'sneezing', 'lifting', 'walking', 'laughing', '']),
        type: pick(leakageTypes),
        padUsed: rng() < 0.3,
        timestamp: daysAgo(dayOffset, hour, randInt(0, 59)),
      });
    }
  }
}
