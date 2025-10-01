"use client";

import React from "react";
import { useGlobalPhaseState } from "@/app/hooks/useGlobalPhaseState";
import { Phase, PHASE_STATUSES } from "@/app/constants";
import { formatTime } from "@/app/utils/helpers";

interface PhaseTimerProps {
  activeKey: Phase;
}

const PhaseTimer: React.FC<PhaseTimerProps> = ({ activeKey }) => {
  const { phases } = useGlobalPhaseState();
  const phaseState = phases[activeKey];

  const timeText =
    phaseState && phaseState.status === PHASE_STATUSES.ACTIVE
      ? formatTime(phaseState.remainingSeconds)
      : "--:--";

  return (
    <div className="innergtd">
      <p className="gtdpara">Time remaining</p>
      <h6 className="gtdhead">{timeText}</h6>
    </div>
  );
};

export default React.memo(PhaseTimer);
