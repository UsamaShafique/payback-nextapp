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
} from "@/app/constants";
import {
  useMintNFT,
  useNftSupply,
  useWalletMintCount,
} from "@/app/hooks/useReadContract";
import toast from "react-hot-toast";

interface PhaseTabProps {
  title: string;
  value: number | "";
  onValueChange: (val: number | "") => void;
  isEligible?: boolean;
  startTime?: string;
  timeRemaining?: string;
  price?: number;
  quantity: number;
  activeKey: Phase;
  mintNFT: (phase: Phase, quantity: number) => Promise<any>;
}

const PhaseTab: React.FC<PhaseTabProps> = ({
  title,
  value,
  onValueChange,
  isEligible = false,
  startTime = "TBD",
  timeRemaining = "TBD",
  quantity,
  activeKey,
  mintNFT,
}) => {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { currentPhase } = useMintNFT();

  const { refetchTotalSupply } = useNftSupply();
  const [isMinting, setIsMinting] = React.useState(false);
  const { mintedCount, refetch: refetchMintCount } = useWalletMintCount(
    address,
    activeKey
  );

  const handleMint = async () => {
    if (!activeKey) return;

    const validations: { condition: boolean; message: string }[] = [
      {
        condition: !isEligible,
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
      console.error(err);
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
        onChange={onValueChange}
        phase={title as PhaseKey}
      />

      <div className="maingtd">
        <div className="innergtd">
          <p className="gtdpara">Start time</p>
          <h6 className="gtdhead">{startTime}</h6>
        </div>
        <div className="innergtd">
          <p className="gtdpara">Time remaining</p>
          <h6 className="gtdhead">{timeRemaining}</h6>
        </div>
      </div>

      {address ? (
        <>
          <p className="publicpara">
            {isEligible
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
    </div>
  );
};

export default PhaseTab;
