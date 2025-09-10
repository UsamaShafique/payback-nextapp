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

  const { data: totalSupplyData } = useReadContract({
    address: MintNFTContract,
    abi: mintNftsAbi,
    functionName: CONTRACT_FUNCTIONS.TOTAL_SUPPLY,
  });

  const { data: maxSupplyData } = useReadContract({
    address: MintNFTContract,
    abi: mintNftsAbi,
    functionName: CONTRACT_FUNCTIONS.MAX_SUPPLY,
  });

  return {
    currentPhase: phaseData ? Number(phaseData) : 0,
    totalSupply: totalSupplyData ? Number(totalSupplyData) : 0,
    maxSupply: maxSupplyData ? Number(maxSupplyData) : 0,
    currentPhaseLoading,
    isPhaseError,
  };
};
