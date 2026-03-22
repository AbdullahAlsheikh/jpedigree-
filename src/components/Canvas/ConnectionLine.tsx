import React from "react";
import { Connection } from "../../types/pedigree.types";
import { usePedigreeStore } from "../../store/pedigreeStore";
import { COLORS } from "../../theme/colors";

interface ConnectionLineProps {
  connection: Connection;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ connection }) => {
  const { individuals, partnerships } = usePedigreeStore();

  const partnership = partnerships.find(
    (p) => p.id === connection.partnershipId,
  );
  const child = individuals.find((ind) => ind.id === connection.childId);

  if (!partnership || !child) return null;

  const parent1 = individuals.find(
    (ind) => ind.id === partnership.individual1Id,
  );
  const parent2 = individuals.find(
    (ind) => ind.id === partnership.individual2Id,
  );

  if (!parent1 || !parent2) return null;

  const midX = (parent1.x + parent2.x) / 2;
  const midY = (parent1.y + parent2.y) / 2;

  return (
    <g>
      {/* Vertical line from partnership midpoint down */}
      <line
        x1={midX}
        y1={midY}
        x2={midX}
        y2={child.y}
        stroke={COLORS.lineStroke}
        strokeWidth={2}
      />
      {/* Horizontal line to child */}
      <line
        x1={midX}
        y1={child.y}
        x2={child.x}
        y2={child.y}
        stroke={COLORS.lineStroke}
        strokeWidth={2}
      />
    </g>
  );
};

export default ConnectionLine;
