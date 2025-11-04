import { activeChain } from "../wagmi";
export const MintNFTContract: `0x${string}` =
  "0xD174Fac2cB38eFA93929d09da624eA821728B8a1";

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
  GTD_START_TIME: "gtdStartTime",
  GTD_END_TIME: "gtdEndTime",
  FCFS_START_TIME: "fcfsStartTime",
  FCFS_END_TIME: "fcfsEndTime",
  PUBLIC_START_TIME: "publicStartTime",
  PUBLIC_END_TIME: "publicEndTime",
  GTD_REMAINING_SUPPLY: "getRemainingAmount",
  FCFS_REMAINING_SUPPLY: "getRemainingAmount",
  PUBLIC_REMAINING_SUPPLY: "getRemainingAmount",
} as const;

interface chainExplorerType {
  [key: number]: string;
}

export const EXPLORER_BY_CHAIN: chainExplorerType = {
  11155111: "https://sepolia.etherscan.io",
  1: "https://etherscan.io",
};

export const MAX_QUANTITY_PER_PHASE = {
  gtd: 1,
  fcfs: 1,
  public: 2,
} as const;

export type PhaseKey = keyof typeof MAX_QUANTITY_PER_PHASE;

export type Phase = (typeof PHASES)[keyof typeof PHASES];

export const PHASE_ORDER = ["gtd", "fcfs", "public"] as const;
export const PHASE_STATUSES = {
  UPCOMING: "upcoming",
  ACTIVE: "active",
  EXPIRED: "expired",
} as const;
export type PhaseStatus = (typeof PHASE_STATUSES)[keyof typeof PHASE_STATUSES];

export const PHASE_BASE_ID: Record<Phase, number> = {
  gtd: 1,
  fcfs: 2,
  public: 3,
};
