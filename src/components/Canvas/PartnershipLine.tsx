import React from "react";
import { Partnership } from "../../types/pedigree.types";
import { usePedigreeStore } from "../../store/pedigreeStore";
import { COLORS } from "../../theme/colors";

interface PartnershipLineProps {
  partnership: Partnership;
  isSelected: boolean;
}

const PartnershipLine: React.FC<PartnershipLineProps> = ({
  partnership,
  isSelected,
}) => {
  // ← FIX: Get fresh individual data from store
  const { individuals } = usePedigreeStore();

  // Find current positions
  const individual1 = individuals.find(
    (ind) => ind.id === partnership.individual1Id,
  );
  const individual2 = individuals.find(
    (ind) => ind.id === partnership.individual2Id,
  );

  // Safety check
  if (!individual1 || !individual2) return null;

  return (
    <line
      x1={individual1.x}
      y1={individual1.y}
      x2={individual2.x}
      y2={individual2.y}
      stroke={isSelected ? COLORS.selectionStroke : COLORS.lineStroke}
      strokeWidth={isSelected ? 3 : 2}
    />
  );
};

export default PartnershipLine;
