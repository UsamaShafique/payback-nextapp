"use client";

import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import {
  Phase,
  PHASE_ORDER,
  MintNFTContract,
  CONTRACT_FUNCTIONS,
  PHASE_STATUSES,
} from "../constants";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";
import { usePhaseTimes, PhaseTimeData } from "./usePhaseTimes";
import { Abi } from "viem";

const abi: Abi = mintNftsAbi as Abi;

interface PhaseData {
  minted: number;
  maxSupply: number;
  remainingSeconds: number;
  status: (typeof PHASE_STATUSES)[number];
}

export const useGlobalPhaseState = () => {
  const contractsToRead = PHASE_ORDER.flatMap((phase) => {
    const keys = Object.keys(CONTRACT_FUNCTIONS) as Array<
      keyof typeof CONTRACT_FUNCTIONS
    >;
    const mintedFnKey = keys.find((key) =>
      key.toLowerCase().includes(`${phase}_minted`)
    );
    const maxSupplyFnKey = keys.find((key) =>
      key.toLowerCase().includes(`${phase}_max_supply`)
    );

    const contracts = [];
    if (mintedFnKey)
      contracts.push({
        address: MintNFTContract,
        abi,
        functionName: CONTRACT_FUNCTIONS[mintedFnKey],
      });
    if (maxSupplyFnKey)
      contracts.push({
        address: MintNFTContract,
        abi,
        functionName: CONTRACT_FUNCTIONS[maxSupplyFnKey],
      });

    return contracts;
  });

  const { data, refetch, isLoading } = useReadContracts({
    contracts: contractsToRead,
  });

  const contractData = useMemo(() => {
    if (!data)
      return {} as Record<Phase, { minted: number; maxSupply: number }>;
    const result: Record<Phase, { minted: number; maxSupply: number }> =
      {} as Record<Phase, { minted: number; maxSupply: number }>;

    PHASE_ORDER.forEach((phase, index) => {
      const mintedResult = data[index * 2]?.result;
      const maxSupplyResult = data[index * 2 + 1]?.result;

      result[phase] = {
        minted: typeof mintedResult === "bigint" ? Number(mintedResult) : 0,
        maxSupply:
          typeof maxSupplyResult === "bigint" ? Number(maxSupplyResult) : 0,
      };
    });

    return result;
  }, [data]);

  const { phaseTimes, refetchAll: refetchPhaseTimes } = usePhaseTimes();

  const phases = useMemo(() => {
    const result: Record<Phase, PhaseData> = {} as Record<Phase, PhaseData>;
  
    // Find first active phase based on time
    const now = Math.floor(Date.now() / 1000);
    let activePhaseFound = false;
  
    PHASE_ORDER.forEach((phase, index) => {
      const timeData: PhaseTimeData = phaseTimes[phase] || {
        endTime: 0,
        remainingSeconds: 0,
        status: "upcoming",
      };
  
      const supplyData = contractData[phase];
      const soldOut = supplyData ? supplyData.minted >= supplyData.maxSupply : false;
  
      let status: PhaseData["status"] = "upcoming";
      let remainingSeconds = 0;
  
      if (soldOut) {
        status = "expired";
      } else if (!activePhaseFound) {
        // If phase has started and not ended → mark as active
        if (timeData.remainingSeconds > 0 && timeData.status === "active") {
          status = "active";
          remainingSeconds = timeData.remainingSeconds;
          activePhaseFound = true; // Only one active phase
        } else if (timeData.status === "expired") {
          status = "expired";
        } else {
          status = "upcoming";
        }
      } else {
        // Remaining phases after the active one are always upcoming unless sold out
        status = "upcoming";
      }
  
      result[phase] = {
        ...supplyData,
        remainingSeconds,
        status,
      };
    });
  
    return result;
  }, [contractData, phaseTimes]);
  
  useMemo(() => {
    const currentActivePhase = PHASE_ORDER.find(
      (phase) => phases[phase].status === "active"
    );
    if (!currentActivePhase) return;

    const remainingTime = phases[currentActivePhase].remainingSeconds * 1000;
    if (remainingTime <= 0) {
      refetch();
      refetchPhaseTimes();
    }
  }, [phases, refetch, refetchPhaseTimes]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return { phases, formatTime, isLoading };
};
