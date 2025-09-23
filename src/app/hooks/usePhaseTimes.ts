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
  endTime: number;
  remainingSeconds: number;
  status: PhaseStatus;
};

export interface PhaseSupplyData {
  minted: number;
  maxSupply: number;
}

export const usePhaseTimes = () => {
  const [tick, setTick] = useState(0);

  const phaseFunctionMap: Record<Phase, string> = {
    gtd: CONTRACT_FUNCTIONS.GTD_END_TIME,
    fcfs: CONTRACT_FUNCTIONS.FCFS_END_TIME,
    public: CONTRACT_FUNCTIONS.PUBLIC_END_TIME,
  };

  const { data, refetch } = useReadContracts({
    contracts: PHASE_ORDER.map((phase) => ({
      address: MintNFTContract,
      abi: abi,
      functionName: phaseFunctionMap[phase],
    })),
  });

  const endTimes = useMemo(
    () =>
      PHASE_ORDER.reduce(
        (acc, phase, idx) => {
          const raw = data?.[idx]?.result;
          acc[phase] = typeof raw === "bigint" ? Number(raw) : 0;
          return acc;
        },
        {} as Record<Phase, number>
      ),
    [data]
  );

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const isLoaded = data?.every((item) => item?.result !== undefined);

  const phaseTimes: Record<Phase, PhaseTimeData> = useMemo(() => {
    if (!isLoaded) {
      return PHASE_ORDER.reduce(
        (acc, phase) => {
          acc[phase] = {
            endTime: 0,
            remainingSeconds: 0,
            status: PHASE_STATUSES[0],
          };
          return acc;
        },
        {} as Record<Phase, PhaseTimeData>
      );
    }

    const now = Math.floor(Date.now() / 1000);
    let activePhaseFound = false;

    return PHASE_ORDER.reduce(
      (acc, phase) => {
        const endTimeRaw = endTimes[phase];
        let status: PhaseStatus = PHASE_STATUSES[0];
        let remainingSeconds = 0;

        if (!endTimeRaw) {
          status = PHASE_STATUSES[0];
        } else if (!activePhaseFound && now < endTimeRaw) {
          status = PHASE_STATUSES[1];
          remainingSeconds = endTimeRaw - now;
          activePhaseFound = true;
        } else if (now >= endTimeRaw) {
          status = PHASE_STATUSES[2];
        }

        acc[phase] = { endTime: endTimeRaw, remainingSeconds, status };
        return acc;
      },
      {} as Record<Phase, PhaseTimeData>
    );
  }, [endTimes, tick, isLoaded]);

  return {
    phaseTimes,
    refetchAll: () => refetch?.(),
  };
};
