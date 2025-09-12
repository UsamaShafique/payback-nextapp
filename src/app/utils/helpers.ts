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

export const parseMintError = (err: any): string => {
  if (!err) return "Unknown error occurred";

  const message = err.shortMessage || err.reason || err.message || "";

  const match = message.match(/Error:\s*([\w]+)/);
  if (match && match[1]) return match[1]; // e.g., "ExceedsWalletLimit"

  const normalized = message.toLowerCase().replace(/[^a-z0-9]/g, "");
  const errorMap: [RegExp, string][] = [
    [/userdenied|userrejected/, "You rejected the transaction."],
    [/intrinsicgastoolow/, "Transaction failed: gas limit too low."],
    [/insufficientfunds/, "Transaction failed: insufficient funds."],
    [/salenotactive/, "Sale is not active yet."],
  ];
  for (const [pattern, friendly] of errorMap) {
    if (pattern.test(normalized)) return friendly;
  }

  return message.length > 120
    ? "Transaction failed. Please check your wallet or try again."
    : message;
};
