"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";

const POSTER = "/editorial/ballroom.jpg";
const FILM = "/editorial/ballroom-loop.mp4";
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Full-bleed cover film for the hero. The still is the LCP image; the muted
 * loop crossfades in over it once it can play through. Skipped entirely for
 * visitors who prefer reduced motion.
 */
export function HeroFilm() {
  const [playing, setPlaying] = useState(false);
  // server render + reduced-motion visitors: still only
  const allowMotion = useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(REDUCED).matches,
    () => false
  );

  return (
    <div className="absolute inset-0" aria-hidden>
      <Image
        src={POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {allowMotion && (
        <video
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms]"
          style={{ opacity: playing ? 1 : 0 }}
          src={FILM}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          onPlaying={() => setPlaying(true)}
        />
      )}
    </div>
  );
}
