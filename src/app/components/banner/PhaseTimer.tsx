"use client";

import React from "react";
import { useGlobalPhaseState } from "@/app/hooks/useGlobalPhaseState";
import { Phase } from "@/app/constants";

interface PhaseTimerProps {
  activeKey: Phase;
}

const PhaseTimer: React.FC<PhaseTimerProps> = ({ activeKey }) => {
  const { phases, formatTime } = useGlobalPhaseState();
  const phaseState = phases[activeKey];

  if (!phaseState) return null;

  return (
    <div className="innergtd">
      <p className="gtdpara">Time remaining</p>
      <h6 className="gtdhead">
        {phaseState.status === "active"
          ? formatTime(phaseState.remainingSeconds)
          : "--:--"}
      </h6>
    </div>
  );
};

export default React.memo(PhaseTimer);
