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

  const now = Math.floor(Date.now() / 1000);

  let label = "Ended";
  let timeText = "--:--";
  if (phaseState) {
    if (phaseState?.status === PHASE_STATUSES?.UPCOMING) {
      label = "Starts in";
      const diff = phaseState?.startTime - now;
      timeText = diff > 0 ? formatTime(diff) : "--:--";
    } else if (phaseState?.status === PHASE_STATUSES.ACTIVE) {
      label = "Time remaining";
      timeText = formatTime(phaseState?.remainingSeconds);
    }
  }

  return (
    <div className="innergtd">
      <p className="gtdpara">{label}</p>
      <h6 className="gtdhead">{timeText}</h6>
    </div>
  );
};

export default React.memo(PhaseTimer);
