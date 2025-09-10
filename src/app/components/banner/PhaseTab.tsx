"use client";
import React from "react";
import CounterInput from "../banner/CounterInput";
import { WalletButton } from "../../components/WalletButton";

interface PhaseTabProps {
  title: string;
  isConnected: boolean;
  value: number | "";
  onValueChange: (val: number | "") => void;
  onMint: () => void;
}

const PhaseTab: React.FC<PhaseTabProps> = ({
  title,
  isConnected,
  value,
  onValueChange,
  onMint,
}) => (
  <div>
    <h1 className="whitlisthead">{title.toUpperCase()}</h1>

    {!isConnected && (
      <>
        <CounterInput value={value} onChange={onValueChange} />
        <div className="details">
          <p className="detailpara">Price: 0.03 ETH</p>
          <p className="detailpara">Total: 0.03 ETH</p>
        </div>
      </>
    )}

    <div className="maingtd">
      <div className="innergtd">
        <p className="gtdpara">Start time</p>
        <h6 className="gtdhead">
          {!isConnected && <span>27th Aug</span>}
          14:18:13
          {!isConnected && <span>EST</span>}
        </h6>
      </div>
      <div className="innergtd">
        <p className="gtdpara">Time remaining</p>
        <h6 className="gtdhead">TBD</h6>
      </div>
    </div>

    {isConnected ? (
      <>
        <p className="publicpara">public mint starts in 2 days</p>
        <button className="mintbtn" onClick={onMint}>
          Mint now
        </button>
        <span className="eligiblespan">You are eligible to Mint NFT</span>
      </>
    ) : (
      <WalletButton className="connectbtn" />
    )}
  </div>
);

export default PhaseTab;
