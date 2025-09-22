"use client";

import { useEffect, useState, useMemo } from "react";
import { useReadContracts } from "wagmi";
import {
  Phase,
  PHASE_DURATIONS,
  STORAGE_KEYS,
  PHASE_ORDER,
  MintNFTContract,
  CONTRACT_FUNCTIONS,
  PHASE_STATUSES,
} from "../constants";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";

const abi = mintNftsAbi as any;

interface PhaseData {
  minted: number;
  maxSupply: number;
  remainingSeconds: number;
  status: (typeof PHASE_STATUSES)[number];
}
export const useGlobalPhaseState = () => {
  const [timerState, setTimerState] = useState({ tick: 0 });

  const { data, refetch, isLoading } = useReadContracts({
    contracts: PHASE_ORDER.flatMap((phase) => {
      const isPublicPhase = phase === "public";
      return [
        {
          address: MintNFTContract,
          abi,
          functionName: isPublicPhase
            ? CONTRACT_FUNCTIONS.PUBLIC_MINTED_COUNT
            : phase === "gtd"
              ? CONTRACT_FUNCTIONS.GTD_MINTED_COUNT
              : CONTRACT_FUNCTIONS.FCFS_MINTED_COUNT,
        },
        {
          address: MintNFTContract,
          abi,
          functionName: isPublicPhase
            ? CONTRACT_FUNCTIONS.PUBLIC_MAX_SUPPLY
            : phase === "gtd"
              ? CONTRACT_FUNCTIONS.GTD_MAX_SUPPLY
              : CONTRACT_FUNCTIONS.FCFS_MAX_SUPPLY,
        },
      ];
    }),
  });

  const contractData = useMemo(() => {
    if (!data)
      return {} as Record<Phase, { minted: number; maxSupply: number }>;
    const result: Record<Phase, { minted: number; maxSupply: number }> =
      {} as Record<Phase, { minted: number; maxSupply: number }>;

    for (let i = 0; i < PHASE_ORDER.length; i++) {
      const phase = PHASE_ORDER[i];
      const mintedIndex = i * 2;
      const maxSupplyIndex = i * 2 + 1;

      const mintedResult = data[mintedIndex]?.result;
      const maxSupplyResult = data[maxSupplyIndex]?.result;

      result[phase] = {
        minted: typeof mintedResult === "bigint" ? Number(mintedResult) : 0,
        maxSupply:
          typeof maxSupplyResult === "bigint" ? Number(maxSupplyResult) : 0,
      };
    }
    return result;
  }, [data]);

  const phases = useMemo(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.MINT_START);
    const startTime = stored ? parseInt(stored, 10) : Date.now();

    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.MINT_START, startTime.toString());
    }

    const now = Date.now();
    const result: Record<Phase, PhaseData> = {} as Record<Phase, PhaseData>;
    let phaseStart = startTime;

    PHASE_ORDER.forEach((phase) => {
      const duration = PHASE_DURATIONS[phase] * 1000;
      const phaseEnd = phaseStart + duration;

      let status: (typeof PHASE_STATUSES)[number];
      let remainingSeconds = 0;

      if (now < phaseStart) {
        status = PHASE_STATUSES[0];
        remainingSeconds = Math.floor((phaseStart - now) / 1000);
      } else if (now < phaseEnd) {
        status = PHASE_STATUSES[1];
        remainingSeconds = Math.floor((phaseEnd - now) / 1000);
      } else {
        status = PHASE_STATUSES[2];
      }

      result[phase] = {
        ...contractData[phase],
        remainingSeconds: Math.max(0, remainingSeconds),
        status,
      };

      phaseStart = phaseEnd;
    });

    return result;
  }, [timerState.tick, contractData]);

  useEffect(() => {
    const currentActivePhase = PHASE_ORDER.find(
      (phase) => phases[phase].status === PHASE_STATUSES[1]
    );

    if (!currentActivePhase) return;

    const remainingTime = phases[currentActivePhase].remainingSeconds * 1000;
    if (remainingTime <= 0) return;

    const timeout = setTimeout(() => {
      refetch();
    }, remainingTime);

    return () => clearTimeout(timeout);
  }, [phases, refetch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerState((prev) => ({ tick: prev.tick + 1 }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return { phases, formatTime, isLoading };
};
