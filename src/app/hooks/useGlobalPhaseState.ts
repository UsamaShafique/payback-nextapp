"use client";

import { useMemo, useEffect } from "react";
import { useReadContracts } from "wagmi";
import {
  Phase,
  PHASE_ORDER,
  MintNFTContract,
  CONTRACT_FUNCTIONS,
  PhaseStatus,
  PHASE_STATUSES,
  PHASE_BASE_ID,
  PHASES,
} from "../constants";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";
import { usePhaseTimes, PhaseTimeData } from "./usePhaseTimes";
import { resolveStatus } from "../utils/helpers";

import { Abi } from "viem";

const abi: Abi = mintNftsAbi as Abi;

interface PhaseData {
  minted: number;
  maxSupply: number;
  remainingSeconds: number;
  status: PhaseStatus;
}

export const useGlobalPhaseState = () => {
  const MAX_SUPPLY_FUNCTIONS: Record<
    Phase,
    { fnName: string; hasArgs: boolean }
  > = {
    gtd: { fnName: CONTRACT_FUNCTIONS.FCFS_REMAINING_SUPPLY, hasArgs: true },
    fcfs: { fnName: CONTRACT_FUNCTIONS.FCFS_REMAINING_SUPPLY, hasArgs: true },
    public: { fnName: CONTRACT_FUNCTIONS.FCFS_REMAINING_SUPPLY, hasArgs: true },
  };

  const contractsToRead = PHASE_ORDER.flatMap((phase) => {
    const keys = Object.keys(CONTRACT_FUNCTIONS) as Array<
      keyof typeof CONTRACT_FUNCTIONS
    >;
    const mintedFnKey = keys.find((key) =>
      key.toLowerCase().includes(`${phase}_minted`)
    );

    const contracts = [];

    if (mintedFnKey) {
      contracts.push({
        address: MintNFTContract,
        abi,
        functionName: CONTRACT_FUNCTIONS[mintedFnKey],
      });
    }

    const { fnName, hasArgs } = MAX_SUPPLY_FUNCTIONS[phase];

    contracts.push({
      address: MintNFTContract,
      abi,
      functionName: fnName,
      args: hasArgs ? [PHASE_BASE_ID[phase]] : undefined,
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
      if (Array.isArray(maxSupplyResult) && maxSupplyResult.length === 2) {
        result[phase] = {
          minted: Number(maxSupplyResult[1]),
          maxSupply: Number(maxSupplyResult[0]),
        };
      } else {
        result[phase] = {
          minted: typeof mintedResult === "bigint" ? Number(mintedResult) : 0,
          maxSupply:
            typeof maxSupplyResult === "bigint" ? Number(maxSupplyResult) : 0,
        };
      }
    });

    return result;
  }, [data]);
  const { phaseTimes, refetchAll: refetchPhaseTimes } = usePhaseTimes();

  const phases = useMemo(() => {
    const result: Record<Phase, PhaseData> = {} as Record<Phase, PhaseData>;
    let activePhaseFound = false;

    PHASE_ORDER.forEach((phase) => {
      const timeData: PhaseTimeData = phaseTimes[phase] || {
        endTime: 0,
        remainingSeconds: 0,
        status: PHASE_STATUSES.UPCOMING,
      };

      const supplyData = contractData[phase];
      const soldOut =
        supplyData?.minted >= supplyData?.maxSupply &&
        supplyData?.maxSupply > 0;

      let status = resolveStatus(false, activePhaseFound, timeData);
      if (status === PHASE_STATUSES.ACTIVE) activePhaseFound = true;
      if (soldOut && phase === PHASES.PUBLIC) {
        status = PHASE_STATUSES.EXPIRED;
      }
      const remainingSeconds =
        soldOut && phase === PHASES.PUBLIC ? 0 : timeData.remainingSeconds;
      result[phase] = {
        ...supplyData,
        remainingSeconds,
        status,
      };
    });

    return result;
  }, [contractData, phaseTimes]);

  useEffect(() => {
    const currentActivePhase = PHASE_ORDER.find(
      (phase) => phases[phase].status === PHASE_STATUSES.ACTIVE
    );
    if (!currentActivePhase) return;

    const remainingTime = phases[currentActivePhase].remainingSeconds * 1000;
    if (remainingTime <= 0) {
      refetch();
      refetchPhaseTimes();
    }
  }, [phases, refetch, refetchPhaseTimes]);

  return { phases, isLoading };
};
