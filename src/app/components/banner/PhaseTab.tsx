"use client";

import React from "react";
import CounterInput from "../banner/CounterInput";
import { WalletButton } from "../../components/WalletButton";
import { useAccount } from "wagmi";

interface PhaseTabProps {
  title: string;
  value: number | "";
  onValueChange: (val: number | "") => void;
  onMint: () => void;
  isEligible?: boolean;
  startTime?: string;
  timeRemaining?: string;
  price?: number;
}

const PhaseTab: React.FC<PhaseTabProps> = ({
  title,
  value,
  onValueChange,
  onMint,
  isEligible = false,
  startTime = "TBD",
  timeRemaining = "TBD",
  price = 0.03,
}) => {
  const { address } = useAccount();
  const total = typeof value === "number" ? value * price : 0;

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
          <button className="mintbtn" onClick={onMint} disabled={!isEligible}>
            Mint now
          </button>
        </>
      ) : (
        <WalletButton className="connectbtn" />
      )}
    </div>
  );
};

export default PhaseTab;
