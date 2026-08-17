"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export default function Clock() {
  const [time, setTime] = useState<{ h: string; m: string; period: string } | null>(null);
  const [colonVisible, setColonVisible] = useState(true);

  useEffect(() => {
    function tick() {
      const parts = fmt.formatToParts(new Date());
      const h = parts.find((p) => p.type === "hour")?.value ?? "";
      const m = parts.find((p) => p.type === "minute")?.value ?? "";
      const period = parts.find((p) => p.type === "dayPeriod")?.value ?? "";
      setTime({ h, m, period });
      setColonVisible((v) => !v);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return <div className="w-20" />;

  return (
    <time className="font-sans text-2xl md:text-3xl font-black tabular-nums bg-gradient-to-b from-white to-[var(--accent)] bg-clip-text text-transparent tracking-widest select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] inline-flex items-baseline scale-y-[1.25] origin-left">
      {time.h}
      <span style={{ opacity: colonVisible ? 1 : 0 }} className="transition-opacity duration-100">
        :
      </span>
      {time.m}
      <span className="text-sm font-bold tracking-widest text-white/70 uppercase ml-2 mb-1">{time.period}</span>
    </time>
  );
}
