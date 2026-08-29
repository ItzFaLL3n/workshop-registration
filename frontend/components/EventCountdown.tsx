"use client";

import { useEffect, useState } from "react";

// Sunday, 7 September 2026, 09:30 IST (kept in sync with the hero + registration copy).
const EVENT_START = new Date("2026-09-07T09:30:00+05:30").getTime();
// Online registration closes two days before the event (end of day IST).
const REG_CLOSE = new Date("2026-09-05T23:59:59+05:30").getTime();

function breakdown(ms: number) {
  const t = Math.max(0, ms);
  return {
    days: Math.floor(t / 86_400_000),
    hours: Math.floor((t % 86_400_000) / 3_600_000),
    minutes: Math.floor((t % 3_600_000) / 60_000),
    seconds: Math.floor((t % 60_000) / 1000),
  };
}

export default function EventCountdown() {
  // null until mounted so the static/prerendered markup and the first client
  // render match (no hydration mismatch); the ticking starts after mount.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const started = now !== null && now >= EVENT_START;
  const regClosed = now !== null && now > REG_CLOSE;
  const parts = now === null ? null : breakdown(EVENT_START - now);

  const units: { value: number; label: string }[] = [
    { value: parts?.days ?? 0, label: "Days" },
    { value: parts?.hours ?? 0, label: "Hrs" },
    { value: parts?.minutes ?? 0, label: "Min" },
    { value: parts?.seconds ?? 0, label: "Sec" },
  ];

  return (
    <div className="event-countdown">
      <div className="event-countdown-head">
        <span className="ec-dot" />
        <span>{started ? "Workshop in progress" : "Workshop starts in"}</span>
      </div>

      {!started && (
        <div className="ec-units" aria-hidden="true">
          {units.map((u) => (
            <div className="ec-unit" key={u.label}>
              <span className="ec-num">
                {parts === null ? "--" : String(u.value).padStart(2, "0")}
              </span>
              <span className="ec-lbl">{u.label}</span>
            </div>
          ))}
        </div>
      )}

      {!started && parts !== null && (
        <span className="sr-only">
          {parts.days} days, {parts.hours} hours until the workshop begins.
        </span>
      )}

      <div className="ec-foot">
        {started ? (
          <>September 7, 2026 &middot; 09:30 AM &ndash; 04:30 PM IST</>
        ) : regClosed ? (
          <>Online registration has closed.</>
        ) : (
          <>Online registration closes <strong>September 5, 2026</strong> &mdash; two days before the event.</>
        )}
      </div>
    </div>
  );
}
