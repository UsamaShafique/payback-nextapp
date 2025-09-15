"use client";

import { simulateContract, estimateFeesPerGas } from "@wagmi/core";
import { formatEther } from "viem";
import { config } from "../../wagmi";
import { EXPLORER_BASE, MintNFTContract } from "../constants";
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
  const possibleReasons = [
    err?.cause?.reason,
    err?.cause?.message,
    err?.shortMessage,
    err?.reason,
    err?.message,
  ];

  let rawMessage = "";
  for (const r of possibleReasons) {
    if (r) {
      rawMessage = r.toString();
      break;
    }
  }

  if (!rawMessage) return "Unknown error occurred";

  const match = rawMessage.match(/([\w_]+)\(\)/);
  if (match && match[1]) return match[1];
  const normalized = rawMessage.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (/userdenied|userrejected/.test(normalized))
    return "You rejected the transaction.";
  if (/intrinsicgastoolow/.test(normalized))
    return "Transaction failed: gas limit too low.";
  if (/insufficientfunds/.test(normalized))
    return "Transaction failed: insufficient funds.";
  if (/salenotactive/.test(normalized)) return "The sale is not active yet.";
  return rawMessage.length > 120
    ? "Transaction failed. Please check your wallet or try again."
    : rawMessage;
};

export const getTokenExplorerUrl = (tokenId: string) =>
  `${EXPLORER_BASE}/token/${MintNFTContract}?a=${tokenId}`;
