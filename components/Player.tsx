"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { motion, AnimatePresence } from "framer-motion";
import { playlists, Track } from "@/lib/tracks";

// ─── Helpers — module scope ───────────────────────────────────────────────────

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ─── Sub-components — module scope (never define inside a parent component) ───

type TransportProps = {
  playing: boolean;
  onPrev: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  size?: "md" | "lg";
};

function Transport({ playing, onPrev, onPlayPause, onNext, size = "md" }: TransportProps) {
  const playSz = size === "lg" ? "h-[52px] w-[52px]" : "h-10 w-10";
  return (
    <div className="flex items-center gap-1">
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrev}
        aria-label="Previous track"
        className="flex items-center justify-center rounded-full text-white/70 transition-colors"
        style={{ minWidth: 44, minHeight: 44 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
        </svg>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlayPause}
        aria-label={playing ? "Pause" : "Play"}
        className={`${playSz} flex items-center justify-center rounded-full text-white`}
        style={{
          background: "linear-gradient(to bottom, var(--accent), color-mix(in oklch, var(--accent) 70%, black))",
          boxShadow: "0 0 24px color-mix(in oklch, var(--accent) 60%, transparent), 0 2px 4px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.4)",
          minWidth: 44,
          minHeight: 44,
        }}
      >
        {playing ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6zm8-14v14h4V5z" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
        whileTap={{ scale: 0.9 }}
        onClick={onNext}
        aria-label="Next track"
        className="flex items-center justify-center rounded-full text-white/70 transition-colors"
        style={{ minWidth: 44, minHeight: 44 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 18l8.5-6L6 6v12zm2-8.14 5.5 3.64L8 17.14V9.86zM16 6h2v12h-2z" />
        </svg>
      </motion.button>
    </div>
  );
}

type SeekBarProps = {
  progress: number;
  onSeek: (ratio: number) => void;
};

function SeekBar({ progress, onSeek }: SeekBarProps) {
  const railRef = useRef<HTMLDivElement>(null);

  function getRatio(e: React.PointerEvent) {
    if (!railRef.current) return 0;
    const rect = railRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  }

  return (
    <div
      ref={railRef}
      className="group relative flex w-full cursor-pointer items-center touch-none"
      style={{ height: 24 }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onSeek(getRatio(e)); }}
      onPointerMove={(e) => { if (e.buttons !== 1) return; onSeek(getRatio(e)); }}
    >
      <div className="relative h-[3px] w-full rounded-full bg-white/15 overflow-visible">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progress * 100}%`,
            background: "var(--accent)",
            boxShadow: "0 0 8px 1px color-mix(in oklch, var(--accent) 70%, transparent)",
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

// Vinyl ring decoration
type VinylProps = { size: number; playing: boolean };
function Vinyl({ size, playing }: VinylProps) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {/* Decorative grooved ring */}
      <div
        className="absolute inset-0 rounded-full ring-2 ring-white/20 animate-[spin_8s_linear_infinite]"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #2a2a2a, #111 60%, #1a1a1a)",
          animationPlayState: playing ? "running" : "paused",
        }}
      >
        {/* Groove rings */}
        <div className="absolute inset-[15%] rounded-full ring-1 ring-white/5" />
        <div className="absolute inset-[30%] rounded-full ring-1 ring-white/5" />
        <div className="absolute inset-[45%] rounded-full ring-1 ring-white/5" />
      </div>
      {/* Spindle hole */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-3 w-3 rounded-full bg-black/80 ring-2 ring-white/30" />
      </div>
    </div>
  );
}

// ─── Main Player ──────────────────────────────────────────────────────────────

export default function Player() {
  const [playlistIdx, setPlaylistIdx] = useState(0);
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => setMounted(true), []);

  const playlist = playlists[playlistIdx];
  const track: Track = playlist.tracks[trackIdx];

  // Auto-play next track when track changes, if we were already playing
  const wasPlayingRef = useRef(false);
  useEffect(() => {
    wasPlayingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    if (audioRef.current && wasPlayingRef.current) {
      // Play after a tiny delay to ensure src is updated
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(console.warn);
          setPlaying(true);
        }
      }, 50);
    }
  }, [trackIdx, playlistIdx]);

  function handlePlayPause() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.warn);
    }
  }

  function handlePrev() {
    setTrackIdx((i) => (i - 1 + playlist.tracks.length) % playlist.tracks.length);
    setPlaying(true);
  }

  function handleNext() {
    setTrackIdx((i) => (i + 1) % playlist.tracks.length);
    setPlaying(true);
  }

  function handleSeek(ratio: number) {
    if (!audioRef.current) return;
    const dur = audioRef.current.duration;
    if (isFinite(dur)) {
      audioRef.current.currentTime = ratio * dur;
      setProgress(ratio);
      setElapsed(ratio * dur);
    }
  }

  function handlePlaylistChange(idx: number) {
    setPlaylistIdx(idx);
    setTrackIdx(0);
    setProgress(0);
    setElapsed(0);
    setPlaying(true);
  }

  // Audio Native Events
  const onTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
    setElapsed(cur);
    setProgress(dur > 0 ? cur / dur : 0);
  }, []);

  const onLoadedMetadata = useCallback(() => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  }, []);

  const glass =
    "border border-white/10 bg-transparent backdrop-blur-[8px] backdrop-saturate-[1.2]";
  const shadow =
    "inset 0 1px 1px rgba(255,255,255,0.5), inset 0 0 20px rgba(255,255,255,0.15), 0 32px 64px -16px rgba(0,0,0,0.8)";

  const playlistTabs = (
    <div className="flex gap-1.5 mb-1.5 flex-wrap justify-center w-full px-2">
      <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md p-1 rounded-full border border-white/5 shadow-inner">
        {playlists.map((pl, i) => (
          <button
            key={pl.id}
            onClick={() => handlePlaylistChange(i)}
            className={`rounded-full px-3 py-1 text-[9px] uppercase tracking-wider font-semibold transition-all duration-300 ${
              i === playlistIdx ? "text-white shadow-md" : "text-white/40 hover:text-white/80"
            }`}
            style={i === playlistIdx ? { background: "var(--accent)", opacity: 0.9 } : {}}
          >
            {pl.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="hidden"
      />

      {/* ── PILL PLAYER ── */}
      {mounted && (
        <>
          {/* Desktop Draggable Player */}
          <div className="hidden sm:block">
            <Rnd
              default={{
                x: (window.innerWidth - Math.min(380, window.innerWidth - 32)) / 2,
                y: window.innerHeight - 150,
                width: 380,
                height: 'auto',
              }}
              minWidth={350}
              maxWidth={800}
              bounds="window"
              enableResizing={{ right: true, left: true, bottom: false, top: false }}
              dragHandleClassName="drag-handle"
              className="z-20 pointer-events-auto"
            >
              <div className="flex flex-col gap-2 w-full h-full">
                {/* Playlist tabs act as the drag handle */}
                <div className="drag-handle cursor-grab active:cursor-grabbing px-2 w-full">
                  {playlistTabs}
                </div>

                <div
                  className={`flex items-center gap-3 rounded-full p-2 pl-3 pr-4 w-full ${glass}`}
                  style={{ boxShadow: shadow }}
                >
                  <Vinyl size={48} playing={playing} />

                  <div className="flex flex-1 flex-col gap-0.5 min-w-0 py-1 drag-handle cursor-grab active:cursor-grabbing">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-0.5"
                      >
                        <p className="text-[13px] font-semibold text-white truncate leading-tight">{track.title}</p>
                        <p className="text-[11px] text-white/70 truncate">{track.artist}</p>
                      </motion.div>
                    </AnimatePresence>
                    <SeekBar progress={progress} onSeek={handleSeek} />
                    <div className="flex justify-between text-[11.5px] font-mono tracking-widest text-white/60 mt-0.5">
                      <span>{fmt(elapsed)}</span>
                      <span>{fmt(duration)}</span>
                    </div>
                  </div>

                  <Transport playing={playing} onPrev={handlePrev} onPlayPause={handlePlayPause} onNext={handleNext} />
                </div>
              </div>
            </Rnd>
          </div>

          {/* Mobile Docked Player */}
          <div className="sm:hidden fixed bottom-6 left-4 right-4 z-20 pointer-events-auto flex flex-col gap-2">
            <div className="px-2 w-full">{playlistTabs}</div>
            <div
              className={`flex items-center gap-3 rounded-3xl p-2 pl-3 pr-4 w-full ${glass}`}
              style={{ boxShadow: shadow }}
            >
              <Vinyl size={48} playing={playing} />
              <div className="flex flex-1 flex-col gap-0.5 min-w-0 py-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-0.5"
                  >
                    <p className="text-[13px] font-semibold text-white truncate leading-tight">{track.title}</p>
                    <p className="text-[11px] text-white/70 truncate">{track.artist}</p>
                  </motion.div>
                </AnimatePresence>
                <SeekBar progress={progress} onSeek={handleSeek} />
                <div className="flex justify-between text-[11.5px] font-mono tracking-widest text-white/60 mt-0.5">
                  <span>{fmt(elapsed)}</span>
                  <span>{fmt(duration)}</span>
                </div>
              </div>
              <Transport playing={playing} onPrev={handlePrev} onPlayPause={handlePlayPause} onNext={handleNext} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
