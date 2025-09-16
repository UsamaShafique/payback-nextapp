// "use client";

// import { useEffect, useState } from "react";
// import { PHASES, Phase, PHASE_DURATIONS, STORAGE_KEYS } from "../constants";
// import { usePhaseMintedCount, usePhaseMaxSupply } from "./usePhaseMintedCount";

// interface PhaseData {
//   minted: number;
//   maxSupply: number;
//   effectiveSupply: number;
//   remainingSeconds: number;
//   status: "upcoming" | "active" | "expired";
// }

// export const useGlobalPhaseState = () => {
//   const [phases, setPhases] = useState<Record<Phase, PhaseData>>({
//     gtd: {
//       minted: 0,
//       maxSupply: 0,
//       effectiveSupply: 0,
//       remainingSeconds: 0,
//       status: "upcoming",
//     },
//     fcfs: {
//       minted: 0,
//       maxSupply: 0,
//       effectiveSupply: 0,
//       remainingSeconds: 0,
//       status: "upcoming",
//     },
//     public: {
//       minted: 0,
//       maxSupply: 0,
//       effectiveSupply: 0,
//       remainingSeconds: 0,
//       status: "upcoming",
//     },
//   });

//   const gtd = usePhaseMintedCount("gtd");
//   const fcfs = usePhaseMintedCount("fcfs");
//   const pub = usePhaseMintedCount("public");

//   const gtdMax = usePhaseMaxSupply("gtd");
//   const fcfsMax = usePhaseMaxSupply("fcfs");
//   const pubMax = usePhaseMaxSupply("public");

//   useEffect(() => {
//     let startTime =
//       parseInt(localStorage.getItem(STORAGE_KEYS.MINT_START) || "0", 10) ||
//       Date.now();
//     localStorage.setItem(STORAGE_KEYS.MINT_START, startTime.toString());

//     const updatePhases = () => {
//       const now = Date.now();
//       let cursor = startTime;

//       const newData: Record<Phase, PhaseData> = {} as Record<Phase, PhaseData>;

//       const initial: Record<Phase, { minted: number; maxSupply: number }> = {
//         gtd: { minted: gtd.phaseMinted, maxSupply: gtdMax.phaseMaxSupply },
//         fcfs: { minted: fcfs.phaseMinted, maxSupply: fcfsMax.phaseMaxSupply },
//         public: { minted: pub.phaseMinted, maxSupply: pubMax.phaseMaxSupply },
//       };

//       (Object.values(PHASES) as Phase[]).forEach((phase) => {
//         const duration = PHASE_DURATIONS[phase] * 1000;
//         const start = cursor;
//         const end = cursor + duration;

//         let status: PhaseData["status"] =
//           now < start ? "upcoming" : now < end ? "active" : "expired";
//         const remainingSeconds =
//           status === "upcoming"
//             ? Math.floor((start - now) / 1000)
//             : status === "active"
//               ? Math.floor((end - now) / 1000)
//               : 0;

//         newData[phase] = {
//           minted: initial[phase].minted,
//           maxSupply: initial[phase].maxSupply,
//           effectiveSupply: initial[phase].maxSupply,
//           remainingSeconds,
//           status,
//         };

//         cursor = end;
//       });

//       const gtdLeftover = Math.max(
//         0,
//         newData.gtd.maxSupply - newData.gtd.minted
//       );
//       newData.fcfs.effectiveSupply += gtdLeftover;

//       const totalPublicMax = pubMax.phaseMaxSupply;
//       newData.public.effectiveSupply = Math.max(
//         0,
//         totalPublicMax - (newData.gtd.minted + newData.fcfs.minted + newData.public.minted)
//       );

//       setPhases(newData);
//     };

//     updatePhases();
//     const interval = setInterval(updatePhases, 1000);
//     return () => clearInterval(interval);
//   }, [
//     gtd.phaseMinted,
//     fcfs.phaseMinted,
//     pub.phaseMinted,
//     gtdMax.phaseMaxSupply,
//     fcfsMax.phaseMaxSupply,
//     pubMax.phaseMaxSupply,
//   ]);

//   const formatTime = (seconds: number) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };

//   return { phases, formatTime };
// };

// "use client";

// import { useEffect, useState } from "react";
// import { PHASES, Phase, PHASE_DURATIONS, STORAGE_KEYS } from "../constants";
// import { usePhaseMintedCount, usePhaseMaxSupply } from "./usePhaseMintedCount";

// interface PhaseData {
//   minted: number;
//   maxSupply: number;
//   effectiveSupply: number;
//   remainingSeconds: number;
//   status: "upcoming" | "active" | "expired";
// }

