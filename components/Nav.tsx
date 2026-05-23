"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/links", label: "Links" },
  { href: "/submit", label: "Submit" },
  { href: "/creative", label: "Creative" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-6 md:px-12 lg:px-20 pt-6 md:pt-8 flex items-center justify-between pointer-events-none">
      <Link
        href="/"
        className={`pointer-events-auto font-display font-light text-[15px] md:text-[17px] tracking-[-0.01em] text-foreground transition-opacity duration-300 hover:opacity-60 ${
          isHome ? "opacity-0 pointer-events-none" : ""
        }`}
        aria-hidden={isHome}
        tabIndex={isHome ? -1 : 0}
      >
        Riss Creative
      </Link>
      <div className="pointer-events-auto flex gap-5 md:gap-6 font-sans text-[12px] md:text-[13px]">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const isSubmit = item.href === "/submit";
          const base = isSubmit ? "text-foreground" : "text-muted";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-opacity duration-300 hover:opacity-60 hover:text-foreground ${
                active ? "text-foreground" : base
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
