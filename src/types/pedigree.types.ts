export interface Individual {
  id: string;
  x: number;
  y: number;
  sex: "male" | "female" | "unknown";
  label: string;
  conditions: string[];
  affected: boolean;
  deceased: boolean;
  age?: number;
  ageOfDeath?: number;
  causeOfDeath?: string;
  conditionAgeOfDiagnosis: Record<string, number>;
}

export interface Partnership {
  id: string;
  individual1Id: string;
  individual2Id: string;
}

export interface Connection {
  id: string;
  partnershipId?: string;
  parentId?: string;
  childId: string;
}

export interface Condition {
  id: string;
  name: string;
  color: string;
}

export interface LayoutSettings {
  partnerGap: number;
  siblingSpacing: number;
  familySeparation: number;
  generationSpacing: number;
}

export interface AppSettings {
  exportFilename: string;
  layout: LayoutSettings;
}

export interface PedigreeState {
  individuals: Individual[];
  partnerships: Partnership[];
  connections: Connection[];
  conditions: Condition[];
}

export type Mode =
  | "male"
  | "female"
  | "unknown"
  | "partnership"
  | "child"
  | "drag"
  | "delete"
  | "condition"
  | "deceased";

export interface CanvasState {
  scale: number;
  panX: number;
  panY: number;
}
