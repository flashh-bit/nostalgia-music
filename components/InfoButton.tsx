"use client";

import { openDisclaimer } from "./Disclaimer";

export default function InfoButton() {
  return (
    <button
      onClick={() => openDisclaimer()}
      aria-label="Disclaimer"
      className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white/80 hover:bg-white/10 hover:text-white transition-colors"
      style={{
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2), 0 2px 10px rgba(0,0,0,0.5)"
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    </button>
  );
}
