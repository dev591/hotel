"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const stats = [
  { value: 18, suffix: "", label: "Years in the harbor district" },
  { value: 42, suffix: "", label: "Rooms & suites" },
  { value: 4.9, suffix: "/5", label: "Average guest rating" },
  { value: 96, suffix: "%", label: "Return guest rate" },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      numberRefs.current.forEach((el, i) => {
        const stat = stats[i];
        const obj = { value: 0 };
        gsap.to(obj, {
          value: stat.value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
          onUpdate: () => {
            el.textContent =
              (Number.isInteger(stat.value)
                ? Math.round(obj.value).toString()
                : obj.value.toFixed(1)) + stat.suffix;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-y border-gold/15 bg-charcoal-soft px-6 py-24 md:px-10"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="text-center">
            <span
              ref={(el) => {
                if (el) numberRefs.current[i] = el;
              }}
              className="font-display block text-4xl text-gold md:text-5xl"
            >
              0
            </span>
            <p className="mt-3 text-sm text-cream/70">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
