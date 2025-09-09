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
  let currentPhase: number | undefined;
  if (data != null) {
    currentPhase = (data as any)?.toNumber?.() ?? Number(data);
  }
  return { currentPhase, isLoading, isError };
};
