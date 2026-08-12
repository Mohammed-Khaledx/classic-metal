"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Calculator, ReceiptText, Settings } from "lucide-react";

const links = [
  { href: "/", label: "الرئيسية", icon: Calculator },
  { href: "/quotes", label: "العروض", icon: ReceiptText },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid w-full max-w-md grid-cols-3">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors aria-[current=page]:text-foreground"
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-x-4 top-0 h-full rounded-full bg-primary/10"
                  transition={{ type: "spring", bounce: 0.22, duration: 0.55 }}
                />
              )}
              <span
                className={`relative flex h-9 w-14 items-center justify-center rounded-full transition-colors ${
                  active ? "text-primary" : ""
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              </span>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}