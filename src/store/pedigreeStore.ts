import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  Individual,
  Partnership,
  Connection,
  Disease,
  Mode,
} from "../types/pedigree.types";

interface PedigreeStore {
  // State
  individuals: Individual[];
  partnerships: Partnership[];
  connections: Connection[];
  diseases: Disease[];
  currentMode: Mode;
  childGender: "male" | "female";
  currentDiseaseId: string | null;
  selectedIndividuals: Individual[];
  selectedPartnership: string | null;
  draggedIndividual: Individual | null;
  scale: number;
  history: Array<{
    individuals: Individual[];
    partnerships: Partnership[];
    connections: Connection[];
  }>;

  // Actions
  addIndividual: (individual: Individual) => void;
  removeIndividual: (id: string) => void;
  updateIndividual: (id: string, updates: Partial<Individual>) => void;

  addPartnership: (partnership: Partnership) => void;
  removePartnership: (id: string) => void;

  addConnection: (connection: Connection) => void;
  removeConnection: (id: string) => void;

  addDisease: (disease: Disease) => void;
  removeDisease: (id: string) => void;
  updateDisease: (id: string, updates: Partial<Disease>) => void;

  setMode: (mode: Mode) => void;
  setChildGender: (gender: "male" | "female") => void;
  setCurrentDiseaseId: (id: string | null) => void;
  setSelectedIndividuals: (individuals: Individual[]) => void;
  setSelectedPartnership: (partnershipId: string | null) => void;
  setDraggedIndividual: (individual: Individual | null) => void;
  setScale: (scale: number) => void;

  toggleDiseaseForIndividual: (individualId: string, diseaseId: string) => void;
  toggleDeceased: (individualId: string) => void;

  saveHistory: () => void;
  undo: () => void;
  clear: () => void;
  autoLayout: () => void;
}

const DEFAULT_DISEASE: Disease = {
  id: "1",
  name: "Disease 1",
  color: "#000000",
};

