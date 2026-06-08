"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Главная",
    exact: true,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
          stroke={active ? "#1d4ed8" : "#94a3b8"}
          strokeWidth="2"
          fill={active ? "rgba(29,78,216,0.12)" : "none"}
          strokeLinejoin="round"
        />
        <path d="M9 21V12h6v9" stroke={active ? "#1d4ed8" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/grammar",
    label: "Грамматика",
    exact: false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="13" height="17" rx="2" stroke={active ? "#1d4ed8" : "#94a3b8"} strokeWidth="2" fill={active ? "rgba(29,78,216,0.1)" : "none"} />
        <path d="M8 8h6M8 12h5M8 16h3" stroke={active ? "#1d4ed8" : "#94a3b8"} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="18" cy="18" r="3" fill={active ? "#1d4ed8" : "#94a3b8"} />
        <path d="M17 18h2M18 17v2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/numbers",
    label: "Числа",
    exact: false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="9" height="9" rx="2" fill={active ? "rgba(29,78,216,0.15)" : "rgba(148,163,184,0.15)"} stroke={active ? "#1d4ed8" : "#94a3b8"} strokeWidth="1.8" />
        <rect x="13" y="4" width="9" height="9" rx="2" fill={active ? "rgba(29,78,216,0.15)" : "rgba(148,163,184,0.15)"} stroke={active ? "#1d4ed8" : "#94a3b8"} strokeWidth="1.8" />
        <rect x="2" y="15" width="9" height="5" rx="2" fill={active ? "rgba(29,78,216,0.15)" : "rgba(148,163,184,0.15)"} stroke={active ? "#1d4ed8" : "#94a3b8"} strokeWidth="1.8" />
        <rect x="13" y="15" width="9" height="5" rx="2" fill={active ? "rgba(29,78,216,0.15)" : "rgba(148,163,184,0.15)"} stroke={active ? "#1d4ed8" : "#94a3b8"} strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    href: "/practice",
    label: "Практика",
    exact: false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill={active ? "#f59e0b" : "none"}
          stroke={active ? "#f59e0b" : "#94a3b8"}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bottom-nav"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(226,232,240,0.8)",
      }}
    >
      <div className="flex items-stretch max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 py-2 gap-1 transition-all duration-200 active:scale-90 relative"
              style={{ minHeight: 56 }}
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: item.href === "/practice" ? "#f59e0b" : "#1d4ed8" }}
                />
              )}
              <span className="flex items-center justify-center w-6 h-6">
                {item.icon(active)}
              </span>
              <span
                className="text-[10px] font-bold leading-tight"
                style={{
                  color: active
                    ? item.href === "/practice" ? "#d97706" : "#1d4ed8"
                    : "#94a3b8",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
