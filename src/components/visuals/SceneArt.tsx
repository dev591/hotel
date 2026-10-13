const GRADIENTS = [
  "linear-gradient(135deg, var(--color-emerald) 0%, var(--color-charcoal) 75%)",
  "linear-gradient(145deg, var(--color-charcoal-soft) 0%, var(--color-emerald) 100%)",
  "linear-gradient(160deg, var(--color-emerald-light) 0%, var(--color-charcoal) 80%)",
  "linear-gradient(120deg, var(--color-charcoal) 0%, var(--color-emerald) 55%, var(--color-charcoal-soft) 100%)",
];

function hashSeed(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

const MOTIFS: Record<string, () => React.ReactNode> = {
  lobby: () => (
    <>
      <ellipse cx="100" cy="150" rx="46" ry="10" />
      <path d="M58 150 V108 Q58 86 100 86 Q142 86 142 108 V150" />
      <line x1="70" y1="108" x2="70" y2="150" />
      <line x1="130" y1="108" x2="130" y2="150" />
      <circle cx="152" cy="60" r="14" />
      <line x1="152" y1="74" x2="152" y2="150" />
    </>
  ),
  room: () => (
    <>
      <rect x="40" y="96" width="120" height="54" rx="6" />
      <path d="M40 112 Q100 100 160 112" />
      <ellipse cx="66" cy="104" rx="14" ry="8" />
      <ellipse cx="100" cy="104" rx="14" ry="8" />
      <rect x="128" y="40" width="48" height="44" rx="2" />
      <line x1="152" y1="40" x2="152" y2="84" />
      <line x1="128" y1="62" x2="176" y2="62" />
    </>
  ),
  twin: () => (
    <>
      <rect x="30" y="100" width="62" height="48" rx="6" />
      <ellipse cx="48" cy="108" rx="10" ry="6" />
      <rect x="108" y="100" width="62" height="48" rx="6" />
      <ellipse cx="126" cy="108" rx="10" ry="6" />
    </>
  ),
  suite: () => (
    <>
      <path d="M40 150 V120 Q40 108 54 108 H146 Q160 108 160 120 V150" />
      <line x1="60" y1="108" x2="60" y2="150" />
      <line x1="140" y1="108" x2="140" y2="150" />
      <circle cx="100" cy="50" r="4" />
      <line x1="100" y1="54" x2="100" y2="70" />
      <line x1="70" y1="70" x2="130" y2="70" />
      <line x1="70" y1="70" x2="60" y2="94" />
      <line x1="130" y1="70" x2="140" y2="94" />
      <line x1="100" y1="70" x2="100" y2="94" />
    </>
  ),
  presidential: () => (
    <>
      <circle cx="100" cy="46" r="3" />
      <line x1="100" y1="49" x2="100" y2="62" />
      {[-60, -30, 0, 30, 60].map((deg) => (
        <line
          key={deg}
          x1="100"
          y1="62"
          x2={100 + 42 * Math.sin((deg * Math.PI) / 180)}
          y2={62 + 42 * Math.cos((deg * Math.PI) / 180)}
        />
      ))}
      <path d="M44 160 Q100 130 156 160" />
    </>
  ),
  pool: () => (
    <>
      <circle cx="150" cy="54" r="18" />
      <path d="M30 110 Q50 98 70 110 T110 110 T150 110 T190 110" />
      <path d="M30 134 Q50 122 70 134 T110 134 T150 134 T190 134" />
      <path d="M30 158 Q50 146 70 158 T110 158 T150 158 T190 158" />
    </>
  ),
  dining: () => (
    <>
      <circle cx="100" cy="110" r="46" />
      <circle cx="100" cy="110" r="20" />
      <line x1="60" y1="60" x2="60" y2="80" />
      <line x1="140" y1="60" x2="140" y2="80" />
    </>
  ),
  skyline: () => (
    <>
      <rect x="30" y="80" width="22" height="80" />
      <rect x="58" y="60" width="26" height="100" />
      <rect x="90" y="96" width="20" height="64" />
      <rect x="116" y="44" width="28" height="116" />
      <rect x="150" y="74" width="22" height="86" />
      <line x1="20" y1="160" x2="180" y2="160" />
    </>
  ),
  garden: () => (
    <>
      <path d="M100 160 V70" />
      <path d="M100 100 Q70 90 60 60" />
      <path d="M100 85 Q130 75 140 50" />
      <path d="M100 130 Q75 122 64 100" />
      <path d="M100 118 Q125 110 136 90" />
    </>
  ),
};

export default function SceneArt({
  token,
  className,
}: {
  token: string;
  className?: string;
}) {
  const hash = hashSeed(token);
  const motifKey = token.split("-")[0];
  const motif = MOTIFS[motifKey] ?? MOTIFS.room;
  const gradient = GRADIENTS[hash % GRADIENTS.length];
  const rotation = ((hash % 7) - 3) * 1.5;
  const scale = 1 + ((hash % 5) - 2) * 0.03;

  return (
    <div
      className={className}
      style={{ background: gradient, position: "relative", overflow: "hidden" }}
    >
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        style={{
          transform: `rotate(${rotation}deg) scale(${scale})`,
        }}
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
        preserveAspectRatio="xMidYMid slice"
      >
        {motif()}
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.06), transparent 60%)",
        }}
      />
    </div>
  );
}
