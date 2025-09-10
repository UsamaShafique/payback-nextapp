// "use client";

// import { useWriteContract } from "wagmi";
// import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";
// import { MintNFTContract, PHASES, CONTRACT_FUNCTIONS } from "../constants";

// export type Phase = (typeof PHASES)[keyof typeof PHASES]; // "gtd" | "fcfs" | "public"

// export const useMintNFTWrite = () => {
//   const { writeContractAsync, isPending, error } = useWriteContract();

//   const presaleMint = async (
//     phase: Phase,
//     quantity: number,
//     merkleProof: string[]
//   ) => {
//     if (!merkleProof?.length) {
//       throw new Error("Merkle proof is required.");
//     }

//     return await writeContractAsync({
//       address: MintNFTContract,
//       abi: mintNftsAbi,
//       functionName: CONTRACT_FUNCTIONS.PRESALE_MINT, 
//       args: [quantity, merkleProof],
//     });
//   };

//   const publicMint = async (quantity: number) => {
//     return await writeContractAsync({
//       address: MintNFTContract,
//       abi: mintNftsAbi,
//       functionName: CONTRACT_FUNCTIONS.PUBLIC_MINT, 
//       args: [quantity],
//     });
//   };

//   return {
//     presaleMint,
//     publicMint,
//     isPending,
//     error,
//   };
// };

"use client";

import { useAccount, useWriteContract } from "wagmi";
import { simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "../../wagmi";
import { MintNFTContract, CONTRACT_FUNCTIONS } from "../constants";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";

export const useMintNFTWrite = () => {
  const { writeContractAsync, isPending, error } = useWriteContract();
  const { isConnected, address } = useAccount();

  const ensureConnected = () => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected. Please connect your wallet first.");
    }
  };

  // ---------- Presale Mint ----------
  const presaleMint = async (
    _phase: "gtd" | "fcfs" | "public",
    quantity: number,
    merkleProof: string[]
  ) => {
    ensureConnected();

    // Simulate
    const { request } = await simulateContract(config, {
      address: MintNFTContract,
      abi: mintNftsAbi,
      functionName: CONTRACT_FUNCTIONS.PRESALE_MINT,
      args: [quantity, merkleProof],
      account: address,
    });

    const txHash = await writeContractAsync(request);

    const receipt = await waitForTransactionReceipt(config, { hash: txHash });

    return receipt; // 👈 confirmed transaction
  };

  // ---------- Public Mint ----------
  const publicMint = async (quantity: number) => {
    ensureConnected();

    const { request } = await simulateContract(config, {
      address: MintNFTContract,
      abi: mintNftsAbi,
      functionName: CONTRACT_FUNCTIONS.PUBLIC_MINT,
      args: [quantity],
      account: address,
    });

    const txHash = await writeContractAsync(request);

    const receipt = await waitForTransactionReceipt(config, { hash: txHash });

    return receipt;
  };

  return { presaleMint, publicMint, isPending, error };
};
