// "use client";

// import React from "react";
// import CounterInput from "../banner/CounterInput";
// import { WalletButton } from "../../components/WalletButton";
// import { useAccount, useBalance } from "wagmi";
// import {
//   MAX_QUANTITY_PER_PHASE,
//   Phase,
//   PHASE_MAP,
//   PhaseKey,
//   PHASE_LABELS,
//   TBD_TEXT,
// } from "@/app/constants";

// import {
//   useMintNFT,
//   useNftSupply,
//   useWalletMintCount,
// } from "@/app/hooks/useReadContract";
// import toast from "react-hot-toast";
// import DynamicModal from "../DynamicModal";
// import { useMintHandler } from "@/app/hooks/useMintHandler";
// import { useGlobalPhaseTimers } from "@/app/hooks/useGlobalPhaseTimers";
// import {
//   usePhaseMintedCount,
//   usePhaseMaxSupply,
// } from "@/app/hooks/usePhaseMintedCount";
// interface PhaseTabProps {
//   title: string;
//   activeKey: Phase;
// }

// const PhaseTab: React.FC<PhaseTabProps> = ({ title, activeKey }) => {
//   const { address } = useAccount();
//   const { data: balanceData } = useBalance({ address });
//   const { currentPhase } = useMintNFT();
//   const { totalSupply, refetchTotalSupply } = useNftSupply();
//   const { timers, formatTime } = useGlobalPhaseTimers();
//   const { phaseMinted } = usePhaseMintedCount(activeKey);
// const { phaseMaxSupply } = usePhaseMaxSupply(activeKey);

//   const phaseTimer = timers[title as Phase];
//   const { mintedCount, refetch: refetchMintCount } = useWalletMintCount(
//     address,
//     activeKey
//   );

//   const {
//     mintNFT,
//     isEligible,
//     mintSuccess,
//     mintFailure,
//     mintError,
//     setMintSuccess,
//     setMintFailure,
//     setMintError,
//   } = useMintHandler();

//   const [isMinting, setIsMinting] = React.useState(false);
//   const [value, setValue] = React.useState<number | "">(1);

//   const eligible = isEligible(activeKey);
//   const quantity = value || 1;

//   const isActive = phaseTimer.status === "active";
//   const isExpired = phaseTimer.status === "expired";
//   const handleMint = async () => {
//     if (!activeKey) return;
//     const validations = [
//       {
//         condition: !eligible,
//         message: "You are not eligible to mint in this phase.",
//       },
//       {
//         condition:
//           currentPhase === 0 ||
//           PHASE_MAP[currentPhase as keyof typeof PHASE_MAP] !== activeKey,
//         message: `Mint not available. Active sale: ${PHASE_LABELS[currentPhase]}`,
//       },
//       {
//         condition: !isActive,
//         message: "This phase is not active yet or has expired.",
//       },
//       {
//         condition: isExpired,
//         message: "This phase has expired. Please wait for the next sale.",
//       },
//       {
//         condition: !balanceData || balanceData.value === 0n,
//         message: "Insufficient balance!",
//       },
//       {
//         condition:
//           (mintedCount ?? 0) + quantity > MAX_QUANTITY_PER_PHASE[activeKey],
//         message: `Wallet limit exceeded! Max ${MAX_QUANTITY_PER_PHASE[activeKey]} allowed.`,
//       },
//     ];

//     for (const v of validations) {
//       if (v.condition) {
//         toast.error(v.message, { duration: 3000 });
//         return;
//       }
//     }

//     setIsMinting(true);
//     try {
//       await mintNFT(activeKey, quantity);
//       await refetchTotalSupply();
//       await refetchMintCount();
//     } catch (err: any) {
//       toast.error("Mint failed. Please try again.");
//     } finally {
//       setIsMinting(false);
//     }
//   };

//   return (
//     <div className="phasetab-container">
//       <h1 className="whitlisthead">{title.toUpperCase()}</h1>

//       <CounterInput
//         value={value}
//         onChange={setValue}
//         phase={title as PhaseKey}
//       />

//       <div className="maingtd">

//         <div className="innergtd">

//           <p className="gtdpara">Status</p>

//           <h6 className="gtdhead">{phaseTimer.status}</h6>
//         </div>
//         <div className="innergtd">
//           <p className="gtdpara">Time remaining</p>
//           <h6 className="gtdhead">
//             {phaseTimer.status === "active"
//               ? formatTime(phaseTimer.remainingSeconds)
//               : "--:--"}
//           </h6>

//         </div>
//         <div className="innergtd">
//     <p className="gtdpara">Phase Supply</p>
//     <h6 className="gtdhead">
//       {phaseMinted ?? 0}/{phaseMaxSupply ?? 0}
//     </h6>
//   </div>

