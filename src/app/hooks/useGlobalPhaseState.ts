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
    let activePhaseFound = false;

    PHASE_ORDER.forEach((phase) => {
      const timeData: PhaseTimeData = phaseTimes[phase] || {
        endTime: 0,
        remainingSeconds: 0,
        status: PHASE_STATUSES[0],
      };

      const supplyData = contractData[phase];
      const soldOut = supplyData
        ? supplyData.minted >= supplyData.maxSupply
        : false;

      const status = resolveStatus(soldOut, activePhaseFound, timeData);

      if (status === PHASE_STATUSES[1]) {
        activePhaseFound = true;
      }

      result[phase] = {
        ...supplyData,
        remainingSeconds:
          status === PHASE_STATUSES[1] ? timeData.remainingSeconds : 0,
        status,
      };
    });

    return result;
  }, [contractData, phaseTimes]);

  useEffect(() => {
    const currentActivePhase = PHASE_ORDER.find(
      (phase) => phases[phase].status === PHASE_STATUSES[1]
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
