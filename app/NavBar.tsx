"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import classnames from "classnames";
import { Button, Flex } from "@radix-ui/themes";

const NavBar = () => {
  const currentPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Orders", href: "/orders" },
  ];

  return (
    <nav className="border-b px-5 py-3">
      <Flex justify="between" align="center">
        <Flex align="center" gap="3">
          <Link href="/">Orderly</Link>
          <ul className="flex space-x-6">
            {links.map((link) => (
              <Link
                key={link.href}
                className={classnames({
                  "text-zinc-900": link.href === currentPath,
                  "text-zinc-500": link.href !== currentPath,
                  "hover:text-zinc-800 transition-colors": true,
                })}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </ul>
        </Flex>
        <Flex align="center" gap="3">
          <Button>
            <Link href="/verify-return">Verify Return</Link>
          </Button>
        </Flex>
      </Flex>
    </nav>

    // <nav className="flex space-x-6 border-b px-5 h-14 items-center">
    //   <Link href="/">Logo</Link>
    //   <ul className="flex space-x-6">
    //     {links.map((link) => (
    //       <Link
    //         key={link.href}
    //         className={classnames({
    //           "text-zinc-900": link.href === currentPath,
    //           "text-zinc-500": link.href !== currentPath,
    //           "hover:text-zinc-800 transition-colors": true,
    //         })}
    //         href={link.href}
    //       >
    //         {link.label}
    //       </Link>
    //     ))}
    //   </ul>
    // </nav>
  );
};

export default NavBar;
