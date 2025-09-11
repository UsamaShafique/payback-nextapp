"use client";

import { simulateContract, estimateFeesPerGas } from "@wagmi/core";
import { formatEther } from "viem";
import { config } from "../../wagmi";
import { MintNFTContract } from "../constants";
import mintNftsAbi from "../contracts/abi/mintNftsAbi.json";

export async function estimateGasFee(
  fnName: string,
  args: any[],
  account: `0x${string}`
) {
  const { request } = await simulateContract(config, {
    address: MintNFTContract,
    abi: mintNftsAbi,
    functionName: fnName,
    args,
    account,
  });
console.log(request ,"requestlog")
  const fees = await estimateFeesPerGas(config);

  const gasLimit = request.gas ?? 0n;
  const maxFeePerGas = fees.maxFeePerGas ?? 0n;
  const estimatedCost = gasLimit * maxFeePerGas;

  return {
    gasLimit,
    maxFeePerGas,
    estimatedCost,
    estimatedCostInEth: formatEther(estimatedCost),
  };
}
