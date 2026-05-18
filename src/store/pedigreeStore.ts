import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  Individual,
  Partnership,
  Connection,
  Condition,
  Mode,
  AppSettings,
  LayoutSettings,
} from "../types/pedigree.types";

interface PedigreeStore {
  // State
  individuals: Individual[];
  partnerships: Partnership[];
  connections: Connection[];
  conditions: Condition[];
  currentMode: Mode;
  childGender: "male" | "female" | "unknown";
  currentConditionId: string | null;
  selectedIndividuals: Individual[];
  selectedPartnership: string | null;
  draggedIndividual: Individual | null;
  editingIndividualId: string | null;
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

  addCondition: (condition: Condition) => void;
  removeCondition: (id: string) => void;
  updateCondition: (id: string, updates: Partial<Condition>) => void;

  setMode: (mode: Mode) => void;
  setChildGender: (gender: "male" | "female" | "unknown") => void;
  setCurrentConditionId: (id: string | null) => void;
  setSelectedIndividuals: (individuals: Individual[]) => void;
  setSelectedPartnership: (partnershipId: string | null) => void;
  setDraggedIndividual: (individual: Individual | null) => void;
  setEditingIndividualId: (id: string | null) => void;
  setScale: (scale: number) => void;

  toggleConditionForIndividual: (individualId: string, conditionId: string) => void;
  toggleDeceased: (individualId: string) => void;

  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  updateLayoutSettings: (updates: Partial<LayoutSettings>) => void;

  saveHistory: () => void;
  undo: () => void;
  clear: () => void;
  autoLayout: () => void;
}

const DEFAULT_CONDITION: Condition = {
  id: "1",
  name: "Condition 1",
  color: "#000000",
};

const DEFAULT_SETTINGS: AppSettings = {
  exportFilename: "pedigree",
  layout: {
    partnerGap: 70,
    siblingSpacing: 90,
    familySeparation: 100,
    generationSpacing: 160,
  },
};

