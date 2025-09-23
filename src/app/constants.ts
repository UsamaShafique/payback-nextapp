export const MintNFTContract: `0x${string}` =
  "0x626FbEF4A0477A97287eE3A3d91EC31a73965E5c";

// Total collection size
export const TOTAL_COLLECTION_SIZE = 999;

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
  PUBLIC_MINTED_COUNT: "publicMinted",
  GTD_MINTED_COUNT: "wlGtdMinted",
  FCFS_MINTED_COUNT: "wlFcfsMinted",
  GTD_MAX_SUPPLY: "WL_GTD_SUPPLY",
  FCFS_MAX_SUPPLY: "FCFS_SUPPLY",
  PUBLIC_MAX_SUPPLY: "MAX_SUPPLY",
  GTD_END_TIME: "gtdPhaseTime",
  FCFS_END_TIME: "fcfsPhaseTime",
  PUBLIC_END_TIME: "publicPhaseTime",
} as const;

export const EXPLORER_BASE = "https://sepolia.etherscan.io";
export const TBD_TEXT = "TBD";

export const MAX_QUANTITY_PER_PHASE = {
  gtd: 1,
  fcfs: 1,
  public: 2,
} as const;

export type PhaseKey = keyof typeof MAX_QUANTITY_PER_PHASE;

export type Phase = (typeof PHASES)[keyof typeof PHASES];

export const STORAGE_KEYS = {
  MINT_START: "mint_start_time",
};

export const PHASE_ORDER = ["gtd", "fcfs", "public"] as const;
export const PHASE_STATUSES = ["upcoming", "active", "expired"] as const;
export type PhaseStatus = (typeof PHASE_STATUSES)[number];
