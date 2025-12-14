"use client";

export function BackgroundGradient() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Top slate/blue glow - cool complement to orange */}
      <div
        className="
          absolute
          -top-[200px]
          left-1/2
          -translate-x-1/2
          h-[700px]
          w-[1200px]
          rounded-full
          bg-[rgb(148,163,184)]
          opacity-30
          blur-[120px]
          dark:bg-[rgb(71,85,105)]
          dark:opacity-40
        "
      />

      {/* Bottom orange glow - brand color */}
      <div
        className="
          absolute
          -bottom-[300px]
          left-1/2
          -translate-x-1/2
          h-[700px]
          w-[1200px]
          rounded-full
          bg-[rgb(249,115,22)]
          opacity-40
          blur-[140px]
          dark:opacity-30
        "
      />

      {/* Secondary subtle orange accent - top right */}
      <div
        className="
          absolute
          -top-[100px]
          -right-[200px]
          h-[400px]
          w-[600px]
          rounded-full
          bg-[rgb(251,146,60)]
          opacity-20
          blur-[100px]
          dark:opacity-15
        "
      />

      {/* Subtle white/dark fade overlay for softness */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-transparent dark:from-slate-900/60 dark:via-slate-900/20" />

      {/* Noise texture for premium feel */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
