"use client";

import { useWriteContract } from "wagmi";
import { simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "../../wagmi";
import { MintNFTContract, CONTRACT_FUNCTIONS } from "../constants";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";
import { estimateGasFee } from "../utils/helpers";


export const useMintNFTWrite = () => {
  const { writeContractAsync, isPending, error } = useWriteContract();

  // ----------- Presale Mint -----------
  const presaleMint = async (quantity: number, merkleProof: string[]) => {
    const { request } = await simulateContract(config, {
      address: MintNFTContract,
      abi: mintNftsAbi,
      functionName: CONTRACT_FUNCTIONS.PRESALE_MINT,
      args: [quantity, merkleProof],
    });

    const txHash = await writeContractAsync(request);
    return await waitForTransactionReceipt(config, { hash: txHash });
  };

  // ----------- Public Mint -----------
  const publicMint = async (quantity: number) => {
    const { request } = await simulateContract(config, {
      address: MintNFTContract,
      abi: mintNftsAbi,
      functionName: CONTRACT_FUNCTIONS.PUBLIC_MINT,
      args: [quantity],
    
    });

    const txHash = await writeContractAsync(request);
    return await waitForTransactionReceipt(config, { hash: txHash });
  };

  // ----------- Gas Fee Estimation -----------
  const getGasFee = async (fnName: string, args: any[], account: `0x${string}`) => {
    return estimateGasFee(fnName, args, account);
  };

  return { presaleMint, publicMint, getGasFee, isPending, error };
};
