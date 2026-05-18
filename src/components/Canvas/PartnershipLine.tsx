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
  const { individuals } = usePedigreeStore();

  const individual1 = individuals.find((ind) => ind.id === partnership.individual1Id);
  const individual2 = individuals.find((ind) => ind.id === partnership.individual2Id);

  if (!individual1 || !individual2) return null;

  const x1 = individual1.x;
  const y1 = individual1.y;
  const x2 = individual2.x;
  const y2 = individual2.y;
  const stroke = isSelected ? COLORS.selectionStroke : COLORS.lineStroke;
  const strokeWidth = isSelected ? 3 : 2;

  const type = partnership.type ?? "regular";

  if (type === "regular") {
    return (
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={strokeWidth} />
    );
  }

  if (type === "consanguineous") {
    // Two parallel lines offset perpendicular to the main line
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return null;
    const nx = (-dy / len) * 3.5;
    const ny = (dx / len) * 3.5;
    return (
      <g>
        <line
          x1={x1 + nx} y1={y1 + ny}
          x2={x2 + nx} y2={y2 + ny}
          stroke={stroke} strokeWidth={strokeWidth}
        />
        <line
          x1={x1 - nx} y1={y1 - ny}
          x2={x2 - nx} y2={y2 - ny}
          stroke={stroke} strokeWidth={strokeWidth}
        />
      </g>
    );
  }

  // non-consanguineous: single line with a null symbol (circle with slash) above midpoint
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const r = 7;
  const dx2 = x2 - x1;
  const dy2 = y2 - y1;
  const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
  const ux = len2 > 0 ? dx2 / len2 : 1;
  const uy = len2 > 0 ? dy2 / len2 : 0;
  // Perpendicular unit vector pointing upward in screen space (SVG y increases downward)
  let perpX = uy;
  let perpY = -ux;
  if (perpY > 0) { perpX = -uy; perpY = ux; }
  // Circle center offset above the line
  const offset = r + 4;
  const cx = mx + perpX * offset;
  const cy = my + perpY * offset;
  // Slash at 45° extending outside the circle
  const slashR = r * 1.4;

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={strokeWidth} />
      <circle cx={cx} cy={cy} r={r} fill="white" stroke={stroke} strokeWidth={strokeWidth} />
      <line
        x1={cx - slashR} y1={cy + slashR}
        x2={cx + slashR} y2={cy - slashR}
        stroke={stroke} strokeWidth={strokeWidth}
      />
    </g>
  );
};

export default PartnershipLine;
