export const AUTO_VEHICLES = [
  "Two-Door Car",
  "Four-Door Sedan",
  "Compact SUV",
  "Full-Size SUV / Minivan",
  "Cargo Van",
  "Pickup Truck",
] as const;

export type AutoVehicle = (typeof AUTO_VEHICLES)[number];

export const AUTO_PACKAGES = [
  {
    value: "Prime Wash",
    label: "Prime Wash",
    hint: "Exterior-only wash & protection",
  },
  {
    value: "Incredible Interior",
    label: "Incredible Interior",
    hint: "Interior-only deep clean",
  },
  {
    value: "Express Detail",
    label: "Express Detail",
    hint: "Interior + exterior detailing",
  },
  {
    value: "Shine & Pristine",
    label: "Shine & Pristine",
    hint: "Deep clean interior & exterior detailing",
  },
] as const;

export type AutoPackage = (typeof AUTO_PACKAGES)[number]["value"];

const packagePrices: Record<
  AutoPackage,
  Record<AutoVehicle, number>
> = {
  "Incredible Interior": {
    "Two-Door Car": 239.99,
    "Four-Door Sedan": 239.99,
    "Compact SUV": 259.99,
    "Full-Size SUV / Minivan": 279.99,
    "Cargo Van": 289.99,
    "Pickup Truck": 279.99,
  },
  "Prime Wash": {
    "Two-Door Car": 81.99,
    "Four-Door Sedan": 81.99,
    "Compact SUV": 89.99,
    "Full-Size SUV / Minivan": 94.99,
    "Cargo Van": 121.99,
    "Pickup Truck": 94.99,
  },
  "Express Detail": {
    "Two-Door Car": 335.99,
    "Four-Door Sedan": 335.99,
    "Compact SUV": 345.99,
    "Full-Size SUV / Minivan": 365.99,
    "Cargo Van": 392.99,
    "Pickup Truck": 355.99,
  },
  "Shine & Pristine": {
    "Two-Door Car": 409.99,
    "Four-Door Sedan": 409.99,
    "Compact SUV": 419.99,
    "Full-Size SUV / Minivan": 443.99,
    "Cargo Van": 490.99,
    "Pickup Truck": 443.99,
  },
};

export const AUTO_EXTRAS: {
  id: string;
  label: string;
  price: number;
  packages: AutoPackage[];
}[] = [
  {
    id: "pet-hair",
    label: "Pet Hair Removal",
    price: 79.99,
    packages: [
      "Incredible Interior",
      "Express Detail",
      "Shine & Pristine",
    ],
  },
  {
    id: "heated-shampoo",
    label: "Heated Shampoo",
    price: 64.97,
    packages: [
      "Incredible Interior",
      "Express Detail",
      "Shine & Pristine",
    ],
  },
  {
    id: "headliner",
    label: "Headliner Cleaning",
    price: 40.98,
    packages: [
      "Incredible Interior",
      "Express Detail",
      "Shine & Pristine",
    ],
  },
  {
    id: "odor",
    label: "Odor Elimination Treatment",
    price: 43.99,
    packages: [
      "Incredible Interior",
      "Express Detail",
      "Shine & Pristine",
    ],
  },
  {
    id: "leather",
    label: "Leather Conditioning Seats",
    price: 52.99,
    packages: [
      "Incredible Interior",
      "Express Detail",
      "Shine & Pristine",
    ],
  },
  {
    id: "undercarriage",
    label: "Undercarriage Treatment",
    price: 35.98,
    packages: ["Prime Wash", "Express Detail", "Shine & Pristine"],
  },
  {
    id: "engine",
    label: "Engine Bay Detail",
    price: 25.98,
    packages: ["Prime Wash", "Express Detail", "Shine & Pristine"],
  },
];

export function getAutoExtrasForPackage(pkg: string) {
  return AUTO_EXTRAS.filter((e) => e.packages.includes(pkg as AutoPackage));
}

export function calculateAutoTotal(
  vehicle: string,
  pkg: string,
  extraIds: string[],
): number {
  const base =
    packagePrices[pkg as AutoPackage]?.[vehicle as AutoVehicle] ?? 0;
  const extrasSum = AUTO_EXTRAS.filter((e) => extraIds.includes(e.id)).reduce(
    (s, e) => s + e.price,
    0,
  );
  return base + extrasSum;
}
