"use client";

import { useReadContract } from "wagmi";
import { MintNFTContract, CONTRACT_FUNCTIONS, Phase } from "../constants";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";

export const usePhaseMintedCount = (phase: Phase) => {
  const phaseFunctionMap: Record<Phase, string> = {
    gtd: CONTRACT_FUNCTIONS.GTD_MINTED_COUNT,
    fcfs: CONTRACT_FUNCTIONS.FCFS_MINTED_COUNT,
    public: CONTRACT_FUNCTIONS.PUBLIC_MINTED_COUNT,
  };

  const { data, refetch, isLoading } = useReadContract({
    address: MintNFTContract,
    abi: mintNftsAbi,
    functionName: phaseFunctionMap[phase],
  });

  return {
    phaseMinted: data ? Number(data) : 0,
    refetch,
    isLoading,
  };
};

export const usePhaseMaxSupply = (phase: Phase) => {
  const phaseFunctionMap: Record<Phase, string> = {
    gtd: CONTRACT_FUNCTIONS.GTD_MAX_SUPPLY,
    fcfs: CONTRACT_FUNCTIONS.FCFS_MAX_SUPPLY,
    public: CONTRACT_FUNCTIONS.PUBLIC_MAX_SUPPLY,
  };

  const { data, refetch, isLoading } = useReadContract({
    address: MintNFTContract,
    abi: mintNftsAbi,
    functionName: phaseFunctionMap[phase],
  });

  return {
    phaseMaxSupply: data ? Number(data) : 0,
    refetch,
    isLoading,
  };
};
