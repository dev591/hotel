"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SceneArt from "@/components/visuals/SceneArt";

const stops = [
  {
    label: "01 — Arrival",
    title: "The Lobby",
    copy: "Brushed brass, low light, and the quiet hum of a piano in the corner — the first breath of Aurelia.",
    token: "lobby-journey",
  },
  {
    label: "02 — Rest",
    title: "The Rooms",
    copy: "Linen you sink into, blackout calm, and windows framed for the skyline or the gardens below.",
    token: "room-journey",
  },
  {
    label: "03 — Unwind",
    title: "The Rooftop",
    copy: "A sunken pool deck that catches the last light of the day, every single day.",
    token: "pool-journey",
  },
  {
    label: "04 — Gather",
    title: "The Table",
    copy: "Seasonal, unfussy plates served in a dining room built for long, slow evenings.",
    token: "dining-journey",
  },
];

export default function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      panelsRef.current.forEach((panel, i) => {
        if (i === 0) return;
        gsap.set(panel, { yPercent: 100 });
      });

      const panels = panelsRef.current;
      panels.forEach((panel, i) => {
        if (i === panels.length - 1) return;
        gsap.to(panels[i + 1], {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: () => `top+=${i * window.innerHeight} top`,
            end: () => `top+=${(i + 1) * window.innerHeight} top`,
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${stops.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {stops.map((stop, i) => (
          <div
            key={stop.title}
            ref={(el) => {
              if (el) panelsRef.current[i] = el;
            }}
            className="absolute inset-0"
          >
            <SceneArt token={stop.token} className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-charcoal/10" />
            <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-20 md:px-16 md:pb-28">
              <p className="text-xs uppercase tracking-[0.35em] text-gold">
                {stop.label}
              </p>
              <h2 className="font-display mt-4 text-4xl text-cream md:text-6xl">
                {stop.title}
              </h2>
              <p className="mt-4 max-w-md text-cream/75">{stop.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
