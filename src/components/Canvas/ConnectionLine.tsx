import React from "react";
import { Connection } from "../../types/pedigree.types";
import { usePedigreeStore } from "../../store/pedigreeStore";

interface ConnectionLineProps {
  connection: Connection;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ connection }) => {
  // In ConnectionLine.tsx, add at top:
  console.log("Rendering connection:", connection);
  // ← FIX: Get fresh data from store
  const { individuals, partnerships } = usePedigreeStore();

  const partnership = partnerships.find(
    (p) => p.id === connection.partnershipId,
  );
  console.log("Connection partnershipId:", connection.partnershipId);
  console.log("Found partnership:", partnership);
  console.log("All partnerships:", partnerships);
  const child = partnerships.find((ind) => ind.id === connection.childId);

  if (!partnership || !child) return null;

  // Find current positions
  const parent1 = individuals.find(
    (ind) => ind.id === partnership.individual1Id,
  );
  const parent2 = individuals.find(
    (ind) => ind.id === partnership.individual2Id,
  );
  const childInd = individuals.find((ind) => ind.id === child.id);

  // Safety check
  if (!parent1 || !parent2 || !childInd) return null;

  const midX = (parent1.x + parent2.x) / 2;
  const midY = (parent1.y + parent2.y) / 2;

  return (
    <g>
      {/* Vertical line from partnership */}
      <line
        x1={midX}
        y1={midY}
        x2={midX}
        y2={childInd.y}
        stroke="black"
        strokeWidth={2}
      />
      {/* Horizontal line to child */}
      <line
        x1={midX}
        y1={childInd.y}
        x2={childInd.x}
        y2={childInd.y}
        stroke="black"
        strokeWidth={2}
      />
    </g>
  );
};

export default ConnectionLine;
