"use client";

import { formatDate } from "@/utils/formatDate";

export type OrderStatus = "pending" | "delivered" | "cancelled" | "returned";

export type Order = {
  id: number;
  trackingNumber: string;
  status: OrderStatus;
  date: string; // ISO string from server
  address: string;
  productInfo: string;
  customerName: string;
  courier: string;
};

interface OrdersTableProps {
  orders: Order[];
  /** Number of rows to skip when numbering (e.g. page offset) */
  startIndex?: number;
}

export default function OrdersTable({
  orders,
  startIndex = 0,
}: OrdersTableProps) {
  const statusColor = {
    pending: "text-yellow-600",
    delivered: "text-green-600",
    cancelled: "text-red-600",
    returned: "text-blue-600",
  } as const;

  return (
    <div className="overflow-auto bg-white rounded shadow">
      <table className="min-w-full divide-y text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase">
              #
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase">
              Tracking #
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase">
              Status
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase">
              Date
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase">
              Address
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase">
              Product Info
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase">
              Customer
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase">
              Courier
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                No orders to display.
              </td>
            </tr>
          ) : (
            orders.map((o, idx) => (
              <tr key={o.id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  {startIndex + idx + 1}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {o.trackingNumber}
                </td>
                <td
                  className={`px-4 py-2 whitespace-nowrap capitalize ${
                    statusColor[o.status]
                  }`}
                >
                  {o.status}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {formatDate(o.date)}
                </td>
                <td className="px-4 py-2">{o.address}</td>
                <td className="px-4 py-2">{o.productInfo}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {o.customerName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{o.courier}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
