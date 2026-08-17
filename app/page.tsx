import HeroBg from "@/components/HeroBg";
import Clock from "@/components/Clock";
import ListenerCount from "@/components/ListenerCount";
import SocialLinks from "@/components/SocialLinks";
import ThemePicker from "@/components/ThemePicker";
import InfoButton from "@/components/InfoButton";
import Player from "@/components/Player";
import Disclaimer from "@/components/Disclaimer";

// Grain SVG as a data URI — zero network requests
const grainDataUri =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E\")";

export default function Home() {
  return (
    <main className="relative min-h-dvh flex-col items-center justify-between w-[177vh] sm:w-full pointer-events-none touch-pan-x">
      {/* ── 1. Background layers (double-buffer crossfade) ── */}
      <HeroBg />

      {/* ── 2. Grain overlay ── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -10,
          backgroundImage: grainDataUri,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />

      {/* ── 3. Fixed top row ── */}
      <header
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between pointer-events-auto"
        style={{
          paddingTop: "max(1rem, env(safe-area-inset-top))",
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <Clock />
        <ListenerCount />
        <div className="flex items-center gap-1">
          <SocialLinks />
          <ThemePicker />
          <InfoButton />
        </div>
      </header>

      {/* ── 4. Player ── */}
      <Player />

      {/* ── 5. Disclaimer Popup ── */}
      <Disclaimer />
    </main>
  );
}
