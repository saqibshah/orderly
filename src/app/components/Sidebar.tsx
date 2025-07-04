'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'All',        href: '/dashboard/all' },
  { label: 'Pending',    href: '/dashboard/pending' },
  { label: 'Delivered',  href: '/dashboard/delivered' },
  { label: 'Returned',   href: '/dashboard/returned' },
  { label: 'Cancelled',  href: '/dashboard/cancelled' },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <nav className="w-48 bg-gray-100 h-full p-4">
      <ul className="space-y-2">
        {tabs.map((tab) => {
          const isActive = path === tab.href;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`block px-3 py-2 rounded-md hover:bg-gray-200 ${
                  isActive ? 'bg-white shadow font-medium' : ''
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
