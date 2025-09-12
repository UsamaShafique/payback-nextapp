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

  const fees = await estimateFeesPerGas(config);

  const gas = request.gas ?? 0n;
  const maxFeePerGas = fees.maxFeePerGas ?? 0n;
  const estimatedCost = gas * maxFeePerGas;
  const maxPriorityFeePerGas = fees.maxPriorityFeePerGas ?? 0n;

  return {
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    estimatedCost,
    estimatedCostInEth: formatEther(estimatedCost),
  };
}

export const parseMintError = (err: Error | any): string => {
  const lower = err.message?.toLowerCase() || "";

  const errorMap: [RegExp, string][] = [
    [/user (denied|rejected)/, "You rejected the transaction."],
    [
      /intrinsic gas too low/,
      "Transaction failed: gas limit too low. Please try again.",
    ],
    [
      /insufficient funds/,
      "Transaction failed: insufficient funds to complete the transaction.",
    ],
    [/salenotactive/, "Sale is not active yet."],
  ];

  for (const [pattern, message] of errorMap) {
    if (pattern.test(lower)) return message;
  }

  if (
    [
      "ContractFunctionExecutionError",
      "ContractFunctionRevertedError",
    ].includes(err.name)
  ) {
    return (err as any).shortMessage ?? err.message;
  }
  return err.message.length > 120
    ? "Transaction failed. Please check your wallet or try again."
    : err.message;
};
