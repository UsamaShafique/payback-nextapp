"use client";

import { useReadContract } from "wagmi";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";
import { MintNFTContract, CONTRACT_FUNCTIONS } from "../constants";

export const useMintNFT = () => {
  const { data: phaseData, isLoading: currentPhaseLoading, isError: isPhaseError } =
    useReadContract({
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
  const {
    data: totalSupplyData,
    refetch: refetchTotalSupply, // ✅ add refetch
  } = useReadContract({
    address: MintNFTContract,
    abi: mintNftsAbi,
    functionName: CONTRACT_FUNCTIONS.TOTAL_SUPPLY,
  });

  const {
    data: maxSupplyData,
    refetch: refetchMaxSupply, // optional if maxSupply can change
  } = useReadContract({
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
