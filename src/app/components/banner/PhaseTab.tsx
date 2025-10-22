"use client";

import React from "react";
import CounterInput from "../banner/CounterInput";
import { WalletButton } from "../../components/WalletButton";
import { useAccount, useBalance } from "wagmi";
import {
  MAX_QUANTITY_PER_PHASE,
  Phase,
  PHASE_STATUSES,
  PhaseKey,
} from "@/app/constants";

import { useNftSupply, useWalletMintCount } from "@/app/hooks/useReadContract";
import toast from "react-hot-toast";
import DynamicModal from "../DynamicModal";
import { useMintHandler } from "@/app/hooks/useMintHandler";
import { useGlobalPhaseState } from "@/app/hooks/useGlobalPhaseState";
import PhaseTimer from "./PhaseTimer";

interface PhaseTabProps {
  title: string;
  activeKey: Phase;
}

const PhaseTab: React.FC<PhaseTabProps> = ({ title, activeKey }) => {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { totalSupply, refetchTotalSupply } = useNftSupply();

  const { phases } = useGlobalPhaseState();
  const phaseState = phases[activeKey];

  const { mintedCount, refetch: refetchMintCount } = useWalletMintCount(
    address,
    activeKey
  );

  const {
    mintNFT,
    isEligible,
    mintSuccess,
    mintFailure,
    mintError,
    setMintSuccess,
    setMintFailure,
    setMintError,
    mintedIds,
  } = useMintHandler();

  const [isMinting, setIsMinting] = React.useState(false);
  const [value, setValue] = React.useState<number | "">(1);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isFading, setIsFading] = React.useState(false);

  const eligible = isEligible(activeKey);
  const quantity = value || 0;

  const isActive = phaseState?.status === "active";
  const isExpired = phaseState?.status === "expired";
  const handleMint = async () => {
    if (!activeKey) return;
    const activePhaseKey = (Object.keys(phases) as Phase[]).find(
      (key) => phases[key].status === "active"
    );

    const validations = [
      {
        condition: !phaseState || phaseState.status !== "active",
        message: ` ${
          activePhaseKey
            ? `Active sale: ${activePhaseKey.toUpperCase()}`
            : "There is no active sale at the moment."
        }`,
      },
      {
        condition: !eligible,
        message: "You are not eligible to mint in this phase.",
      },
      {
        condition: !balanceData || balanceData.value === 0n,
        message: "Insufficient balance!",
      },
      {
        condition: phaseState?.minted >= phaseState?.maxSupply,
        message: "All NFTs have already been minted in this phase.",
      },
      {
        condition:
          phaseState &&
          quantity > phaseState.maxSupply - (phaseState.minted ?? 0),
        message: `Only ${phaseState?.maxSupply - (phaseState?.minted ?? 0)} NFT(s) remaining in this phase.`,
      },

      {
        condition:
          (mintedCount ?? 0) + quantity > MAX_QUANTITY_PER_PHASE[activeKey],
        message: `Wallet limit exceeded! Max ${MAX_QUANTITY_PER_PHASE[activeKey]} allowed.`,
      },
    ];

    for (const v of validations) {
      if (v.condition) {
        setErrorMessage(v.message);
        setIsFading(false);
        setTimeout(() => setIsFading(true), 2000);
        setTimeout(() => {
          setErrorMessage(null);
          setIsFading(false);
        }, 3000);
        return;
      }
    }

    setIsMinting(true);
    try {
      await mintNFT(activeKey, quantity);
      await refetchTotalSupply();
      await refetchMintCount();
    } catch (err: any) {
      setErrorMessage("Mint failed. Please try again.");
      setIsFading(false);
      setTimeout(() => setIsFading(true), 2500);
      setTimeout(() => {
        setErrorMessage(null);
        setIsFading(false);
      }, 3000);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="phasetab-container">
      <h1 className="whitlisthead">{title.toUpperCase()}</h1>

      <CounterInput
        value={value}
        onChange={setValue}
        phase={title as PhaseKey}
      />

      <div className="maingtd">
        <div className="innergtd">
          <p className="gtdpara">Status</p>
          <h6 className="gtdhead">
            {phaseState?.status ? phaseState.status : PHASE_STATUSES.UPCOMING}
          </h6>
        </div>

        <PhaseTimer activeKey={activeKey} />

        <div className="innergtd">
          <p className="gtdpara">Phase Supply</p>
          <h6 className="gtdhead">
            {isActive || isExpired
              ? `${phaseState?.minted ?? 0}/${phaseState?.maxSupply ?? 0}`
              : "--/--"}
          </h6>
        </div>
      </div>

      {address ? (
        <>
          {!isExpired && (
            <p className="publicpara">
              {eligible
                ? "You are eligible to Mint NFT"
                : "You are not eligible to Mint NFT"}
            </p>
          )}

          {isExpired && <p className="publicpara">This phase has expired.</p>}
          <button
            className={errorMessage || !eligible || !phaseState || phaseState.status !== "active"? "dullbtn" : "mintbtn"}
            onClick={handleMint}
            disabled={isMinting || quantity <= 0}
          >
            {isMinting ? "Minting..." : "Mint now"}
          </button>
        </>
      ) : (
        <WalletButton className="connectbtn" />
      )}
      {errorMessage && (
        <span className={`redspan eligiblespan ${isFading ? "fade-out" : ""}`}>
          {errorMessage}
        </span>
      )}

      <DynamicModal
        show={mintSuccess}
        onHide={() => setMintSuccess(false)}
        type="success"
        mintedId={mintedIds.join(", ")}
      />
      <DynamicModal
        show={mintFailure}
        type="failure"
        onHide={() => {
          setMintFailure(false);
          setMintError(null);
        }}
        errorMessage={mintError}
      />
    </div>
  );
};

export default PhaseTab;
