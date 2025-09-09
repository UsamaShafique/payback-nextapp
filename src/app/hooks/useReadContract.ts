"use client";

import { useReadContract } from "wagmi";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";
import { CONTRACT_ADDRESSES } from "../constants";

type SupportedChainId = 11155111;

export const useMintNFTContract = () => {
  const address = CONTRACT_ADDRESSES.MintNFTContract;
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID) as SupportedChainId;

  const { data, isLoading, isError } = useReadContract({
    address,
    abi: mintNftsAbi,
    functionName: "currentPhase",
    chainId,
  });

  let phase: number | undefined = undefined;
  if (data != null) {
    phase = (data as any)?.toNumber?.() ?? Number(data);
  }

  return { phase, isLoading, isError };
};