export const usePedigreeStore = create<PedigreeStore>()(
  immer((set, get) => ({
    // Initial state
    individuals: [],
    partnerships: [],
    connections: [],
    conditions: [DEFAULT_CONDITION],
    currentMode: "male",
    childGender: "female",
    currentConditionId: "1",
    selectedIndividuals: [],
    selectedPartnership: null,
    draggedIndividual: null,
    editingIndividualId: null,
    scale: 1,
    history: [],
    settings: DEFAULT_SETTINGS,

    // Individual actions
    addIndividual: (individual) =>
      set((state) => {
        state.individuals.push(individual);
      }),

    removeIndividual: (id) =>
      set((state) => {
        if (state.editingIndividualId === id) state.editingIndividualId = null;
        state.individuals = state.individuals.filter((ind) => ind.id !== id);
        state.partnerships = state.partnerships.filter(
          (p) => p.individual1Id !== id && p.individual2Id !== id,
        );
        state.connections = state.connections.filter(
          (c) => c.childId !== id && c.parentId !== id,
        );
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

    // Condition actions
    addCondition: (condition) =>
      set((state) => {
        state.conditions.push(condition);
      }),

    removeCondition: (id) =>
      set((state) => {
        state.conditions = state.conditions.filter((d) => d.id !== id);
        state.individuals.forEach((ind) => {
          ind.conditions = ind.conditions.filter((conditionId) => conditionId !== id);
        });
      }),

    updateCondition: (id, updates) =>
      set((state) => {
        const condition = state.conditions.find((d) => d.id === id);
        if (condition) {
          Object.assign(condition, updates);
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

    setCurrentConditionId: (id) =>
      set((state) => {
        state.currentConditionId = id;
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

    setEditingIndividualId: (id) =>
      set((state) => {
        state.editingIndividualId = id;
      }),

    setScale: (scale) =>
      set((state) => {
        state.scale = scale;
      }),

    // Toggle condition for individual
    toggleConditionForIndividual: (individualId, conditionId) =>
      set((state) => {
        const individual = state.individuals.find(
          (ind) => ind.id === individualId,
        );
        if (individual) {
          const hasCondition = individual.conditions.includes(conditionId);
          if (hasCondition) {
            individual.conditions = individual.conditions.filter(
              (id) => id !== conditionId,
            );
          } else {
            individual.conditions.push(conditionId);
          }
          individual.affected = individual.conditions.length > 0;
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

    // Settings
    updateSettings: (updates) =>
      set((state) => {
        Object.assign(state.settings, updates);
      }),

    updateLayoutSettings: (updates) =>
      set((state) => {
        Object.assign(state.settings.layout, updates);
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
        state.editingIndividualId = null;
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

          // Find direct (single-parent) children
          const directChildren = state.connections
            .filter((conn) => conn.parentId === individual.id)
            .map((conn) => state.individuals.find((i) => i.id === conn.childId))
            .filter(Boolean) as Individual[];

          directChildren.forEach((child) => {
            assignGeneration(child, generation + 1);
          });
        };

        // Start from roots at generation 0
        roots.forEach((root) => assignGeneration(root, 0));

        // Layout parameters
        const { partnerGap, siblingSpacing, familySeparation, generationSpacing } = state.settings.layout;
        const startY = 150;
        const canvasWidth = 1200;

        const maxGeneration =
          generationMap.size > 0
            ? Math.max(...Array.from(generationMap.keys()))
            : 0;

        const xOf = new Map<string, number>();
        const yOf = new Map<string, number>();

        // Returns siblings of `id` that are in `indsInGen` (same parent partnership or same single parent)
        const getSiblings = (id: string, indsInGen: Individual[]) => {
          const conn = state.connections.find((c) => c.childId === id);
          if (!conn) return [];
          if (conn.partnershipId) {
            return state.connections
              .filter(
                (c) => c.partnershipId === conn.partnershipId && c.childId !== id,
              )
              .map((c) => indsInGen.find((i) => i.id === c.childId))
              .filter(Boolean) as Individual[];
          }
          if (conn.parentId) {
            return state.connections
              .filter((c) => c.parentId === conn.parentId && c.childId !== id)
              .map((c) => indsInGen.find((i) => i.id === c.childId))
              .filter(Boolean) as Individual[];
          }
          return [];
        };

        // ── Bottom-up layout ──────────────────────────────────────────────
        for (let gen = maxGeneration; gen >= 0; gen--) {
          const indsInGen = generationMap.get(gen) || [];
          const y = startY + gen * generationSpacing;
          indsInGen.forEach((ind) => yOf.set(ind.id, y));

          if (gen === maxGeneration) {
            // Leaf generation: group by sibling group, place left-to-right
            const inGroup = new Set<string>();
            const groups: Individual[][] = [];

            state.partnerships.forEach((p) => {
              const sibs = state.connections
                .filter((c) => c.partnershipId === p.id)
                .map((c) => indsInGen.find((i) => i.id === c.childId))
                .filter(Boolean) as Individual[];
              if (sibs.length > 0) {
                groups.push(sibs);
                sibs.forEach((s) => inGroup.add(s.id));
              }
            });
            const singleParentIds = [
              ...new Set(
                state.connections
                  .filter((c) => c.parentId)
                  .map((c) => c.parentId!),
              ),
            ];
            singleParentIds.forEach((parentId) => {
              const sibs = state.connections
                .filter((c) => c.parentId === parentId)
                .map((c) => indsInGen.find((i) => i.id === c.childId))
                .filter(Boolean) as Individual[];
              if (sibs.length > 0) {
                groups.push(sibs);
                sibs.forEach((s) => inGroup.add(s.id));
              }
            });
            indsInGen.forEach((ind) => {
              if (!inGroup.has(ind.id)) groups.push([ind]);
            });

            let curX = 0;
            groups.forEach((group, gIdx) => {
              if (gIdx > 0) curX += familySeparation;
              group.forEach((ind, idx) => {
                if (idx > 0) curX += siblingSpacing;
                xOf.set(ind.id, curX);
              });
            });

            const offset = canvasWidth / 2 - curX / 2;
            indsInGen.forEach((ind) =>
              xOf.set(ind.id, (xOf.get(ind.id) ?? 0) + offset),
            );
          } else {
            // Upper generation: center each couple over their children,
            // then immediately place unplaced siblings adjacent to them.
            const pairsInGen = state.partnerships.filter(
              (p) =>
                indsInGen.some((i) => i.id === p.individual1Id) &&
                indsInGen.some((i) => i.id === p.individual2Id),
            );

            const pairCenters: { p: Partnership; cx: number }[] = [];
            const pairsWithChildren = new Set<string>();

            pairsInGen.forEach((p) => {
              const childXs = state.connections
                .filter((c) => c.partnershipId === p.id)
                .map((c) => xOf.get(c.childId))
                .filter((x): x is number => x !== undefined);
              if (childXs.length > 0) {
                const cx = childXs.reduce((a, b) => a + b, 0) / childXs.length;
                pairCenters.push({ p, cx });
                pairsWithChildren.add(p.id);
              }
            });

            pairCenters.sort((a, b) => a.cx - b.cx);

            const placed = new Set<string>();

            pairCenters.forEach(({ p, cx }) => {
              // Place the couple
              if (!placed.has(p.individual1Id)) {
                xOf.set(p.individual1Id, cx - partnerGap / 2);
                placed.add(p.individual1Id);
              }
              if (!placed.has(p.individual2Id)) {
                xOf.set(p.individual2Id, cx + partnerGap / 2);
                placed.add(p.individual2Id);
              }

              // Place unplaced siblings of individual1 to the LEFT
              const sibs1 = getSiblings(p.individual1Id, indsInGen).filter(
                (s) => !placed.has(s.id),
              );
              let leftX = (xOf.get(p.individual1Id) ?? 0) - siblingSpacing;
              sibs1.forEach((sib) => {
                xOf.set(sib.id, leftX);
                placed.add(sib.id);
                leftX -= siblingSpacing;
              });

              // Place unplaced siblings of individual2 to the RIGHT
              const sibs2 = getSiblings(p.individual2Id, indsInGen).filter(
                (s) => !placed.has(s.id),
              );
              let rightX = (xOf.get(p.individual2Id) ?? 0) + siblingSpacing;
              sibs2.forEach((sib) => {
                xOf.set(sib.id, rightX);
                placed.add(sib.id);
                rightX += siblingSpacing;
              });
            });

            // Couples with no children in the next generation
            pairsInGen
              .filter((p) => !pairsWithChildren.has(p.id))
              .forEach((p) => {
                if (placed.has(p.individual1Id) || placed.has(p.individual2Id))
                  return;
                const maxX =
                  placed.size > 0
                    ? Math.max(...[...placed].map((id) => xOf.get(id) ?? 0))
                    : canvasWidth / 2;
                xOf.set(p.individual1Id, maxX + familySeparation);
                xOf.set(
                  p.individual2Id,
                  maxX + familySeparation + partnerGap,
                );
                placed.add(p.individual1Id);
                placed.add(p.individual2Id);
              });

            // Remaining solo individuals
            indsInGen.forEach((ind) => {
              if (placed.has(ind.id)) return;
              const maxX =
                placed.size > 0
                  ? Math.max(...[...placed].map((id) => xOf.get(id) ?? 0))
                  : canvasWidth / 2;
              xOf.set(ind.id, maxX + familySeparation);
              placed.add(ind.id);
            });
          }
        }

        // ── Overlap resolution sweep ──────────────────────────────────────
        // Push individuals apart within each generation if they are too close.
        // Shift propagates rightward within the generation only (positions are
        // already semantically correct; this is just a collision guard).
        const minGap = 65;
        for (let gen = 0; gen <= maxGeneration; gen++) {
          const sorted = (generationMap.get(gen) ?? [])
            .slice()
            .sort((a, b) => (xOf.get(a.id) ?? 0) - (xOf.get(b.id) ?? 0));

          for (let i = 1; i < sorted.length; i++) {
            const prevX = xOf.get(sorted[i - 1].id) ?? 0;
            const currX = xOf.get(sorted[i].id) ?? 0;
            if (currX - prevX < minGap) {
              const shift = minGap - (currX - prevX);
              for (let j = i; j < sorted.length; j++) {
                xOf.set(sorted[j].id, (xOf.get(sorted[j].id) ?? 0) + shift);
              }
            }
          }
        }

        // Apply positions
        state.individuals.forEach((ind) => {
          if (xOf.has(ind.id)) {
            ind.x = xOf.get(ind.id)!;
            ind.y = yOf.get(ind.id)!;
          }
        });
      }),
  })),
);
