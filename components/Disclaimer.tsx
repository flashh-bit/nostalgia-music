"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function openDisclaimer() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-disclaimer"));
  }
}

export default function Disclaimer() {
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device / narrow viewport
    const checkMobile = () => {
      const mobileCheck = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobile(mobileCheck);
    };
    checkMobile();

    // Show on mount for 6 seconds, then fade out
    const timer = setTimeout(() => {
      setVisible(false);
    }, 6000);

    const handleOpen = () => {
      setVisible(true);
      // Auto-close again after 6 seconds when triggered manually
      setTimeout(() => setVisible(false), 6000);
    };

    window.addEventListener("open-disclaimer", handleOpen);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("open-disclaimer", handleOpen);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          {/* Subtle backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto"
            onClick={() => setVisible(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative pointer-events-auto w-full max-w-sm rounded-[24px] p-6 text-center"
            style={{
              background: "linear-gradient(145deg, rgba(30,30,30,0.8), rgba(10,10,10,0.95))",
              boxShadow: "0 24px 48px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.05)"
            }}
          >
            {/* Musical Design Element */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <div className="relative h-12 w-12 rounded-full bg-[#111] border border-white/10 shadow-xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_4s_linear_infinite]" 
                     style={{ background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.1) 25%, transparent 50%, rgba(255,255,255,0.1) 75%, transparent 100%)' }} 
                />
                <div className="h-3 w-3 rounded-full bg-black ring-1 ring-white/20 z-10" />
                <svg className="absolute w-5 h-5 text-white/50 z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            </div>

            <h3 className="text-white/90 text-sm font-bold tracking-widest uppercase mt-4 mb-2">
              Disclaimer
            </h3>
            
            {isMobile && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-[12px] flex items-center justify-center gap-1.5 font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span>Best experienced on a desktop browser!</span>
              </div>
            )}

            <p className="text-white/60 text-[12px] leading-relaxed mb-5">
              All music and visual content belongs to their respective owners. 
              This project is for personal, non-commercial nostalgic purposes only.
            </p>

            <button
              onClick={() => setVisible(false)}
              className="px-6 py-2 rounded-full text-xs font-semibold text-white transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 20px color-mix(in oklch, var(--accent) 50%, transparent)"
              }}
            >
              I Understand
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
