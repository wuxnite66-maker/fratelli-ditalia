"use client";

import { useEffect, useState } from "react";
import { HOURS } from "@/data/site";

export type OpenStatus = { open: boolean; label: string };

const toMin = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};

/** Live open/closed status computed from the real opening hours. */
export function useOpenStatus(): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const today = HOURS.find((h) => h.day === now.getDay());
      const minutes = now.getHours() * 60 + now.getMinutes();

      if (today?.slots) {
        for (const slot of today.slots) {
          if (minutes >= toMin(slot.open) && minutes < toMin(slot.close)) {
            setStatus({
              open: true,
              label: `Jetzt geöffnet · bis ${slot.close} Uhr`,
            });
            return;
          }
        }
        const next = today.slots.find((s) => minutes < toMin(s.open));
        if (next) {
          setStatus({
            open: false,
            label: `Öffnet heute um ${next.open} Uhr`,
          });
          return;
        }
      }
      // find next open day
      for (let i = 1; i <= 7; i++) {
        const d = (now.getDay() + i) % 7;
        const day = HOURS.find((h) => h.day === d);
        if (day?.slots) {
          setStatus({
            open: false,
            label: `Öffnet ${i === 1 ? "morgen" : day.label} um ${day.slots[0].open} Uhr`,
          });
          return;
        }
      }
      setStatus({ open: false, label: "Derzeit geschlossen" });
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  return status;
}
