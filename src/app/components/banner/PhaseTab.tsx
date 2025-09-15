"use client";

import React from "react";
import CounterInput from "../banner/CounterInput";
import { WalletButton } from "../../components/WalletButton";
import { useAccount, useBalance } from "wagmi";
import {
  MAX_QUANTITY_PER_PHASE,
  Phase,
  PHASE_MAP,
  PhaseKey,
  PHASE_LABELS,
  TBD_TEXT,
} from "@/app/constants";

import {
  useMintNFT,
  useNftSupply,
  useWalletMintCount,
} from "@/app/hooks/useReadContract";
import toast from "react-hot-toast";
import DynamicModal from "../DynamicModal";
import { useMintHandler } from "@/app/hooks/useMintHandler";

interface PhaseTabProps {
  title: string;
  activeKey: Phase;
}

const PhaseTab: React.FC<PhaseTabProps> = ({ title, activeKey }) => {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { currentPhase } = useMintNFT();
  const { totalSupply, refetchTotalSupply } = useNftSupply();
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
  } = useMintHandler();

  const [isMinting, setIsMinting] = React.useState(false);
  const [value, setValue] = React.useState<number | "">(1);

  const eligible = isEligible(activeKey);
  const quantity = value || 1;

  const handleMint = async () => {
    if (!activeKey) return;

    const validations = [
      {
        condition: !eligible,
        message: "You are not eligible to mint in this phase.",
      },
      {
        condition:
          currentPhase === 0 ||
          PHASE_MAP[currentPhase as keyof typeof PHASE_MAP] !== activeKey,
        message: `Mint not available. Active sale: ${PHASE_LABELS[currentPhase]}`,
      },
      {
        condition: !balanceData || balanceData.value === 0n,
        message: "Insufficient balance!",
      },
      {
        condition:
          (mintedCount ?? 0) + quantity > MAX_QUANTITY_PER_PHASE[activeKey],
        message: `Wallet limit exceeded! Max ${MAX_QUANTITY_PER_PHASE[activeKey]} allowed.`,
      },
    ];

    for (const v of validations) {
      if (v.condition) {
        toast.error(v.message, { duration: 3000 });
        return;
      }
    }

    setIsMinting(true);
    try {
      await mintNFT(activeKey, quantity);
      await refetchTotalSupply();
      await refetchMintCount();
    } catch (err: any) {
      toast.error("Mint failed. Please try again.");
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
          <p className="gtdpara">Start time</p>
          <h6 className="gtdhead">{TBD_TEXT}</h6>
        </div>
        <div className="innergtd">
          <p className="gtdpara">Time remaining</p>
          <h6 className="gtdhead">{TBD_TEXT}</h6>
        </div>
      </div>

      {address ? (
        <>
          <p className="publicpara">
            {eligible
              ? "You are eligible to Mint NFT"
              : "You are not eligible to Mint NFT"}
          </p>
          <button className="mintbtn" onClick={handleMint} disabled={isMinting}>
            {isMinting ? "Minting..." : "Mint now"}
          </button>
        </>
      ) : (
        <WalletButton className="connectbtn" />
      )}

      <DynamicModal
        show={mintSuccess}
        onHide={() => setMintSuccess(false)}
        type="success"
        mintedId={
          value && value > 1
            ? Array.from(
                { length: value },
                (_, i) => totalSupply - value + i + 1
              ).join(", ")
            : `${totalSupply}`
        }
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
