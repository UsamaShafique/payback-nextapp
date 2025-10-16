"use client";

import { useState, useEffect, useMemo } from "react";
import { useReadContracts } from "wagmi";
import { Abi } from "viem";
import {
  MintNFTContract,
  CONTRACT_FUNCTIONS,
  PHASE_ORDER,
  PHASE_STATUSES,
  Phase,
  PhaseStatus,
} from "../constants";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";

const abi = mintNftsAbi as Abi;

export type PhaseTimeData = {
  startTime: number;
  endTime: number;
  remainingSeconds: number;
  status: PhaseStatus;
};

export const usePhaseTimes = () => {
  const [tick, setTick] = useState(0);

  const phaseTimeFunctions: Record<Phase, { start: string; end: string }> = {
    gtd: {
      start: CONTRACT_FUNCTIONS.GTD_START_TIME,
      end: CONTRACT_FUNCTIONS.GTD_END_TIME,
    },
    fcfs: {
      start: CONTRACT_FUNCTIONS.FCFS_START_TIME,
      end: CONTRACT_FUNCTIONS.FCFS_END_TIME,
    },
    public: {
      start: CONTRACT_FUNCTIONS.PUBLIC_START_TIME,
      end: CONTRACT_FUNCTIONS.PUBLIC_END_TIME,
    },
  };

  const { data, refetch } = useReadContracts({
    contracts: PHASE_ORDER?.flatMap((phase) => [
      {
        address: MintNFTContract,
        abi,
        functionName: phaseTimeFunctions[phase].start,
      },
      {
        address: MintNFTContract,
        abi,
        functionName: phaseTimeFunctions[phase].end,
      },
    ]),
  });

  const isLoaded = data?.every((item) => item?.result !== undefined);

  const phaseTimes = useMemo(() => {
    if (!isLoaded) {
      return PHASE_ORDER?.reduce(
        (acc, phase) => {
          acc[phase] = {
            startTime: 0,
            endTime: 0,
            remainingSeconds: 0,
            status: PHASE_STATUSES.UPCOMING,
          };
          return acc;
        },
        {} as Record<Phase, PhaseTimeData>
      );
    }

    const now = Math.floor(Date.now() / 1000);
    const result: Record<Phase, PhaseTimeData> = {} as any;

    PHASE_ORDER?.forEach((phase, i) => {
      const startIdx = i * 2;
      const endIdx = i * 2 + 1;

      const rawStart = data?.[startIdx]?.result;
      const rawEnd = data?.[endIdx]?.result;

      const startTime = typeof rawStart === "bigint" ? Number(rawStart) : 0;
      const endTime = typeof rawEnd === "bigint" ? Number(rawEnd) : 0;

      let status: PhaseStatus = PHASE_STATUSES.UPCOMING;
      let remainingSeconds = 0;

      if (startTime === 0 || endTime === 0 || endTime <= startTime) {
        status = PHASE_STATUSES.UPCOMING;
      } else if (now < startTime) {
        status = PHASE_STATUSES.UPCOMING;
      } else if (now >= startTime && now < endTime) {
        status = PHASE_STATUSES.ACTIVE;
        remainingSeconds = endTime - now;
      } else {
        status = PHASE_STATUSES.EXPIRED;
      }

      result[phase] = { startTime, endTime, remainingSeconds, status };
    });

    return result;
  }, [data, tick, isLoaded]);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return { phaseTimes, refetchAll: () => refetch?.() };
};
