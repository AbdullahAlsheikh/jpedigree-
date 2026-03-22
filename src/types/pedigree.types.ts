export interface Individual {
  id: string;
  x: number;
  y: number;
  sex: "male" | "female";
  label: string;
  diseases: string[];
  affected: boolean;
  deceased: boolean;
}

export interface Partnership {
  id: string;
  individual1Id: string;
  individual2Id: string;
}

export interface Connection {
  id: string;
  partnershipId: string;
  childId: string;
}

export interface Disease {
  id: string;
  name: string;
  color: string;
}

export interface PedigreeState {
  individuals: Individual[];
  partnerships: Partnership[];
  connections: Connection[];
  diseases: Disease[];
}

export type Mode =
  | "male"
  | "female"
  | "partnership"
  | "child"
  | "drag"
  | "delete"
  | "disease"
  | "deceased";

export interface CanvasState {
  scale: number;
  panX: number;
  panY: number;
}
