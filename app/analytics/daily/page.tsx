import { formatLocalDate } from "@/app/utils/formatLocalDate";
import { prisma } from "@/prisma/client";
import React from "react";

const DailyAnalytics = async () => {
  const todayPK = formatLocalDate(new Date(), "yyyy-MM-dd");

  // Convert that date to UTC start and end of day boundaries
  //   const startOfDayPK = new Date(`${todayPK}T00:00:00+05:00`);
  //   const endOfDayPK = new Date(`${todayPK}T23:59:59.999+05:00`);

  const orders = await prisma.order.findMany({
    // where: {
    //   createdAt: {
    //     gte: startOfDayPK,
    //     lte: endOfDayPK,
    //   },
    // },
    select: { productOrdered: true },
  });

  const totals: Record<string, number> = {};

  for (const o of orders) {
    if (!o.productOrdered) continue;

    // Split items: "Product A * 2, Product B * 1"
    const items = o.productOrdered
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    for (const item of items) {
      const match = item.match(/^(.*)\s\*\s*(\d+)$/);
      if (match) {
        const name = match[1].trim();
        const qty = parseInt(match[2], 10);
        totals[name] = (totals[name] || 0) + qty;
      } else {
        // fallback if no "* qty" pattern found
        totals[item] = (totals[item] || 0) + 1;
      }
    }
  }

  const productList = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        📊 Daily Product Analytics ({todayPK})
      </h2>

      {productList.length === 0 ? (
        <p>No orders found for today.</p>
      ) : (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border-b">Product</th>
              <th className="text-right p-2 border-b">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {productList.map(([name, qty]) => (
              <tr key={name} className="border-b">
                <td className="p-2">{name}</td>
                <td className="p-2 text-right font-medium">{qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DailyAnalytics;
