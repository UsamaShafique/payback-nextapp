"use client";

import { useReadContract } from "wagmi";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";
import { MintNFTContract } from "../constants";

export const useMintNFTContract = () => {
  const { data, isLoading, isError } = useReadContract({
    address: MintNFTContract,
    abi: mintNftsAbi,
    functionName: "currentPhase",
  });
  const currentPhase = data ? Number(data) : 0;
  return { currentPhase, isLoading, isError };
};
