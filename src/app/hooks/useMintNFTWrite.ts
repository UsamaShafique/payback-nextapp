"use client";

import { useWriteContract } from "wagmi";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";
import { MintNFTContract } from "../constants";

// Types
type ProofsMap = Record<string, { proof: string[] }>;
type Phase = "gtd" | "fcfs";

// JSON Proofs (cast to ProofsMap so TS knows we can index with string addresses)
import rawProofsGTD from "../utils/Proofs-GTD.json";
import rawProofsFCFS from "../utils/Proofs-FCFS.json";

const proofsGTD = rawProofsGTD as ProofsMap;
const proofsFCFS = rawProofsFCFS as ProofsMap;

export const useMintNFTWrite = (walletAddress?: string) => {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const addressKey = walletAddress?.toLowerCase();

  // ---------- Presale Mint (GTD, FCFS) ----------
  const presaleMint = async (phase: Phase, quantity: number) => {
    const proofs = phase === "gtd" ? proofsGTD : proofsFCFS;
    const proof = addressKey && proofs[addressKey]?.proof;

    if (!proof) {
      throw new Error("Wallet not eligible for presale minting.");
    }

    return await writeContractAsync({
      address: MintNFTContract,
      abi: mintNftsAbi,
      functionName: "presaleMint",
      args: [quantity, proof],
    });
  };

  // ---------- Public Mint ----------
  const publicMint = async (quantity: number) => {
    return await writeContractAsync({
      address: MintNFTContract,
      abi: mintNftsAbi,
      functionName: "publicMint", // ✅ confirm with ABI
      args: [quantity],
    });
  };

  // ---------- Eligibility Check ----------
  const checkEligibility = (phase: Phase): boolean => {
    const proofs = phase === "gtd" ? proofsGTD : proofsFCFS;
    return Boolean(addressKey && proofs[addressKey]);
  };

  return {
    presaleMint,
    publicMint,
    checkEligibility,
    isPending,
    error,
  };
};
