/**
 * Real solar system data — all measurements in kilometers.
 *
 * Scene scale:
 *   SIZE_SCALE  → Earth radius = 0.5 scene units  (factor: 0.5 / 6371)
 *   DIST_SCALE  → Earth orbit  = 100 scene units  (factor: 100 / 149_600_000)
 *
 * This keeps SIZE RATIOS between all planets exactly as in reality.
 * Distances are proportionally compressed by the same relative factor
 * so angular relationships remain visually correct.
 */

export const SIZE_SCALE = 0.5 / 6_371;        // 1 km → scene units (size)
export const DIST_SCALE = 100 / 149_600_000;   // 1 km → scene units (distance)

/** Multiply by this to get display km from scene units (distance) */
export const UNIT_TO_KM = 1 / DIST_SCALE;     // ≈ 1,496,000 km per scene unit

export interface RingSpec {
  innerRatio: number;  // multiplier of planet radius
  outerRatio: number;
  color: number;
  opacity: number;
}

export interface CloudSpec {
  color: number;
  opacity: number;
}

export interface PlanetSpec {
  id: string;
  name: string;
  radiusKm: number;
  orbitKm: number;           // semi-major axis from Sun centre
  orbitalPeriodDays: number;
  color: number;
  roughness: number;
  metalness: number;
  atmosphereColor?: number;
  atmosphereOpacity?: number;
  rings?: RingSpec;
  clouds?: CloudSpec;
}

export const SUN = {
  name: 'Sun',
  radiusKm: 696_342,
  coreColor:   0xFFF5CC,
  coronaColor: 0xFF8C00,
  glowColor:   0xFF4400,
};

export const PLANETS: PlanetSpec[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    radiusKm: 2_440,
    orbitKm: 57_900_000,
    orbitalPeriodDays: 88,
    color: 0x9E9E9E,
    roughness: 0.95,
    metalness: 0.05,
  },
  {
    id: 'venus',
    name: 'Venus',
    radiusKm: 6_052,
    orbitKm: 108_200_000,
    orbitalPeriodDays: 225,
    color: 0xE8C56C,
    roughness: 0.9,
    metalness: 0.0,
    atmosphereColor: 0xFFD07A,
    atmosphereOpacity: 0.38,
  },
  {
    id: 'earth',
    name: 'Earth',
    radiusKm: 6_371,
    orbitKm: 149_600_000,
    orbitalPeriodDays: 365.25,
    color: 0x2E6FAE,
    roughness: 0.75,
    metalness: 0.02,
    atmosphereColor: 0x4BA3F5,
    atmosphereOpacity: 0.2,
    clouds: { color: 0xFFFFFF, opacity: 0.5 },
  },
  {
    id: 'mars',
    name: 'Mars',
    radiusKm: 3_390,
    orbitKm: 227_900_000,
    orbitalPeriodDays: 687,
    color: 0xC1440E,
    roughness: 0.92,
    metalness: 0.0,
    atmosphereColor: 0xD97438,
    atmosphereOpacity: 0.12,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    radiusKm: 71_492,
    orbitKm: 778_500_000,
    orbitalPeriodDays: 4_333,
    color: 0xC88B3A,
    roughness: 0.55,
    metalness: 0.0,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    radiusKm: 60_268,
    orbitKm: 1_432_000_000,
    orbitalPeriodDays: 10_759,
    color: 0xC7A96E,
    roughness: 0.65,
    metalness: 0.0,
    rings: {
      innerRatio: 1.22,
      outerRatio: 2.28,
      color: 0xC9B07A,
      opacity: 0.72,
    },
  },
  {
    id: 'uranus',
    name: 'Uranus',
    radiusKm: 25_559,
    orbitKm: 2_867_000_000,
    orbitalPeriodDays: 30_589,
    color: 0x7DEAEA,
    roughness: 0.4,
    metalness: 0.05,
    atmosphereColor: 0x9EFAFA,
    atmosphereOpacity: 0.22,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    radiusKm: 24_622,
    orbitKm: 4_515_000_000,
    orbitalPeriodDays: 59_800,
    color: 0x2233CC,
    roughness: 0.4,
    metalness: 0.05,
    atmosphereColor: 0x3355FF,
    atmosphereOpacity: 0.22,
  },
];

// Sim time: 1 real second = SIM_DAYS_PER_SECOND Earth days
// This makes Earth's orbit visibly animated over seconds.
export const SIM_DAYS_PER_SECOND = 12;
