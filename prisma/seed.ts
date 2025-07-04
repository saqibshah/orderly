import { PrismaClient } from "../src/generated/prisma"; // adjust if needed
const prisma = new PrismaClient();

const statuses = ["pending", "delivered", "cancelled", "returned"] as const;
const couriers = ["TCS", "Leopards", "BlueEx", "M&P", "CallCourier"];
const products = [
  "Blue Wallet",
  "Leather Bag",
  "Silver Necklace",
  "Gold Earrings",
  "Canvas Tote",
  "Smart Watch",
  "Brown Belt",
];
const cities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Peshawar",
  "Faisalabad",
  "Multan",
  "Quetta",
];
const names = [
  "Ahmed Khan",
  "Sara Ali",
  "Bilal Siddique",
  "Nida Shah",
  "Usman Tariq",
  "Zoya Riaz",
  "Ali Raza",
];

function getRandom<T extends readonly unknown[]>(arr: T): T[number] {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTrackingNumber(index: number): string {
  return `1Z999AA1012345${(6784 + index).toString().padStart(4, "0")}`;
}

function generateDate(): Date {
  const start = new Date("2025-06-01").getTime();
  const end = new Date("2025-07-04").getTime();
  return new Date(start + Math.random() * (end - start));
}

const mockOrders = Array.from({ length: 100 }, (_, i) => ({
  trackingNumber: generateTrackingNumber(i),
  status: getRandom(statuses),
  date: generateDate(),
  address: `${Math.floor(Math.random() * 100 + 1)} ${getRandom(cities)} Street`,
  productInfo: getRandom(products),
  customerName: getRandom(names),
  courier: getRandom(couriers),
}));

async function main() {
  await prisma.order.createMany({
    data: mockOrders,
  });
}

main()
  .then(() => {
    console.log("✅ 100 mock orders seeded successfully.");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Seed error:", e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
