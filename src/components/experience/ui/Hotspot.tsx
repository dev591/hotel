"use client";

import { Html } from "@react-three/drei";

export default function Hotspot({
  position,
  label,
  onClick,
  visible,
}: {
  position: [number, number, number];
  label: string;
  onClick: () => void;
  visible: boolean;
}) {
  return (
    <Html position={position} center zIndexRange={[20, 0]}>
      <button
        onClick={onClick}
        tabIndex={visible ? 0 : -1}
        className={`group flex items-center gap-3 transition-all duration-500 ${
          visible ? "pointer-events-auto opacity-100" : "pointer-events-none scale-75 opacity-0"
        }`}
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />
          <span className="relative h-3 w-3 rounded-full border border-cream bg-gold shadow-[0_0_18px_rgba(200,169,106,0.9)]" />
        </span>
        <span className="whitespace-nowrap rounded-full border border-gold/40 bg-charcoal/75 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-cream backdrop-blur-md transition-colors group-hover:border-gold group-hover:text-gold">
          {label}
        </span>
      </button>
    </Html>
  );
}
