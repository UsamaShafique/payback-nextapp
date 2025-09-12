"use client";

import React from "react";
import CounterInput from "../banner/CounterInput";
import { WalletButton } from "../../components/WalletButton";
import { useAccount } from "wagmi";
import { Phase } from "@/app/constants";
import { useNftSupply } from "@/app/hooks/useReadContract";

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
  price = 0.03,
  quantity,
  activeKey,
  mintNFT,
}) => {
  const { address } = useAccount();
  const { refetchTotalSupply } = useNftSupply();
  const [isMinting, setIsMinting] = React.useState(false);
  const handleMint = async () => {
    if (!activeKey) return;
    setIsMinting(true);
    try {
      await mintNFT(activeKey, quantity);
      await refetchTotalSupply();
    } catch (err) {
      throw err;
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="phasetab-container">
      <h1 className="whitlisthead">{title.toUpperCase()}</h1>

      <CounterInput value={value} onChange={onValueChange} />
      <div className="details">
        {/* <p className="detailpara">Price: {price} ETH</p> */}
        {/* <p className="detailpara">Total: {total.toFixed(3)} ETH</p> */}
      </div>

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
