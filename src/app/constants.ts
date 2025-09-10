export const MintNFTContract: `0x${string}` = "0x2F911C42812e92F4ab70a39eCc6f69197b2602f1";

export interface IPhases {
  GTD: "gtd";
  FCFS: "fcfs";
  PUBLIC: "public";
}

export const PHASES: IPhases = {
  GTD: "gtd",
  FCFS: "fcfs",
  PUBLIC: "public",
};

export const PHASE_MAP = {
  1: PHASES.GTD,
  2: PHASES.FCFS,
  3: PHASES.PUBLIC,
};

export const CONTRACT_FUNCTIONS = {
  CURRENT_PHASE: "currentPhase",
  TOTAL_SUPPLY: "totalSupply",
  MAX_SUPPLY: "MAX_SUPPLY",
} as const;
