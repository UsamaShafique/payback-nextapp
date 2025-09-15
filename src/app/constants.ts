export const MintNFTContract: `0x${string}` =
  "0x2F911C42812e92F4ab70a39eCc6f69197b2602f1";

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

export const PHASE_LABELS: Record<number, string> = {
  0: "None",
  1: "GTD",
  2: "FCFS",
  3: "Public",
};

export const CONTRACT_FUNCTIONS = {
  CURRENT_PHASE: "currentPhase",
  TOTAL_SUPPLY: "totalSupply",
  MAX_SUPPLY: "MAX_SUPPLY",
  PRESALE_MINT: "presaleMint",
  PUBLIC_MINT: "publicMint",
  PUBLIC_MINT_COUNT: "publicMintCount",
  GTD_MINT_COUNT: "wlGtdMintCount",
  FCFS_MINT_COUNT: "wlFcfsMintCount",
} as const;

export const EXPLORER_BASE = "https://sepolia.etherscan.io";

export const MAX_QUANTITY_PER_PHASE = {
  gtd: 1,
  fcfs: 1,
  public: 2,
} as const;

export type PhaseKey = keyof typeof MAX_QUANTITY_PER_PHASE;

export type Phase = (typeof PHASES)[keyof typeof PHASES];
