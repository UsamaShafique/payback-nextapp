"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useMintNFTWrite } from "./useMintNFTWrite";
import { PHASES, Phase } from "../constants";
import { estimateGasFee, parseMintError } from "../utils/helpers";

import proofsGTDJson from "../utils/Proofs-GTD.json";
import proofsFCFSJson from "../utils/Proofs-FCFS.json";

type ProofsType = Record<string, { proof: string[] }>;

export const useMintHandler = () => {
  const { address } = useAccount();
  const { presaleMint, publicMint } = useMintNFTWrite();

  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintFailure, setMintFailure] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintedIds, setMintedIds] = useState<string[]>([]);

  const proofsGTD = Object.fromEntries(
    Object.entries(proofsGTDJson).map(([k, v]) => [k.toLowerCase(), v])
  ) as ProofsType;

  const proofsFCFS = Object.fromEntries(
    Object.entries(proofsFCFSJson).map(([k, v]) => [k.toLowerCase(), v])
  ) as ProofsType;

  const eligibilityMap: Record<Phase, boolean> = {
    [PHASES.GTD]: !!(address && proofsGTD[address.toLowerCase()]),
    [PHASES.FCFS]: !!(address && proofsFCFS[address.toLowerCase()]),
    [PHASES.PUBLIC]: true,
  };

  const isEligible = (phase: Phase) => {
    if (!address) return false;
    return eligibilityMap[phase];
  };

  const mintFunctionMap: Record<Phase, (quantity: number) => Promise<any>> = {
    [PHASES.GTD]: async (quantity) => {
      const proof = proofsGTD[address!.toLowerCase()]?.proof ?? [];
      const fees = await estimateGasFee(
        "presaleMint",
        [quantity, proof],
        address!
      );

      return presaleMint(quantity, proof, {
        gas: fees.gas,
        maxFeePerGas: fees.maxFeePerGas,
        maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
      });
    },
    [PHASES.FCFS]: async (quantity) => {
      const proof = proofsFCFS[address!.toLowerCase()]?.proof ?? [];
      const fees = await estimateGasFee(
        "presaleMint",
        [quantity, proof],
        address!
      );

      return presaleMint(quantity, proof, {
        gas: fees.gas,
        maxFeePerGas: fees.maxFeePerGas,
        maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
      });
    },
    [PHASES.PUBLIC]: async (quantity) => {
      const fees = await estimateGasFee("publicMint", [quantity], address!);

      return publicMint(quantity, {
        gas: fees.gas,
        maxFeePerGas: fees.maxFeePerGas,
        maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
      });
    },
  };

  const mintNFT = async (phase: Phase, quantity: number) => {
    if (!address) throw new Error("Wallet not connected");
    if (!isEligible(phase)) throw new Error(`Wallet not eligible for ${phase}`);

    try {
      let receipt;

      try {
        receipt = await mintFunctionMap[phase](quantity);
      } catch (err) {
        const humanMessage = parseMintError(err);
        setMintFailure(true);
        setMintError(humanMessage);
        throw err;
      }

      if (receipt.status === "success") {
        const ids = receipt.logs
          ?.filter(
            (log: any) =>
              log.topics[0] ===
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
          )
          ?.map((log: any) =>
            log.topics[3] ? BigInt(log.topics[3]).toString() : ""
          )
          ?.filter((id: string) => id !== "");

        setMintedIds(ids);
        setMintSuccess(true);
        setMintError(null);
      } else {
        setMintFailure(true);
        setMintError(
          "Transaction failed. Please check your wallet or try again."
        );
      }

      return receipt;
    } catch (err: any) {
      const humanMessage = parseMintError(err);
      setMintFailure(true);
      setMintSuccess(false);
      setMintError(humanMessage);
      return;
    }
  };

  return {
    mintNFT,
    mintSuccess,
    mintFailure,
    setMintSuccess,
    setMintFailure,
    isEligible,
    mintError,
    setMintError,
    mintedIds,
  };
};
