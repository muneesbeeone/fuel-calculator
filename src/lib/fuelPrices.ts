export type FuelType = "Petrol" | "Diesel" | "CNG" | "E20" | "XP95" | "XP100" | "AutoLPG";

export type CityFuelPrices = {
  city: string;
  state?: string;
  prices: Record<FuelType, number>;
  updatedAt: string;
};

// Seed data for major Indian cities. Values are illustrative and should be updated periodically.
const seedPrices: CityFuelPrices[] = [
  {
    city: "Ernakulam",
    state: "Kerala",
    prices: { Petrol: 107.5, Diesel: 96.0, CNG: 78.0, E20: 105.0, XP95: 110.5, XP100: 145.0, AutoLPG: 72.0 },
    updatedAt: "2025-09-01",
  },
  {
    city: "Mumbai",
    state: "Maharashtra",
    prices: { Petrol: 106.3, Diesel: 94.3, CNG: 75.0, E20: 104.0, XP95: 110.0, XP100: 150.0, AutoLPG: 72.0 },
    updatedAt: "2025-09-01",
  },
  {
    city: "Delhi",
    state: "Delhi",
    prices: { Petrol: 96.7, Diesel: 89.6, CNG: 75.0, E20: 94.5, XP95: 101.5, XP100: 134.9, AutoLPG: 71.0 },
    updatedAt: "2025-09-01",
  },
  {
    city: "Bengaluru",
    state: "Karnataka",
    prices: { Petrol: 101.9, Diesel: 87.7, CNG: 74.0, E20: 99.5, XP95: 106.5, XP100: 142.0, AutoLPG: 68.0 },
    updatedAt: "2025-09-01",
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    prices: { Petrol: 102.6, Diesel: 94.2, CNG: 76.0, E20: 100.2, XP95: 108.0, XP100: 146.0, AutoLPG: 70.0 },
    updatedAt: "2025-09-01",
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    prices: { Petrol: 106.0, Diesel: 92.8, CNG: 76.0, E20: 103.5, XP95: 111.5, XP100: 149.0, AutoLPG: 69.0 },
    updatedAt: "2025-09-01",
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    prices: { Petrol: 109.7, Diesel: 97.8, CNG: 92.0, E20: 107.0, XP95: 113.5, XP100: 152.0, AutoLPG: 76.0 },
    updatedAt: "2025-09-01",
  },
];

export function listCities(): CityFuelPrices[] {
  return seedPrices.slice().sort((a, b) => a.city.localeCompare(b.city));
}

export function findCityPrice(cityName?: string, stateName?: string): CityFuelPrices | undefined {
  if (!cityName) return undefined;
  const normalizedCity = cityName.trim().toLowerCase();
  const normalizedState = stateName?.trim().toLowerCase();

  // Try exact city + state match first
  const exact = seedPrices.find((c) => {
    const cCity = c.city.toLowerCase();
    const cState = c.state?.toLowerCase();
    return cCity === normalizedCity && (!normalizedState || cState === normalizedState);
  });
  if (exact) return exact;

  // Fallback: city-only match
  return seedPrices.find((c) => c.city.toLowerCase() === normalizedCity);
}

export function estimateTripCost(
  distanceKm: number,
  mileageKmPerLitreOrKg: number,
  fuelType: FuelType,
  cityPrice: CityFuelPrices
): { cost: number; perKm: number } {
  if (distanceKm <= 0 || mileageKmPerLitreOrKg <= 0) {
    return { cost: 0, perKm: 0 };
  }
  const pricePerUnit = cityPrice.prices[fuelType];
  const litresNeeded = distanceKm / mileageKmPerLitreOrKg;
  const cost = litresNeeded * pricePerUnit;
  return { cost, perKm: cost / distanceKm };
}


