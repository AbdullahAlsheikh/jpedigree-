import React from "react";
import { Connection } from "../../types/pedigree.types";
import { usePedigreeStore } from "../../store/pedigreeStore";
import { COLORS } from "../../theme/colors";

interface ConnectionLineProps {
  connection: Connection;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ connection }) => {
  const { individuals, partnerships } = usePedigreeStore();

  const child = individuals.find((ind) => ind.id === connection.childId);
  if (!child) return null;

  // Single-parent connection
  if (connection.parentId) {
    const parent = individuals.find((ind) => ind.id === connection.parentId);
    if (!parent) return null;
    return (
      <g>
        <line
          x1={parent.x}
          y1={parent.y}
          x2={parent.x}
          y2={child.y}
          stroke={COLORS.lineStroke}
          strokeWidth={2}
        />
        <line
          x1={parent.x}
          y1={child.y}
          x2={child.x}
          y2={child.y}
          stroke={COLORS.lineStroke}
          strokeWidth={2}
        />
      </g>
    );
  }

  // Partnership connection
  const partnership = partnerships.find(
    (p) => p.id === connection.partnershipId,
  );
  if (!partnership) return null;

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
