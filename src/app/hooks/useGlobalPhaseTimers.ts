// hooks/useGlobalPhaseTimers.ts
import { useEffect, useState } from "react";
import { PHASES, Phase, PHASE_DURATIONS, STORAGE_KEYS } from "../constants";

interface PhaseTimer {
  remainingSeconds: number;
  status: "upcoming" | "active" | "expired";
}

export const useGlobalPhaseTimers = () => {
  const [timers, setTimers] = useState<Record<Phase, PhaseTimer>>({
    gtd: { remainingSeconds: 0, status: "upcoming" },
    fcfs: { remainingSeconds: 0, status: "upcoming" },
    public: { remainingSeconds: 0, status: "upcoming" },
  });

  useEffect(() => {
    let startTime =
      parseInt(localStorage.getItem(STORAGE_KEYS.MINT_START) || "0", 10) || 0;

    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem(STORAGE_KEYS.MINT_START, startTime.toString());
    }

    const updateTimers = () => {
      const now = Date.now();
      let cursor = startTime;
      const newTimers: Record<Phase, PhaseTimer> = {} as Record<
        Phase,
        PhaseTimer
      >;

      (Object.values(PHASES) as Phase[]).forEach((phase) => {
        const duration = PHASE_DURATIONS[phase] * 1000;
        const start = cursor;
        const end = cursor + duration;

        if (now < start) {
          newTimers[phase] = {
            remainingSeconds: Math.floor((start - now) / 1000),
            status: "upcoming",
          };
        } else if (now >= start && now < end) {
          newTimers[phase] = {
            remainingSeconds: Math.floor((end - now) / 1000),
            status: "active",
          };
        } else {
          newTimers[phase] = { remainingSeconds: 0, status: "expired" };
        }

        cursor = end; // next phase starts after this ends
      });

      setTimers(newTimers);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return { timers, formatTime };
};
