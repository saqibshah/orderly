'use client';

export type Order = {
  id: number;
  trackingNumber: string;
  status: 'pending' | 'delivered' | 'cancelled' | 'returned';
  date: string;
  address: string;
  productInfo: string;
  customerName: string;
};

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  // map status to text color
  const statusColor = {
    pending:   'text-yellow-600',
    delivered: 'text-green-600',
    cancelled: 'text-red-600',
    returned:  'text-blue-600',
  } as const;

  return (
    <div className="overflow-auto bg-white rounded shadow">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-100">
          <tr>
            {['#', 'Tracking #', 'Status', 'Date', 'Address', 'Product Info', 'Customer'].map((h) => (
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
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="px-4 py-2 whitespace-nowrap">{o.id}</td>
              <td className="px-4 py-2 whitespace-nowrap">{o.trackingNumber}</td>
              <td className={`px-4 py-2 whitespace-nowrap capitalize ${statusColor[o.status]}`}>
                {o.status}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">{o.date}</td>
              <td className="px-4 py-2">{o.address}</td>
              <td className="px-4 py-2">{o.productInfo}</td>
              <td className="px-4 py-2 whitespace-nowrap">{o.customerName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
