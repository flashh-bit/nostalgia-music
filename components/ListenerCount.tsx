"use client";

import { useEffect, useState } from "react";

// Simulates a live listener count with subtle drift.
// Wire to a real API by replacing the useEffect body.
export default function ListenerCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Initial count under 100
    setCount(45 + Math.floor(Math.random() * 45));

    let timerId: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      // 5 to 8 times a minute = roughly every 7500ms to 12000ms
      const delay = 7500 + Math.random() * 4500;
      timerId = setTimeout(() => {
        setCount((c) => {
          const current = c ?? 50;
          // drift up or down by 1 to 4
          let next = current + Math.floor(Math.random() * 9) - 4;
          // clamp strictly under 100 and above 10
          if (next >= 100) next = 95;
          if (next <= 10) next = 15;
          return next;
        });
        scheduleNext();
      }, delay);
    }

    scheduleNext();
    return () => clearTimeout(timerId);
  }, []);

  return (
    <div className="flex items-center gap-1.5 select-none">
      {/* pulsing dot */}
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
      </span>
      <span className="text-xs font-medium text-white/80">
        {count === null ? "—" : count.toLocaleString("en-IN")}{" "}
        <span className="text-white/50">listening</span>
      </span>
    </div>
  );
}
