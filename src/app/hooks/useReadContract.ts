"use client";

import { useReadContract } from "wagmi";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";
import { MintNFTContract, CONTRACT_FUNCTIONS, Phase } from "../constants";

export const useMintNFT = () => {
  const {
    data: phaseData,
    isLoading: currentPhaseLoading,
    isError: isPhaseError,
  } = useReadContract({
    address: MintNFTContract,
    abi: mintNftsAbi,
    functionName: CONTRACT_FUNCTIONS.CURRENT_PHASE,
  });
  return {
    currentPhase: phaseData ? Number(phaseData) : 0,
    currentPhaseLoading,
    isPhaseError,
  };
};

export const useNftSupply = () => {
  const { data: totalSupplyData, refetch: refetchTotalSupply } =
    useReadContract({
      address: MintNFTContract,
      abi: mintNftsAbi,
      functionName: CONTRACT_FUNCTIONS.TOTAL_SUPPLY,
    });

  const { data: maxSupplyData, refetch: refetchMaxSupply } = useReadContract({
    address: MintNFTContract,
    abi: mintNftsAbi,
    functionName: CONTRACT_FUNCTIONS.MAX_SUPPLY,
  });

  return {
    totalSupply: totalSupplyData ? Number(totalSupplyData) : 0,
    maxSupply: maxSupplyData ? Number(maxSupplyData) : 0,
    refetchTotalSupply,
    refetchMaxSupply,
  };
};

export const useWalletMintCount = (
  walletAddress?: `0x${string}`,
  activePhase?: Phase
) => {
  const phaseFunctionMap: Record<Phase, string> = {
    gtd: CONTRACT_FUNCTIONS.GTD_MINT_COUNT,
    fcfs: CONTRACT_FUNCTIONS.FCFS_MINT_COUNT,
    public: CONTRACT_FUNCTIONS.PUBLIC_MINT_COUNT,
  };

  const functionName = activePhase
    ? phaseFunctionMap[activePhase]
    : CONTRACT_FUNCTIONS.PUBLIC_MINT_COUNT;

  const { data, refetch } = useReadContract({
    address: MintNFTContract,
    abi: mintNftsAbi,
    functionName,
    args: walletAddress ? [walletAddress] : undefined,
  });

  return {
    mintedCount: data ? Number(data) : 0,
    refetch,
  };
};
