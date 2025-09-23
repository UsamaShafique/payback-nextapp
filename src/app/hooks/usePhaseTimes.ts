"use client";

import { useState, useEffect, useMemo } from "react";
import { useReadContract } from "wagmi";
import {
  MintNFTContract,
  CONTRACT_FUNCTIONS,
  PHASE_ORDER,
  Phase,
} from "../constants";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";

export type PhaseTimeData = {
  endTime: number;
  remainingSeconds: number;
  status: "upcoming" | "active" | "expired";
};

export interface PhaseSupplyData {
  minted: number;
  maxSupply: number;
}

export const usePhaseTimes = (phaseSupply?: Record<Phase, PhaseSupplyData>) => {
  const [tick, setTick] = useState(0);

  const phaseFunctionMap: Record<Phase, string> = {
    gtd: CONTRACT_FUNCTIONS.GTD_END_TIME,
    fcfs: CONTRACT_FUNCTIONS.FCFS_END_TIME,
    public: CONTRACT_FUNCTIONS.PUBLIC_END_TIME,
  };

  const gtdData = useReadContract({
    address: MintNFTContract,
    abi: mintNftsAbi,
    functionName: phaseFunctionMap.gtd,
  });
  const fcfsData = useReadContract({
    address: MintNFTContract,
    abi: mintNftsAbi,
    functionName: phaseFunctionMap.fcfs,
  });
  const publicData = useReadContract({
    address: MintNFTContract,
    abi: mintNftsAbi,
    functionName: phaseFunctionMap.public,
  });

  const endTimes = useMemo(
    () => ({
      gtd: typeof gtdData.data === "bigint" ? Number(gtdData.data) : 0,
      fcfs: typeof fcfsData.data === "bigint" ? Number(fcfsData.data) : 0,
      public: typeof publicData.data === "bigint" ? Number(publicData.data) : 0,
    }),
    [gtdData.data, fcfsData.data, publicData.data]
  );

  useEffect(() => {
    const interval = setInterval(() => setTick((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const isLoaded = gtdData.data && fcfsData.data && publicData.data;

const phaseTimes: Record<Phase, PhaseTimeData> = useMemo(() => {
  if (!isLoaded) {
    // Contract data not loaded yet
    return PHASE_ORDER.reduce((acc, phase) => {
      acc[phase] = { endTime: 0, remainingSeconds: 0, status: "upcoming" };
      return acc;
    }, {} as Record<Phase, PhaseTimeData>);
  }

  const now = Math.floor(Date.now() / 1000);
  const result: Record<Phase, PhaseTimeData> = {} as Record<Phase, PhaseTimeData>;

  PHASE_ORDER.forEach((phase, i) => {
    const endTimeRaw = endTimes[phase];
    const startTime = i === 0 ? 0 : endTimes[PHASE_ORDER[i - 1]] ?? 0;

    let status: PhaseTimeData["status"];
    let remainingSeconds = 0;
    
    if (!endTimeRaw || now < 0) {
      status = "upcoming"; // contract not loaded yet
    } else if (now < endTimeRaw) {
      status = "active";
      remainingSeconds = endTimeRaw - now;
    } else {
      status = "expired";
    }
    

    result[phase] = { endTime: endTimeRaw, remainingSeconds, status };
  });

  return result;
}, [endTimes, tick, isLoaded]);

  return {
    phaseTimes,
    refetchAll: () => {
      gtdData.refetch?.();
      fcfsData.refetch?.();
      publicData.refetch?.();
    },
  };
};
