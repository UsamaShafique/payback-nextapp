"use client";

import React, { useState, useEffect } from "react";
import "../styles/banner.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DynamicModal from "./DynamicModal";
import { WalletButton } from "./WalletButton";
import { useMintNFT, useNftSupply } from "../hooks/useReadContract";
import { useAccount } from "wagmi";
import { PHASES, PHASE_MAP } from "../constants";
import PhaseTab from "./banner/PhaseTab";

import proofsGTDJson from "../utils/Proofs-GTD.json";
import proofsFCFSJson from "../utils/Proofs-FCFS.json";

type ProofsType = Record<string, { proof: string[] }>;

const Banner: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { currentPhase, currentPhaseLoading } = useMintNFT();
  const { totalSupply, maxSupply } = useNftSupply();

  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const [value, setValue] = useState<number | "">(1);
  const [eligibilityMap, setEligibilityMap] = useState<Record<string, boolean>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const proofsGTD = Object.fromEntries(
    Object.entries(proofsGTDJson).map(([k, v]) => [k.toLowerCase(), v])
  ) as ProofsType;
  
  const proofsFCFS = Object.fromEntries(
    Object.entries(proofsFCFSJson).map(([k, v]) => [k.toLowerCase(), v])
  ) as ProofsType;
  

  // Set active tab based on currentPhase
  useEffect(() => {
    setActiveKey(PHASE_MAP[currentPhase as keyof typeof PHASE_MAP] ?? undefined);
  }, [currentPhase]);

  // Compute eligibility per tab
  useEffect(() => {
    const lowerAddr = address?.toLowerCase() ?? "";
    if (!isConnected || !address) {
      setEligibilityMap({});
      return;
    }
console.log(lowerAddr ,"addresss")
    setEligibilityMap({
      [PHASES.GTD]: Boolean(proofsGTD[lowerAddr]),
      [PHASES.FCFS]: Boolean(proofsFCFS[lowerAddr]),
      [PHASES.PUBLIC]: true,
    });
  }, [address, isConnected]);

  if (currentPhaseLoading) return <p>Loading mint phase...</p>;

  
  return (
    <>
      <section className="mainbanner">
        <img
          src="/assets/bannerbg.png"
          alt="bannerbg"
          className="bannerbg d-noneformobile"
        />
        <img
          src="/assets/bannerbgmbl.png"
          alt="bannerbg"
          className="bannerbg d-none d-blockformobile"
        />

        <div className="rightman">
          <div className="innertexts">
            <h6 className="numbers">
              {totalSupply}/{maxSupply}
            </h6>
            <h1 className="mintedhead">Minted</h1>
          </div>
          <img
            src="/assets/rightman.png"
            alt="rightmanimg"
            className="rightmanimg"
          />
        </div>

        <div className="bannertexts">
          <Tabs
            id="mint-tabs"
            activeKey={activeKey}
            onSelect={(k) => k && setActiveKey(k)}
            className="bannertabs"
          >
            {Object.entries(PHASES).map(([_, label]) => (
              <Tab key={label} eventKey={label} title={label.toUpperCase()}>
                <PhaseTab
                  title={label}
                  isConnected={isConnected}
                  value={value}
                  onValueChange={setValue}
                  onMint={() => setShowSuccess(true)}
                  isEligible={eligibilityMap[label] ?? false}
                  price={0.03}
                  startTime="TBD"
                  timeRemaining="TBD"
                />
              </Tab>
            ))}
          </Tabs>
        </div>
      </section>

      <DynamicModal
        show={showSuccess}
        onHide={() => setShowSuccess(false)}
        type="success"
      />
      <DynamicModal
        show={showFailure}
        onHide={() => setShowFailure(false)}
        type="failure"
      />
    </>
  );
};

export default Banner;
