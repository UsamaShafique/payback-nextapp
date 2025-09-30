"use client";

import {
  simulateContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { activeChain, config } from "../../wagmi";
import { MintNFTContract, CONTRACT_FUNCTIONS } from "../constants";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";

export type GasOverrides = {
  gas?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
};

export const useMintNFTWrite = () => {
  const presaleMint = async (
    quantity: number,
    merkleProof: string[],
    gasOverrides?: GasOverrides
  ) => {
    const { request } = await simulateContract(config, {
      address: MintNFTContract,
      abi: mintNftsAbi,
      functionName: CONTRACT_FUNCTIONS.PRESALE_MINT,
      args: [quantity, merkleProof],
    });

    const txHash = await writeContract(config, {
      abi: request.abi,
      address: request.address,
      functionName: request.functionName,
      args: request.args,
      chainId:activeChain.id
      // gas: gasOverrides?.gas,
      // maxFeePerGas: gasOverrides?.maxFeePerGas,
      // maxPriorityFeePerGas: gasOverrides?.maxPriorityFeePerGas,
    });

    return await waitForTransactionReceipt(config, { hash: txHash });
  };

  const publicMint = async (quantity: number, gasOverrides?: GasOverrides) => {
    const { request } = await simulateContract(config, {
      address: MintNFTContract,
      abi: mintNftsAbi,
      functionName: CONTRACT_FUNCTIONS.PUBLIC_MINT,
      args: [quantity],
    });

    const txHash = await writeContract(config, {
      abi: request.abi,
      address: request.address,
      functionName: request.functionName,
      args: request.args,
      chainId:activeChain.id
      // gas: gasOverrides?.gas,
      // maxFeePerGas: gasOverrides?.maxFeePerGas,
      // maxPriorityFeePerGas: gasOverrides?.maxPriorityFeePerGas,
    });

    return await waitForTransactionReceipt(config, { hash: txHash });
  };

  return { presaleMint, publicMint };
};
