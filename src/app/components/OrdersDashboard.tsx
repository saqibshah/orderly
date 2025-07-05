"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import OrdersTable, { Order } from "./OrdersTable";
import { ITEMS_PER_PAGE } from "@/config";

const STATUSES = [
  "all",
  "pending",
  "delivered",
  "returned",
  "cancelled",
] as const;
type Status = (typeof STATUSES)[number];

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json() as Promise<{ total: number; items: Order[] }>;
}

export default function OrdersDashboard() {
  const [status, setStatus] = useState<Status>("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");

  // Debounce search
  useEffect(() => {
    const h = setTimeout(() => setQ(search.trim()), 300);
    return () => clearTimeout(h);
  }, [search]);

  // Reset to page 1 when status or search changes
  useEffect(() => {
    setPage(1);
  }, [status, q]);

  // Main data fetch for current status & page
  const mainKey =
    `/api/orders?status=${status}&page=${page}` +
    (q ? `&q=${encodeURIComponent(q)}` : "");
  const { data, isLoading } = useSWR(mainKey, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  // Five hooks for counts (page=1 only)
  const counts: Record<Status, number> = {} as any;
  STATUSES.forEach((s) => {
    const key =
      `/api/orders?status=${s}&page=1` +
      (q ? `&q=${encodeURIComponent(q)}` : "");
    const { data: d } = useSWR(key, fetcher, { revalidateOnFocus: false });
    counts[s] = d?.total ?? 0;
  });

  return (
    <div className="flex h-full">
      {/* Sidebar + Search */}
      <aside className="w-48 bg-gray-100 p-4 space-y-4">
        <input
          type="text"
          placeholder="Search orders…"
          className="w-full px-3 py-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="space-y-2">
          {STATUSES.map((s) => {
            const label = s[0].toUpperCase() + s.slice(1);
            const isActive = status === s;
            return (
              <li key={s}>
                <button
                  onClick={() => setStatus(s)}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-200 ${
                    isActive ? "bg-white shadow font-medium" : ""
                  }`}
                >
                  {label} ({counts[s]})
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">
          {status === "all" ? "All" : status[0].toUpperCase() + status.slice(1)}{" "}
          Orders
        </h1>

        {isLoading && <p>Loading…</p>}

        {data && (
          <>
            <OrdersTable
              orders={data.items}
              startIndex={(page - 1) * ITEMS_PER_PAGE}
            />

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {Math.ceil(data.total / ITEMS_PER_PAGE)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * ITEMS_PER_PAGE >= data.total}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