// export const useGlobalPhaseState = () => {
//   const [phases, setPhases] = useState<Record<Phase, PhaseData>>({
//     gtd: {
//       minted: 0,
//       maxSupply: 0,
//       effectiveSupply: 0,
//       remainingSeconds: 0,
//       status: "upcoming",
//     },
//     fcfs: {
//       minted: 0,
//       maxSupply: 0,
//       effectiveSupply: 0,
//       remainingSeconds: 0,
//       status: "upcoming",
//     },
//     public: {
//       minted: 0,
//       maxSupply: 0,
//       effectiveSupply: 0,
//       remainingSeconds: 0,
//       status: "upcoming",
//     },
//   });

//   const gtd = usePhaseMintedCount("gtd");
//   const fcfs = usePhaseMintedCount("fcfs");
//   const pub = usePhaseMintedCount("public");

//   const gtdMax = usePhaseMaxSupply("gtd");
//   const fcfsMax = usePhaseMaxSupply("fcfs");
//   const pubMax = usePhaseMaxSupply("public");

//   useEffect(() => {
//     let startTime =
//       parseInt(localStorage.getItem(STORAGE_KEYS.MINT_START) || "0", 10) ||
//       Date.now();
//     localStorage.setItem(STORAGE_KEYS.MINT_START, startTime.toString());

//     const updatePhases = () => {
//       const now = Date.now();
//       let cursor = startTime;

//       const newData: Record<Phase, PhaseData> = {} as Record<Phase, PhaseData>;

//       const phaseInfo: Record<Phase, { minted: number; maxSupply: number }> = {
//         gtd: { minted: gtd.phaseMinted, maxSupply: gtdMax.phaseMaxSupply },
//         fcfs: { minted: fcfs.phaseMinted, maxSupply: fcfsMax.phaseMaxSupply },
//         public: { minted: pub.phaseMinted, maxSupply: pubMax.phaseMaxSupply },
//       };

//       const phaseOrder: Phase[] = ["gtd", "fcfs", "public"];
//       const phaseTimings: Record<Phase, { start: number; end: number }> = {} as any;

//       phaseOrder.forEach((phase) => {
//         const duration = PHASE_DURATIONS[phase] * 1000;
//         const start = cursor;
//         const end = cursor + duration;

//         phaseTimings[phase] = { start, end };

//         let status: PhaseData["status"] =
//           now < start ? "upcoming" : now < end ? "active" : "expired";

//         const remainingSeconds =
//           status === "upcoming"
//             ? Math.floor((start - now) / 1000)
//             : status === "active"
//               ? Math.floor((end - now) / 1000)
//               : 0;

//         newData[phase] = {
//           minted: phaseInfo[phase].minted,
//           maxSupply: phaseInfo[phase].maxSupply,
//           effectiveSupply: phaseInfo[phase].maxSupply, // Initial value, will be adjusted below
//           remainingSeconds,
//           status,
//         };

//         cursor = end;
//       });

//       newData.gtd.effectiveSupply = newData.gtd.maxSupply;

//       if (newData.gtd.status === "expired") {
//         const gtdLeftover = Math.max(0, newData.gtd.maxSupply - newData.gtd.minted);
//         newData.fcfs.effectiveSupply = newData.fcfs.maxSupply + gtdLeftover;
//       } else {
//         newData.fcfs.effectiveSupply = newData.fcfs.maxSupply;
//       }

//       if (newData.gtd.status === "expired" && newData.fcfs.status === "expired") {
//         const gtdLeftover = Math.max(0, newData.gtd.maxSupply - newData.gtd.minted);
//         const fcfsLeftover = Math.max(0, (newData.fcfs.maxSupply + gtdLeftover) - newData.fcfs.minted);
//         newData.public.effectiveSupply =  newData.public.maxSupply + fcfsLeftover;
//       } else {
//         newData.public.effectiveSupply = newData.public.maxSupply;
//       }

//       setPhases(newData);
//     };

//     updatePhases();
//     const interval = setInterval(updatePhases, 1000);
//     return () => clearInterval(interval);
//   }, [
//     gtd.phaseMinted,
//     fcfs.phaseMinted,
//     pub.phaseMinted,
//     gtdMax.phaseMaxSupply,
//     fcfsMax.phaseMaxSupply,
//     pubMax.phaseMaxSupply,
//   ]);

//   const formatTime = (seconds: number) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };

//   return { phases, formatTime };
// };

"use client";

