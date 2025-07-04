"use client";

import { useState, useMemo, useEffect } from "react";
import { formatDate } from "@/utils/formatDate"; // Assumes a util exists

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
}

const ITEMS_PER_PAGE = 10;

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered orders based on search
  const filteredOrders = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return orders;
    return orders.filter((o) =>
      `${o.customerName} ${o.trackingNumber} ${o.productInfo} ${o.courier}`
        .toLowerCase()
        .includes(term)
    );
  }, [search, orders]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const statusColor = {
    pending: "text-yellow-600",
    delivered: "text-green-600",
    cancelled: "text-red-600",
    returned: "text-blue-600",
  } as const;

  return (
    <div>
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search orders..."
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
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
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                  No matching orders found.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((o, index) => (
                <tr key={o.id}>
                  <td className="px-4 py-2">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="px-4 py-2">{o.trackingNumber}</td>
                  <td
                    className={`px-4 py-2 capitalize ${statusColor[o.status]}`}
                  >
                    {o.status}
                  </td>
                  <td className="px-4 py-2">{formatDate(o.date)}</td>
                  <td className="px-4 py-2">{o.address}</td>
                  <td className="px-4 py-2">{o.productInfo}</td>
                  <td className="px-4 py-2">{o.customerName}</td>
                  <td className="px-4 py-2">{o.courier}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
