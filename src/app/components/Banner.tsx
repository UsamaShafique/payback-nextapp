"use client";

import React, { useState, useEffect } from "react";
import "../styles/banner.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DynamicModal from "./DynamicModal";
import { useMintNFT, useNftSupply } from "../hooks/useReadContract";
import { useAccount } from "wagmi";
import { CONTRACT_FUNCTIONS, PHASES, PHASE_MAP } from "../constants";
import PhaseTab from "./banner/PhaseTab";
import { useMintNFTWrite } from "../hooks/useMintNFTWrite";

import proofsGTDJson from "../utils/Proofs-GTD.json";
import proofsFCFSJson from "../utils/Proofs-FCFS.json";

type ProofsType = Record<string, { proof: string[] }>;

const Banner: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { currentPhase, currentPhaseLoading } = useMintNFT();
  const { totalSupply, maxSupply } = useNftSupply();

  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const [value, setValue] = useState<number | "">(1);
  const [eligibilityMap, setEligibilityMap] = useState<Record<string, boolean>>(
    {}
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const { presaleMint, publicMint, getGasFee } = useMintNFTWrite();

  const proofsGTD = Object.fromEntries(
    Object.entries(proofsGTDJson).map(([k, v]) => [k.toLowerCase(), v])
  ) as ProofsType;

  const proofsFCFS = Object.fromEntries(
    Object.entries(proofsFCFSJson).map(([k, v]) => [k.toLowerCase(), v])
  ) as ProofsType;

  useEffect(() => {
    setActiveKey(
      PHASE_MAP[currentPhase as keyof typeof PHASE_MAP] ?? undefined
    );
  }, [currentPhase]);

  useEffect(() => {
    const lowerAddr = address?.toLowerCase() ?? "";
    if (!isConnected || !address) {
      setEligibilityMap({});
      return;
    }

    setEligibilityMap({
      [PHASES.GTD]: Boolean(proofsGTD[lowerAddr]),
      [PHASES.FCFS]: Boolean(proofsFCFS[lowerAddr]),
      [PHASES.PUBLIC]: true,
    });
  }, [address, isConnected]);

  const handleMint = async () => {
    if (!address || !isConnected || !activeKey) return;

    try {
      const quantity = value || 1;
      let receipt;

      if (activeKey === PHASES.GTD) {
        const proof = proofsGTD[address.toLowerCase()]?.proof ?? [];
        if (proof.length === 0) {
          console.log(`Wallet not eligible for ${PHASES.GTD} phase`);
          return;
        }
        const gas = await getGasFee(
          CONTRACT_FUNCTIONS.PRESALE_MINT,
          [quantity, proof],
          address as `0x${string}`
        );

        console.log("Estimated Gas Fee:", gas.estimatedCostInEth, "ETH");

        receipt = await presaleMint(quantity, proof);
      } else if (activeKey === PHASES.FCFS) {
        const proof = proofsFCFS[address.toLowerCase()]?.proof ?? [];
        if (proof.length === 0) {
          console.log(`Wallet not eligible for ${PHASES.FCFS} phase`);
          return;
        }

        const gas = await getGasFee(
          CONTRACT_FUNCTIONS.PRESALE_MINT,
          [quantity, proof],
          address as `0x${string}`
        );

        console.log("Estimated Gas Fee:", gas.estimatedCostInEth, "ETH");

        receipt = await presaleMint(quantity, proof);
      } else if (activeKey === PHASES.PUBLIC) {
        const gas = await getGasFee(
          CONTRACT_FUNCTIONS.PUBLIC_MINT,
          [quantity],
          address as `0x${string}`
        );

        console.log("Estimated Gas Fee:", gas.estimatedCostInEth, "ETH");

        receipt = await publicMint(quantity);
      }

      if (receipt?.status === "success") {
        setShowSuccess(true);
      } else {
        setShowFailure(true);
      }
    } catch (err) {
      setShowFailure(true);
    }
  };

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
                  onMint={handleMint}
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