import { useEffect, useState } from "react";
import {
  TOTAL_COLLECTION_SIZE,
  Phase,
  PHASE_DURATIONS,
  STORAGE_KEYS,
} from "../constants";
import {
  usePhaseMintedCount,
  usePhaseMaxSupply,
} from "./usePhaseMintedCount";
import { useNftSupply } from "./useReadContract";

interface PhaseData {
  minted: number;
  maxSupply: number;
  effectiveSupply: number;
  remainingSeconds: number;
  status: "upcoming" | "active" | "expired";
}

export const useGlobalPhaseState = () => {
  const [phases, setPhases] = useState<Record<Phase, PhaseData>>({
    gtd: {
      minted: 0,
      maxSupply: 0,
      effectiveSupply: 0,
      remainingSeconds: 0,
      status: "upcoming",
    },
    fcfs: {
      minted: 0,
      maxSupply: 0,
      effectiveSupply: 0,
      remainingSeconds: 0,
      status: "upcoming",
    },
    public: {
      minted: 0,
      maxSupply: 0,
      effectiveSupply: 0,
      remainingSeconds: 0,
      status: "upcoming",
    },
  });

  const gtd = usePhaseMintedCount("gtd");
  const fcfs = usePhaseMintedCount("fcfs");
  const pub = usePhaseMintedCount("public");
  const gtdMax = usePhaseMaxSupply("gtd");
  const fcfsMax = usePhaseMaxSupply("fcfs");
  const pubMax = usePhaseMaxSupply("public");
  const { totalSupply } = useNftSupply();

  useEffect(() => {
    const mintStartTime = localStorage.getItem(STORAGE_KEYS.MINT_START);
    const startTime = mintStartTime ? parseInt(mintStartTime, 10) : Date.now();
    if (!mintStartTime) {
      localStorage.setItem(STORAGE_KEYS.MINT_START, startTime.toString());
    }

    const updatePhases = () => {
      const now = Date.now();
      let cursor = startTime;
      const newData: Record<Phase, PhaseData> = {} as Record<Phase, PhaseData>;

      const phaseOrder: Phase[] = ["gtd", "fcfs", "public"];
      
      phaseOrder.forEach((phase) => {
        const duration = PHASE_DURATIONS[phase] * 1000;
        const start = cursor;
        const end = cursor + duration;

        const status = now < start ? "upcoming" : now < end ? "active" : "expired";
        const remainingSeconds = status === "upcoming" ? Math.floor((start - now) / 1000) : status === "active" ? Math.floor((end - now) / 1000) : 0;

        newData[phase] = {
          minted: 0,
          maxSupply: 0,
          effectiveSupply: 0,
          remainingSeconds,
          status,
        };
        cursor = end;
      });

      // Update minted and max supply from on-chain data
      newData.gtd.minted = gtd.phaseMinted;
      newData.gtd.maxSupply = gtdMax.phaseMaxSupply;
      newData.fcfs.minted = fcfs.phaseMinted;
      newData.fcfs.maxSupply = fcfsMax.phaseMaxSupply;
      newData.public.minted = pub.phaseMinted;
      newData.public.maxSupply = pubMax.phaseMaxSupply;

      // Apply carry-over logic for GTD and FCFS
      newData.gtd.effectiveSupply = newData.gtd.maxSupply;
      if (newData.gtd.status === "expired") {
        const gtdLeftover = Math.max(0, newData.gtd.maxSupply - newData.gtd.minted);
        newData.fcfs.effectiveSupply = newData.fcfs.maxSupply + gtdLeftover;
      } else {
        newData.fcfs.effectiveSupply = newData.fcfs.maxSupply;
      }

      // **Critical fix for public phase display**
      if (newData.public.status === "active") {
        // Public phase is running, display total NFTs minted vs. total collection size
        newData.public.effectiveSupply = TOTAL_COLLECTION_SIZE;
        newData.public.minted = totalSupply ?? 0;
      } else if (newData.public.status === "expired") {
        // Public phase has ended, show the final count
        newData.public.effectiveSupply = TOTAL_COLLECTION_SIZE;
        newData.public.minted = totalSupply ?? 0;
      } else {
        // Public phase is upcoming, hide the display
        newData.public.effectiveSupply = 0;
        newData.public.minted = 0;
      }
      
      setPhases(newData);
    };

    updatePhases();
    const interval = setInterval(updatePhases, 1000);
    return () => clearInterval(interval);
  }, [
    gtd.phaseMinted,
    fcfs.phaseMinted,
    pub.phaseMinted,
    gtdMax.phaseMaxSupply,
    fcfsMax.phaseMaxSupply,
    pubMax.phaseMaxSupply,
    totalSupply
  ]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return { phases, formatTime };
};