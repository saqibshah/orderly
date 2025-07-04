"use client";

import { useState, useMemo, useEffect } from "react";

export type Order = {
  id: number;
  trackingNumber: string;
  status: "pending" | "delivered" | "cancelled" | "returned";
  date: string;
  address: string;
  productInfo: string;
  customerName: string;
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
      `${o.customerName} ${o.trackingNumber} ${o.productInfo}`
        .toLowerCase()
        .includes(term)
    );
  }, [search, orders]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  // Orders to show on current page
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage]);

  // Reset to page 1 when search changes
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
        <table className="min-w-full divide-y">
          <thead className="bg-gray-100">
            <tr>
              {[
                "#",
                "Tracking #",
                "Status",
                "Date",
                "Address",
                "Product Info",
                "Customer",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  No matching orders found.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((o, index) => (
                <tr key={o.id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
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
                  <td className="px-4 py-2 whitespace-nowrap">{o.date}</td>
                  <td className="px-4 py-2">{o.address}</td>
                  <td className="px-4 py-2">{o.productInfo}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {o.customerName}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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
