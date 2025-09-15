"use client";

import React, { useState, useEffect } from "react";
import "../styles/banner.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useMintNFT, useNftSupply } from "../hooks/useReadContract";
import { PHASES, PHASE_MAP, Phase } from "../constants";
import PhaseTab from "./banner/PhaseTab";

const Banner: React.FC = () => {
  const { currentPhase, currentPhaseLoading } = useMintNFT();
  const { totalSupply, maxSupply } = useNftSupply();
  const [activeKey, setActiveKey] = useState<Phase | undefined>(undefined);

  useEffect(() => {
    if (currentPhase) {
      setActiveKey(
        PHASE_MAP[currentPhase as keyof typeof PHASE_MAP] ?? undefined
      );
    }
  }, [currentPhase]);

  if (currentPhaseLoading) return <p>Loading mint phase...</p>;

  return (
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
            {totalSupply ?? 0}/{maxSupply ?? 0}
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
              <PhaseTab title={phase} activeKey={activeKey as Phase} />
            </Tab>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Banner;
