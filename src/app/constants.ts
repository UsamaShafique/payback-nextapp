export const  MintNFTContract:`0x${string}`= "0x22894A46E759694Ed97EE911a76BB63b1DE3d9A6";

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
