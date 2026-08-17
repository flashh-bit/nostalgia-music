"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeContext";

import { Theme } from "@/lib/themes";

// One frame of rAF to allow browser to register the newly written background
// before we flip opacity — prevents the blank-frame flash.
function waitFrame(): Promise<void> {
  return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
}

function preloadMedia(theme: Theme): Promise<void> {
  return new Promise((resolve) => {
    if (theme.type === 'video') {
      const v = document.createElement('video');
      v.oncanplaythrough = v.onerror = () => resolve();
      v.src = theme.bgWide;
      v.load();
    } else {
      const img = new Image();
      img.onload = img.onerror = () => resolve();
      img.src = theme.bgWide;
    }
  });
}

export default function HeroBg() {
  const { themeId, activeTheme } = useTheme();

  const [a, setA] = useState<Theme | null>(activeTheme);
  const [b, setB] = useState<Theme | null>(null);
  const [active, setActive] = useState<"a" | "b">("a");
  const prevThemeId = useRef<string | null>(null);

  useEffect(() => {
    if (themeId === null) return;
    if (prevThemeId.current === themeId) return;
    prevThemeId.current = themeId;

    (async () => {
      // Write into the inactive layer first, then wait for decode, then flip
      await preloadMedia(activeTheme);
      if (active === "a") {
        setB(activeTheme);
        await waitFrame();
        setActive("b");
      } else {
        setA(activeTheme);
        await waitFrame();
        setActive("a");
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeId]);

  const renderLayer = (layer: Theme | null, id: "a" | "b") => {
    if (!layer) return null;
    const isVisible = active === id;
    
    if (layer.type === 'video') {
      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`hero-bg object-cover ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundColor: layer.fallback }}
          src={layer.bgWide}
          aria-hidden
        />
      );
    }
    
    return (
      <div
        className={`hero-bg ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: `url(${layer.bgWide})`,
          backgroundColor: layer.fallback,
        }}
        aria-hidden
      />
    );
  };

  // Center the horizontal scroll on mount (for mobile portrait view)
  useEffect(() => {
    const center = (document.body.scrollWidth - window.innerWidth) / 2;
    if (center > 0) window.scrollTo({ left: center });
  }, []);

  return (
    <>
      <svg width="0" height="0" className="hidden absolute pointer-events-none">
        <filter id="chromatic-aberration" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" in="SourceGraphic" result="red" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" in="SourceGraphic" result="green" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" in="SourceGraphic" result="blue" />
          <feOffset in="red" dx="6" dy="0" result="red-shifted" />
          <feOffset in="blue" dx="-6" dy="0" result="blue-shifted" />
          <feBlend mode="screen" in="red-shifted" in2="green" result="rg" />
          <feBlend mode="screen" in="rg" in2="blue-shifted" result="rgb" />
        </filter>
      </svg>

      <div className="absolute inset-0 -z-20 w-full h-full pointer-events-auto">
        {/* Crisp Base Layers */}
        {renderLayer(a, "a")}
        {renderLayer(b, "b")}
      </div>

      {/* Screen-Space Aberration Overlay (Applies dynamically to whatever scrolls behind it) */}
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backdropFilter: "url(#chromatic-aberration)",
          WebkitBackdropFilter: "url(#chromatic-aberration)",
          maskImage: "radial-gradient(circle at center, transparent 40%, black 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, transparent 40%, black 100%)",
        }}
        aria-hidden
      />

      {/* Lens Distortion & Vignette Overlay */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 70%, rgba(0,0,0,0.8) 100%),
            radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.65) 110%)
          `,
          boxShadow: "inset 0 0 80px 20px rgba(0,0,0,0.8)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          maskImage: "radial-gradient(circle at center, transparent 40%, black 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, transparent 40%, black 100%)"
        }}
        aria-hidden
      />
    </>
  );
}