export const usePedigreeStore = create<PedigreeStore>()(
  immer((set, get) => ({
    // Initial state
    individuals: [],
    partnerships: [],
    connections: [],
    diseases: [DEFAULT_DISEASE],
    currentMode: "male",
    childGender: "female",
    currentDiseaseId: "1",
    selectedIndividuals: [],
    selectedPartnership: null,
    draggedIndividual: null,
    scale: 1,
    history: [],

    // Individual actions
    addIndividual: (individual) =>
      set((state) => {
        state.individuals.push(individual);
      }),

    removeIndividual: (id) =>
      set((state) => {
        state.individuals = state.individuals.filter((ind) => ind.id !== id);
        state.partnerships = state.partnerships.filter(
          (p) => p.individual1Id !== id && p.individual2Id !== id,
        );
        state.connections = state.connections.filter((c) => c.childId !== id);
      }),

    updateIndividual: (id, updates) =>
      set((state) => {
        const individual = state.individuals.find((ind) => ind.id === id);
        if (individual) {
          Object.assign(individual, updates);
        }
      }),

    // Partnership actions
    addPartnership: (partnership) =>
      set((state) => {
        state.partnerships.push(partnership);
      }),

    removePartnership: (id) =>
      set((state) => {
        state.partnerships = state.partnerships.filter((p) => p.id !== id);
        state.connections = state.connections.filter(
          (c) => c.partnershipId !== id,
        );
      }),

    // Connection actions
    addConnection: (connection) =>
      set((state) => {
        state.connections.push(connection);
      }),

    removeConnection: (id) =>
      set((state) => {
        state.connections = state.connections.filter((c) => c.id !== id);
      }),

    // Disease actions
    addDisease: (disease) =>
      set((state) => {
        state.diseases.push(disease);
      }),

    removeDisease: (id) =>
      set((state) => {
        state.diseases = state.diseases.filter((d) => d.id !== id);
        state.individuals.forEach((ind) => {
          ind.diseases = ind.diseases.filter((diseaseId) => diseaseId !== id);
        });
      }),

    updateDisease: (id, updates) =>
      set((state) => {
        const disease = state.diseases.find((d) => d.id === id);
        if (disease) {
          Object.assign(disease, updates);
        }
      }),

    // UI actions
    setMode: (mode) =>
      set((state) => {
        state.currentMode = mode;
      }),

    setChildGender: (gender) =>
      set((state) => {
        state.childGender = gender;
      }),

    setCurrentDiseaseId: (id) =>
      set((state) => {
        state.currentDiseaseId = id;
      }),

    setSelectedIndividuals: (individuals) =>
      set((state) => {
        state.selectedIndividuals = individuals;
      }),

    setSelectedPartnership: (partnershipId) =>
      set((state) => {
        state.selectedPartnership = partnershipId;
      }),

    setDraggedIndividual: (individual) =>
      set((state) => {
        state.draggedIndividual = individual;
      }),

    setScale: (scale) =>
      set((state) => {
        state.scale = scale;
      }),

    // Toggle disease for individual
    toggleDiseaseForIndividual: (individualId, diseaseId) =>
      set((state) => {
        const individual = state.individuals.find(
          (ind) => ind.id === individualId,
        );
        if (individual) {
          const hasDisease = individual.diseases.includes(diseaseId);
          if (hasDisease) {
            individual.diseases = individual.diseases.filter(
              (id) => id !== diseaseId,
            );
          } else {
            individual.diseases.push(diseaseId);
          }
          individual.affected = individual.diseases.length > 0;
        }
      }),

    // Toggle deceased
    toggleDeceased: (individualId) =>
      set((state) => {
        const individual = state.individuals.find(
          (ind) => ind.id === individualId,
        );
        if (individual) {
          individual.deceased = !individual.deceased;
        }
      }),

    // History
    saveHistory: () =>
      set((state) => {
        state.history.push({
          individuals: JSON.parse(JSON.stringify(state.individuals)),
          partnerships: JSON.parse(JSON.stringify(state.partnerships)),
          connections: JSON.parse(JSON.stringify(state.connections)),
        });
        if (state.history.length > 20) {
          state.history.shift();
        }
      }),

    undo: () =>
      set((state) => {
        const previous = state.history.pop();
        if (previous) {
          state.individuals = previous.individuals;
          state.partnerships = previous.partnerships;
          state.connections = previous.connections;
        }
      }),

    clear: () =>
      set((state) => {
        state.individuals = [];
        state.partnerships = [];
        state.connections = [];
        state.selectedIndividuals = [];
        state.selectedPartnership = null;
      }),

    // Auto-layout algorithm
    autoLayout: () =>
      set((state) => {
        if (state.individuals.length === 0) return;

        const generationMap = new Map<number, Individual[]>();
        const processed = new Set<string>();

        // Find root individuals (no parents)
        const roots = state.individuals.filter(
          (ind) => !state.connections.some((conn) => conn.childId === ind.id),
        );

        // BFS to assign generations
        const assignGeneration = (
          individual: Individual,
          generation: number,
        ) => {
          if (processed.has(individual.id)) return;
          processed.add(individual.id);

          if (!generationMap.has(generation)) {
            generationMap.set(generation, []);
          }
          generationMap.get(generation)!.push(individual);

          // Find ALL partnerships this person is in
          const partnershipsWith = state.partnerships.filter(
            (p) =>
              p.individual1Id === individual.id ||
              p.individual2Id === individual.id,
          );

          partnershipsWith.forEach((partnership) => {
            // Also assign partner to same generation
            const partnerId =
              partnership.individual1Id === individual.id
                ? partnership.individual2Id
                : partnership.individual1Id;
            const partner = state.individuals.find((i) => i.id === partnerId);
            if (partner && !processed.has(partner.id)) {
              processed.add(partner.id);
              if (!generationMap.has(generation)) {
                generationMap.set(generation, []);
              }
              generationMap.get(generation)!.push(partner);
            }

            // Find children of THIS partnership
            const children = state.connections
              .filter((conn) => conn.partnershipId === partnership.id)
              .map((conn) =>
                state.individuals.find((i) => i.id === conn.childId),
              )
              .filter(Boolean) as Individual[];

            children.forEach((child) => {
              assignGeneration(child, generation + 1);
            });
          });
        };

        // Start from roots at generation 0
        roots.forEach((root) => assignGeneration(root, 0));

        // Layout parameters
        const generationSpacing = 100;
        const individualSpacing = 80;
        const startY = 100;
        const startX = 100;
        const canvasWidth = 1200;

        const maxGeneration =
          generationMap.size > 0
            ? Math.max(...Array.from(generationMap.keys()))
            : 0;

        for (let gen = 0; gen <= maxGeneration; gen++) {
          const individualsInGen = generationMap.get(gen) || [];
          if (individualsInGen.length === 0) continue;

          const y = startY + gen * generationSpacing;

          // Center this generation
          const totalWidth = (individualsInGen.length - 1) * individualSpacing;
          let x = startX + canvasWidth / 2 - totalWidth / 2;

          // Group by partnerships
          const partnered = new Set<string>();

          state.partnerships.forEach((p) => {
            const ind1 = individualsInGen.find((i) => i.id === p.individual1Id);
            const ind2 = individualsInGen.find((i) => i.id === p.individual2Id);

            if (ind1 && ind2) {
              if (!partnered.has(ind1.id)) {
                ind1.x = x;
                ind1.y = y;
                partnered.add(ind1.id);
                x += individualSpacing / 2;
              }
              if (!partnered.has(ind2.id)) {
                ind2.x = x;
                ind2.y = y;
                partnered.add(ind2.id);
                x += individualSpacing;
              }
            }
          });

          // Place non-partnered individuals
          individualsInGen.forEach((ind) => {
            if (!partnered.has(ind.id)) {
              ind.x = x;
              ind.y = y;
              x += individualSpacing;
            }
          });
        }
      }),
  })),
);