//       </div>

//       {address ? (
//         <>
//           {isActive && (
//             <p className="publicpara">
//               {eligible
//                 ? "You are eligible to Mint NFT"
//                 : "You are not eligible to Mint NFT"}
//             </p>
//           )}

//           {isExpired && <p className="publicpara">This phase has expired.</p>}

//           {!isActive && !isExpired && (
//             <p className="publicpara">This phase has not started yet.</p>
//           )}

//           <button className="mintbtn" onClick={handleMint} disabled={isMinting}>
//             {isMinting ? "Minting..." : "Mint now"}
//           </button>
//         </>
//       ) : (
//         <WalletButton className="connectbtn" />
//       )}

//       <DynamicModal
//         show={mintSuccess}
//         onHide={() => setMintSuccess(false)}
//         type="success"
//         mintedId={
//           value && value > 1
//             ? Array.from(
//                 { length: value },
//                 (_, i) => totalSupply - value + i + 1
//               ).join(", ")
//             : `${totalSupply}`
//         }
//       />
//       <DynamicModal
//         show={mintFailure}
//         type="failure"
//         onHide={() => {
//           setMintFailure(false);
//           setMintError(null);
//         }}
//         errorMessage={mintError}
//       />
//     </div>
//   );
// };

// export default PhaseTab;

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
import DynamicModal from "../DynamicModal";
import { useMintHandler } from "@/app/hooks/useMintHandler";
import { useGlobalPhaseState } from "@/app/hooks/useGlobalPhaseState";

interface PhaseTabProps {
  title: string;
  activeKey: Phase;
}

const PhaseTab: React.FC<PhaseTabProps> = ({ title, activeKey }) => {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { currentPhase } = useMintNFT();
  const { totalSupply, refetchTotalSupply } = useNftSupply();

  // ✅ now pulling everything from the global hook
  const { phases, formatTime } = useGlobalPhaseState();
  const phaseState = phases[activeKey];

  const { mintedCount, refetch: refetchMintCount } = useWalletMintCount(
    address,
    activeKey
  );

  const {
    mintNFT,
    isEligible,
    mintSuccess,
    mintFailure,
    mintError,
    setMintSuccess,
    setMintFailure,
    setMintError,
  } = useMintHandler();

  const [isMinting, setIsMinting] = React.useState(false);
  const [value, setValue] = React.useState<number | "">(1);

  const eligible = isEligible(activeKey);
  const quantity = value || 1;

  const isActive = phaseState?.status === "active";
  const isExpired = phaseState?.status === "expired";

  const handleMint = async () => {
    if (!activeKey) return;
    const validations = [
      {
        condition: !eligible,
        message: "You are not eligible to mint in this phase.",
      },
      {
        condition:
          currentPhase === 0 ||
          PHASE_MAP[currentPhase as keyof typeof PHASE_MAP] !== activeKey,
        message: `Mint not available. Active sale: ${PHASE_LABELS[currentPhase]}`,
      },
      {
        condition: !isActive,
        message: "This phase is not active yet or has expired.",
      },
      {
        condition: isExpired,
        message: "This phase has expired. Please wait for the next sale.",
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
        onChange={setValue}
        phase={title as PhaseKey}
      />

      <div className="maingtd">
        <div className="innergtd">
          <p className="gtdpara">Status</p>
          <h6 className="gtdhead">{phaseState?.status}</h6>
        </div>

        <div className="innergtd">
          <p className="gtdpara">Time remaining</p>
          <h6 className="gtdhead">
            {phaseState?.status === "active"
              ? formatTime(phaseState.remainingSeconds)
              : "--:--"}
          </h6>
        </div>

        <div className="innergtd">
        <p className="gtdpara">Phase Supply</p>
        <h6 className="gtdhead">
          {isActive || isExpired
            ? `${phaseState?.minted ?? 0}/${phaseState?.effectiveSupply ?? 0}`
            : "--/--"}
        </h6>
    </div>
      </div>

      {address ? (
        <>
          {isActive && (
            <p className="publicpara">
              {eligible
                ? "You are eligible to Mint NFT"
                : "You are not eligible to Mint NFT"}
            </p>
          )}

          {isExpired && <p className="publicpara">This phase has expired.</p>}

          {!isActive && !isExpired && (
            <p className="publicpara">This phase has not started yet.</p>
          )}

          <button className="mintbtn" onClick={handleMint} disabled={isMinting}>
            {isMinting ? "Minting..." : "Mint now"}
          </button>
        </>
      ) : (
        <WalletButton className="connectbtn" />
      )}

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
    </div>
  );
};

export default PhaseTab;
