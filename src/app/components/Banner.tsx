"use client";

import React, { useState, useEffect } from "react";
import "../styles/banner.scss";
import { Modal } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DynamicModal from "./DynamicModal";
import { WalletButton } from "./WalletButton";
import {  useMintNFT, useNftSupply } from "../hooks/useReadContract";

import { useAccount } from "wagmi";
import { PHASES, PHASE_MAP } from "../constants";
import PhaseTab from "./banner/PhaseTab";

const Banner: React.FC = () => {
  const { isConnected } = useAccount();
  const { currentPhase, currentPhaseLoading } = useMintNFT();
  const { totalSupply, maxSupply } = useNftSupply();
  const defaultTab = PHASE_MAP[currentPhase as keyof typeof PHASE_MAP] ?? "og";
  const [activeKey, setActiveKey] = useState<string>("og");
  const [value, setValue] = useState<number | "">(1);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const handleCloseSuccess = () => setShowSuccess(false);
  const handleShowSuccess = () => setShowSuccess(true);
  const [showFailure, setShowFailure] = useState<boolean>(false);

  useEffect(() => {
    if (currentPhase) {
      setActiveKey(PHASE_MAP[currentPhase as keyof typeof PHASE_MAP] ?? "og");
    }
  }, [currentPhase]);

  if (currentPhaseLoading) return <p>Loading mint phase...</p>;


  return (
    <>
      <section className="mainbanner">
        <img src="/assets/bannerbg.png" alt="bannerbg" className="bannerbg d-noneformobile" />
        <img src="/assets/bannerbgmbl.png" alt="bannerbg" className="bannerbg d-none d-blockformobile" />

        <div className="rightman">
          <div className="innertexts">
            <h6 className="numbers">{totalSupply}/{maxSupply}</h6>
            <h1 className="mintedhead">Minted</h1>
          </div>
          <img src="/assets/rightman.png" alt="rightmanimg" className="rightmanimg" />
        </div>

        <div className="bannertexts">
          <Tabs
            id="mint-tabs"
            activeKey={activeKey}
            onSelect={(k) => k && setActiveKey(k)}
            className="bannertabs"
          >
            {Object.entries(PHASES).map(([key, label]) => (
              <Tab key={key} eventKey={key} title={label.toUpperCase()}>
                <PhaseTab
                  title={label}
                  isConnected={isConnected}
                  value={value}
                  onValueChange={setValue}
                  onMint={() => setShowSuccess(true)}
                />
              </Tab>
            ))}
          </Tabs>
        </div>
      </section>

      <DynamicModal show={showSuccess} onHide={() => setShowSuccess(false)} type="success" />
      <DynamicModal show={showFailure} onHide={() => setShowFailure(false)} type="failure" />
    </>
  );
};

export default Banner;
