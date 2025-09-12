"use client";

import React from "react";
import CounterInput from "../banner/CounterInput";
import { WalletButton } from "../../components/WalletButton";
import { useAccount, useBalance } from "wagmi";
import { MAX_QUANTITY_PER_PHASE, Phase, PhaseKey } from "@/app/constants";
import { useNftSupply, useWalletMintCount } from "@/app/hooks/useReadContract";
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
  const { data: balanceData } = useBalance({ address }); // wagmi hook to get ETH balance
  const { refetchTotalSupply } = useNftSupply();
  const [isMinting, setIsMinting] = React.useState(false);
  const { mintedCount, refetch: refetchMintCount } = useWalletMintCount(
    address,
    activeKey
  );

  const handleMint = async () => {
    if (!activeKey) return;
    if (!balanceData || balanceData.value === 0n) {
      toast.error("Insufficient balance!", { duration: 3000 });
      return;
    }
    const maxPerPhase = MAX_QUANTITY_PER_PHASE[activeKey];
    if (mintedCount + quantity > maxPerPhase) {
      toast.error(
        `Your wallet mint limit of ${maxPerPhase} for this phase is exceeded!`
      );
      return;
    }
    setIsMinting(true);

    try {
      await mintNFT(activeKey, quantity);
      await refetchTotalSupply();
      await refetchMintCount();
    } catch (err: any) {
      console.log(err);
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
          <button
            className="mintbtn"
            onClick={handleMint}
            disabled={!isEligible || isMinting}
          >
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
