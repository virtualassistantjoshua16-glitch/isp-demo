export type PackageId =
  | "24hr_unlimited"
  | "3days_8gb"
  | "7days_12gb"
  | "21days_18gb"
  | "30days_unlimited";

export type Package = {
  id: PackageId;
  label: string;
  durationDays: number;
  data: string;
  price: number;
};

export const PACKAGES: Package[] = [
  {
    id: "24hr_unlimited",
    label: "24HR UNLIMITED",
    durationDays: 1,
    data: "UNLIMITED",
    price: 99,
  },
  {
    id: "3days_8gb",
    label: "3 DAYS 8GB",
    durationDays: 3,
    data: "8GB",
    price: 155,
  },
  {
    id: "7days_12gb",
    label: "7 DAYS 12GB",
    durationDays: 7,
    data: "12GB",
    price: 180,
  },
  {
    id: "21days_18gb",
    label: "21 DAYS 18GB",
    durationDays: 21,
    data: "18GB",
    price: 225,
  },
  {
    id: "30days_unlimited",
    label: "30 DAYS UNLIMITED",
    durationDays: 30,
    data: "UNLIMITED",
    price: 400,
  },
];

export const PACKAGES_BY_ID = Object.fromEntries(
  PACKAGES.map((p) => [p.id, p])
) as Record<PackageId, Package>;