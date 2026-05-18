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

  const childTopY = child.y - 25;
  const hLineY = childTopY - 20;

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
          y2={hLineY}
          stroke={COLORS.lineStroke}
          strokeWidth={2}
        />
        <line
          x1={parent.x}
          y1={hLineY}
          x2={child.x}
          y2={hLineY}
          stroke={COLORS.lineStroke}
          strokeWidth={2}
        />
        <line
          x1={child.x}
          y1={hLineY}
          x2={child.x}
          y2={childTopY}
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
      <line
        x1={midX}
        y1={midY}
        x2={midX}
        y2={hLineY}
        stroke={COLORS.lineStroke}
        strokeWidth={2}
      />
      <line
        x1={midX}
        y1={hLineY}
        x2={child.x}
        y2={hLineY}
        stroke={COLORS.lineStroke}
        strokeWidth={2}
      />
      <line
        x1={child.x}
        y1={hLineY}
        x2={child.x}
        y2={childTopY}
        stroke={COLORS.lineStroke}
        strokeWidth={2}
      />
    </g>
  );
};

export default ConnectionLine;
