export type FuelType = "Petrol" | "Diesel" | "CNG" | "E20" | "XP95" | "XP100" | "AutoLPG";

export type CityPriceInfo = {
  city: string;
  state: string;
  prices: Record<FuelType, number>;
  updatedAt: string;
};

// This data is illustrative. For a real application, fetch this from a live API.
const fuelPrices: CityPriceInfo[] = [
  { city: "Ernakulam", state: "Kerala", prices: { Petrol: 107.5, Diesel: 96, CNG: 78, E20: 105, XP95: 110.5, XP100: 145, AutoLPG: 72 }, updatedAt: "2025-09-01" },
  { city: "Mumbai", state: "Maharashtra", prices: { Petrol: 106.3, Diesel: 94.3, CNG: 75, E20: 104, XP95: 110, XP100: 150, AutoLPG: 72 }, updatedAt: "2025-09-01" },
  { city: "Delhi", state: "Delhi", prices: { Petrol: 96.7, Diesel: 89.6, CNG: 75, E20: 94.5, XP95: 101.5, XP100: 134.9, AutoLPG: 71 }, updatedAt: "2025-09-01" },
  { city: "Bengaluru", state: "Karnataka", prices: { Petrol: 101.9, Diesel: 87.7, CNG: 74, E20: 99.5, XP95: 106.5, XP100: 142, AutoLPG: 68 }, updatedAt: "2025-09-01" },
  { city: "Chennai", state: "Tamil Nadu", prices: { Petrol: 102.6, Diesel: 94.2, CNG: 76, E20: 100.2, XP95: 108, XP100: 146, AutoLPG: 70 }, updatedAt: "2025-09-01" },
  { city: "Kolkata", state: "West Bengal", prices: { Petrol: 106, Diesel: 92.8, CNG: 76, E20: 103.5, XP95: 111.5, XP100: 149, AutoLPG: 69 }, updatedAt: "2025-09-01" },
  { city: "Hyderabad", state: "Telangana", prices: { Petrol: 109.7, Diesel: 97.8, CNG: 92, E20: 107, XP95: 113.5, XP100: 152, AutoLPG: 76 }, updatedAt: "2025-09-01" },
  // New cities added below
  { city: "Pune", state: "Maharashtra", prices: { Petrol: 106.0, Diesel: 94.0, CNG: 76, E20: 103.8, XP95: 110.2, XP100: 150.5, AutoLPG: 71.5 }, updatedAt: "2025-09-01" },
  { city: "Ahmedabad", state: "Gujarat", prices: { Petrol: 96.5, Diesel: 92.2, CNG: 74.5, E20: 94.3, XP95: 101.0, XP100: 135.0, AutoLPG: 68.0 }, updatedAt: "2025-09-01" },
  { city: "Jaipur", state: "Rajasthan", prices: { Petrol: 108.5, Diesel: 93.7, CNG: 80, E20: 106.0, XP95: 112.5, XP100: 155.0, AutoLPG: 73.0 }, updatedAt: "2025-09-01" },
  { city: "Lucknow", state: "Uttar Pradesh", prices: { Petrol: 96.6, Diesel: 89.8, CNG: 82, E20: 94.4, XP95: 101.8, XP100: 138.0, AutoLPG: 74.0 }, updatedAt: "2025-09-01" },
  { city: "Chandigarh", state: "Chandigarh", prices: { Petrol: 96.2, Diesel: 84.3, CNG: 89, E20: 94.0, XP95: 100.5, XP100: 132.0, AutoLPG: 65.0 }, updatedAt: "2025-09-01" },
];

/** Returns a sorted list of all available cities. */
export function listCities(): CityPriceInfo[] {
  // Return a copy to prevent mutation of the original array
  return fuelPrices.slice().sort((a, b) => a.city.localeCompare(b.city));
}

/** Finds fuel price data for a given city. */
export function findCityPrice(city?: string, state?: string): CityPriceInfo | undefined {
  if (!city) return undefined;
  const cityName = city.trim().toLowerCase();
  const stateName = state?.trim().toLowerCase();

  // First, try to match city and state for better accuracy
  const exactMatch = fuelPrices.find(p => {
    const pCity = p.city.toLowerCase();
    const pState = p.state?.toLowerCase();
    return pCity === cityName && (!stateName || pState === stateName);
  });
  if (exactMatch) return exactMatch;

  // Fallback to matching city name only
  return fuelPrices.find(p => p.city.toLowerCase() === cityName);
}

/** Estimates the total trip cost. */
export function estimateTripCost(distanceKm: number, mileage: number, fuelType: FuelType, cityPrice: CityPriceInfo) {
  if (distanceKm <= 0 || mileage <= 0) return { cost: 0, perKm: 0 };
  const pricePerUnit = cityPrice.prices[fuelType];
  if (pricePerUnit === undefined) return { cost: 0, perKm: 0 };
  const cost = (distanceKm / mileage) * pricePerUnit;
  return { cost, perKm: cost / distanceKm };
}