"use client";

import React, { useState, useEffect } from "react";
import "../styles/banner.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DynamicModal from "./DynamicModal";
import { useMintNFT, useNftSupply } from "../hooks/useReadContract";
import { PHASES, PHASE_MAP, Phase } from "../constants";
import PhaseTab from "./banner/PhaseTab";
import { useMintHandler } from "../hooks/useMintHandler";

const Banner: React.FC = () => {
  const { currentPhase, currentPhaseLoading } = useMintNFT();
  const { totalSupply, maxSupply, refetchTotalSupply } = useNftSupply();
  const {
    mintNFT,
    mintSuccess,
    mintFailure,
    setMintSuccess,
    setMintFailure,
    isEligible,
    mintError,
    setMintError,
  } = useMintHandler();

  const [activeKey, setActiveKey] = useState<Phase | undefined>(undefined);
  const [value, setValue] = useState<number | "">(1);

  useEffect(() => {
    if(currentPhase){
    setActiveKey(
      PHASE_MAP[currentPhase as keyof typeof PHASE_MAP] ?? undefined
    );
  }
  }, [currentPhase]);

  if (currentPhaseLoading) return <p>Loading mint phase...</p>;

  const eligibilityMap: Record<Phase, boolean> = {
    [PHASES.GTD]: isEligible(PHASES.GTD),
    [PHASES.FCFS]: isEligible(PHASES.FCFS),
    [PHASES.PUBLIC]: true,
  };

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
            onSelect={(k) => k && setActiveKey(k as Phase)}
            className="bannertabs"
          >
            {Object.values(PHASES).map((phase) => (
              <Tab key={phase} eventKey={phase} title={phase.toUpperCase()}>
                <PhaseTab
                  title={phase}
                  value={value}
                  onValueChange={setValue}
                  isEligible={eligibilityMap[phase as Phase]}
                  startTime="TBD"
                  timeRemaining="TBD"
                  quantity={value || 1}
                  activeKey={activeKey as Phase}
                  mintNFT={mintNFT}
                />
              </Tab>
            ))}
          </Tabs>
        </div>
      </section>

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
    </>
  );
};

export default Banner;
