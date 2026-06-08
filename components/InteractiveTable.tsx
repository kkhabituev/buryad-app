"use client";

import { useState } from "react";

interface Column {
  key: string;
  label: string;
  isBuryat?: boolean;
}

interface InteractiveTableProps {
  columns: Column[];
  rows: Record<string, string>[];
  highlightNote?: (row: Record<string, string>) => string | undefined;
}

export default function InteractiveTable({ columns, rows, highlightNote }: InteractiveTableProps) {
  const [activeCell, setActiveCell] = useState<{ row: number; col: string } | null>(null);

  const handleCellClick = (rowIdx: number, col: string) => {
    if (activeCell?.row === rowIdx && activeCell?.col === col) {
      setActiveCell(null);
    } else {
      setActiveCell({ row: rowIdx, col });
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden card-shadow border" style={{ borderColor: "#e8e0d5" }}>
      {/* Header */}
      <div className="grid" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)`, background: "#1e3a5f" }}>
        {columns.map((col) => (
          <div
            key={col.key}
            className="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="grid border-t"
          style={{
            gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
            borderColor: "#e8e0d5",
            background: rowIdx % 2 === 0 ? "white" : "#faf8f4",
          }}
        >
          {columns.map((col) => {
            const isActive = activeCell?.row === rowIdx && activeCell?.col === col.key;
            const note = highlightNote?.(row);
            return (
              <div
                key={col.key}
                onClick={() => handleCellClick(rowIdx, col.key)}
                className="px-3 py-3 text-center cursor-pointer transition-all duration-200 select-none border-r last:border-r-0"
                style={{
                  borderColor: "#e8e0d5",
                  background: isActive ? "#f5e6d3" : undefined,
                  borderLeft: isActive ? "2px solid #c9853a" : undefined,
                }}
              >
                <span
                  className={`block text-sm leading-snug ${isActive ? "font-bold" : "font-medium"} ${
                    col.isBuryat ? "text-base" : ""
                  }`}
                  style={{
                    color: col.isBuryat
                      ? isActive
                        ? "#c9853a"
                        : "#1e3a5f"
                      : isActive
                      ? "#8b5a1f"
                      : "#4a3728",
                    fontFamily: col.isBuryat ? '"Nunito", sans-serif' : undefined,
                    fontWeight: col.isBuryat ? 700 : 500,
                  }}
                >
                  {row[col.key] || "—"}
                </span>
                {isActive && note && (
                  <span className="block text-xs mt-1 font-normal italic" style={{ color: "#9b7040" }}>
                    {note}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
