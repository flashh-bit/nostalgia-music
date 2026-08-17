"use client";

import { useEffect, useRef, useState } from "react";
import { themes, themeCategories } from "@/lib/themes";
import { useTheme } from "./ThemeContext";

// Prefetch a theme's media on hover/focus
function prefetchTheme(id: string) {
  const t = themes.find((th) => th.id === id);
  if (!t) return;
  if (t.type === 'video') {
    const v = document.createElement('video');
    v.src = t.bgWide;
    v.load();
  } else {
    new Image().src = t.bgWide;
  }
}

// Palette icon
function PaletteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="8.5" cy="14.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="14.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="9" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function ThemePicker() {
  const { themeId, activeTheme, setThemeId, autoRotateInterval, setAutoRotateInterval } = useTheme();
  const [open, setOpen] = useState(false);
  const panelId = "theme-picker-panel";
  const triggerRef = useRef<HTMLButtonElement>(null);
  const desktopPanelRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const intervals = [
    { label: "Off", value: null },
    { label: "15s", value: 15 * 1000 },
    { label: "30s", value: 30 * 1000 },
    { label: "1m", value: 60 * 1000 },
    { label: "5m", value: 5 * 60 * 1000 },
    { label: "15m", value: 15 * 60 * 1000 },
    { label: "1h", value: 60 * 60 * 1000 },
  ];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (
        !desktopPanelRef.current?.contains(e.target as Node) &&
        !mobilePanelRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Trap swipe-down on mobile sheet
  const touchStartY = useRef(0);
  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (dy > 60) setOpen(false);
  }

  // Don't render theme-dependent state until hydrated
  if (themeId === null) {
    return (
      <button className="h-9 w-9 rounded-full flex items-center justify-center text-white/60" disabled aria-label="Theme picker loading" >
        <PaletteIcon />
      </button>
    );
  }

  const renderCategories = () => (
    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto h-full overflow-y-auto pb-24 scrollbar-thin px-4 sm:px-12 pt-8">
      {themeCategories.map(cat => (
        <div key={cat.name} className="flex flex-col gap-4">
          <p className="text-[14px] sm:text-[18px] font-bold uppercase tracking-[0.2em] text-white/60 sticky left-0 pl-2">
            {cat.name}
          </p>
          <div 
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-thin snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cat.themes.map((t) => (
              <div key={t.id} className="snap-start shrink-0 w-[200px] sm:w-[280px]">
                <ThemeSwatch
                  theme={t}
                  active={t.id === activeTheme.id}
                  onSelect={() => { setThemeId(t.id); setOpen(false); }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        ref={triggerRef}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Choose vibe"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-full px-3 text-white/80 transition-all border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white backdrop-blur-md shadow-sm"
      >
        <PaletteIcon />
        <span className="text-xs font-medium uppercase tracking-wider hidden sm:block">Themes</span>
      </button>

      {/* ── Full Screen Gallery Modal ── */}
      {open && (
        <div
          id={panelId}
          ref={desktopPanelRef}
          role="dialog"
          aria-label="Theme gallery"
          className="fixed inset-0 z-[100] flex flex-col bg-black/80 backdrop-blur-3xl backdrop-saturate-150 animate-in fade-in duration-300"
        >
          {/* Header with Close Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:px-12 shrink-0 border-b border-white/5 gap-4">
            <h2 className="text-lg sm:text-2xl font-bold tracking-widest text-white uppercase flex-1">Choose Your Vibe</h2>
            
            {/* Auto-Rotate Controls */}
            <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10 overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <span className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] pl-3 pr-2 whitespace-nowrap">Auto-Rotate:</span>
              {intervals.map(inv => (
                <button
                  key={inv.label}
                  onClick={() => setAutoRotateInterval(inv.value)}
                  className={`px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold transition-all shrink-0 ${autoRotateInterval === inv.value ? "bg-white/20 text-white shadow-sm" : "text-white/40 hover:text-white/80"}`}
                >
                  {inv.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors ml-4 shrink-0"
              aria-label="Close gallery"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            
            {/* Mobile Close Button (Absolute Top Right) */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 flex sm:hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Close gallery"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Scrolling Categories */}
          <div className="flex-1 overflow-hidden relative">
            {renderCategories()}
          </div>
        </div>
      )}
    </div>
  );
}

// Defined at module scope
type SwatchProps = {
  theme: (typeof themes)[number];
  active: boolean;
  onSelect: () => void;
};

function ThemeSwatch({ theme, active, onSelect }: SwatchProps) {
  return (
    <button
      onClick={onSelect}
      onPointerEnter={() => prefetchTheme(theme.id)}
      onFocus={() => prefetchTheme(theme.id)}
      aria-label={`Switch to ${theme.name} theme`}
      aria-pressed={active}
      className="group flex flex-col items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-white/10 w-full"
    >
      {/* Thumbnail */}
      <div
        className="w-full aspect-video rounded-lg overflow-hidden relative"
        style={{
          backgroundColor: theme.fallback,
          outline: active
            ? `2px solid ${theme.accent}`
            : "2px solid rgba(255,255,255,0.1)",
          outlineOffset: "2px",
        }}
      >
        {theme.type === 'video' ? (
          <video 
            src={theme.bgWide} 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${theme.bgWide})` }} 
          />
        )}
      </div>
      <span className="text-[10px] text-white/70 text-center leading-tight group-hover:text-white transition-colors truncate w-full px-1">
        {theme.name}
      </span>
    </button>
  );
}
