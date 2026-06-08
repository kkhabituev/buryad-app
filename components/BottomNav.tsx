"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/grammar",
    label: "Грамматика",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 6h16M4 10h10M4 14h12M4 18h8"
          stroke={active ? "#1e3a5f" : "#9b8e7f"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/numbers",
    label: "Числа",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <text x="2" y="18" fontSize="16" fontWeight="700" fill={active ? "#1e3a5f" : "#9b8e7f"}>
          123
        </text>
      </svg>
    ),
  },
  {
    href: "/vocabulary",
    label: "Словарь",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="12" height="16" rx="2" stroke={active ? "#1e3a5f" : "#9b8e7f"} strokeWidth="2" />
        <path d="M8 7h6M8 11h4" stroke={active ? "#1e3a5f" : "#9b8e7f"} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 7h2a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2v-1" stroke={active ? "#1e3a5f" : "#9b8e7f"} strokeWidth="2" />
      </svg>
    ),
  },
  {
    href: "/phrasebook",
    label: "Фразы",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
          stroke={active ? "#1e3a5f" : "#9b8e7f"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav" style={{ background: "white", borderTop: "1px solid #ece7de" }}>
      <div className="flex items-stretch max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 py-2 gap-0.5 transition-all duration-200 active:scale-95"
              style={{ minHeight: 56 }}
            >
              <span className="flex items-center justify-center w-6 h-6">
                {item.icon(active)}
              </span>
              <span
                className="text-[10px] font-semibold leading-tight"
                style={{ color: active ? "#1e3a5f" : "#9b8e7f" }}
              >
                {item.label}
              </span>
              {active && (
                <span
                  className="absolute bottom-0 w-8 h-0.5 rounded-full"
                  style={{ background: "#1e3a5f" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
