import React from "react";
import { Individual } from "../../types/pedigree.types";
import { usePedigreeStore } from "../../store/pedigreeStore";
import { COLORS } from "../../theme/colors";

interface IndividualSymbolProps {
  individual: Individual;
  isSelected: boolean;
}

const SYMBOL_SIZE = 50;

const diamondPoints = (cx: number, cy: number, r: number) =>
  `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;

const IndividualSymbol: React.FC<IndividualSymbolProps> = ({
  individual,
  isSelected,
}) => {
  const { conditions } = usePedigreeStore();

  const getConditionColors = () => {
    return individual.conditions
      .map((conditionId) => conditions.find((d) => d.id === conditionId)?.color)
      .filter(Boolean) as string[];
  };

  const renderSymbol = () => {
    const conditionColors = getConditionColors();
    const { x, y, sex } = individual;
    const r = SYMBOL_SIZE / 2;

    if (conditionColors.length === 0) {
      if (sex === "male") {
        return (
          <rect
            x={x - r}
            y={y - r}
            width={SYMBOL_SIZE}
            height={SYMBOL_SIZE}
            fill="white"
            stroke={COLORS.lineStroke}
            strokeWidth={2}
          />
        );
      } else if (sex === "unknown") {
        return (
          <polygon
            points={diamondPoints(x, y, r)}
            fill="white"
            stroke={COLORS.lineStroke}
            strokeWidth={2}
          />
        );
      } else {
        return (
          <circle
            cx={x}
            cy={y}
            r={r}
            fill="white"
            stroke={COLORS.lineStroke}
            strokeWidth={2}
          />
        );
      }
    } else if (conditionColors.length === 1) {
      if (sex === "male") {
        return (
          <rect
            x={x - r}
            y={y - r}
            width={SYMBOL_SIZE}
            height={SYMBOL_SIZE}
            fill={conditionColors[0]}
            stroke={COLORS.lineStroke}
            strokeWidth={2}
          />
        );
      } else if (sex === "unknown") {
        return (
          <polygon
            points={diamondPoints(x, y, r)}
            fill={conditionColors[0]}
            stroke={COLORS.lineStroke}
            strokeWidth={2}
          />
        );
      } else {
        return (
          <circle
            cx={x}
            cy={y}
            r={r}
            fill={conditionColors[0]}
            stroke={COLORS.lineStroke}
            strokeWidth={2}
          />
        );
      }
    } else {
      // Multiple conditions
      if (sex === "male") {
        const segmentHeight = SYMBOL_SIZE / conditionColors.length;
        return (
          <g>
            {conditionColors.map((color, i) => (
              <rect
                key={i}
                x={x - r}
                y={y - r + i * segmentHeight}
                width={SYMBOL_SIZE}
                height={segmentHeight}
                fill={color}
              />
            ))}
            <rect
              x={x - r}
              y={y - r}
              width={SYMBOL_SIZE}
              height={SYMBOL_SIZE}
              fill="none"
              stroke={COLORS.lineStroke}
              strokeWidth={2}
            />
          </g>
        );
      } else if (sex === "unknown") {
        const clipId = `diamond-clip-${individual.id}`;
        const segmentHeight = SYMBOL_SIZE / conditionColors.length;
        return (
          <g>
            <defs>
              <clipPath id={clipId}>
                <polygon points={diamondPoints(x, y, r)} />
              </clipPath>
            </defs>
            {conditionColors.map((color, i) => (
              <rect
                key={i}
                x={x - r}
                y={y - r + i * segmentHeight}
                width={SYMBOL_SIZE}
                height={segmentHeight}
                fill={color}
                clipPath={`url(#${clipId})`}
              />
            ))}
            <polygon
              points={diamondPoints(x, y, r)}
              fill="none"
              stroke={COLORS.lineStroke}
              strokeWidth={2}
            />
          </g>
        );
      } else {
        const anglePerCondition = 360 / conditionColors.length;
        return (
          <g>
            {conditionColors.map((color, i) => {
              const startAngle = (i * anglePerCondition - 90) * (Math.PI / 180);
              const endAngle =
                ((i + 1) * anglePerCondition - 90) * (Math.PI / 180);
              const x1 = x + r * Math.cos(startAngle);
              const y1 = y + r * Math.sin(startAngle);
              const x2 = x + r * Math.cos(endAngle);
              const y2 = y + r * Math.sin(endAngle);
              const largeArc = anglePerCondition > 180 ? 1 : 0;

              return (
                <path
                  key={i}
                  d={`M ${x} ${y} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={color}
                />
              );
            })}
            <circle
              cx={x}
              cy={y}
              r={r}
              fill="none"
              stroke={COLORS.lineStroke}
              strokeWidth={2}
            />
          </g>
        );
      }
    }
  };

  return (
    <g>
      {renderSymbol()}

      {/* Selection indicator */}
      {isSelected &&
        (individual.sex === "male" ? (
          <rect
            x={individual.x - SYMBOL_SIZE / 2 - 3}
            y={individual.y - SYMBOL_SIZE / 2 - 3}
            width={SYMBOL_SIZE + 6}
            height={SYMBOL_SIZE + 6}
            fill="none"
            stroke={COLORS.selectionStroke}
            strokeWidth={3}
          />
        ) : individual.sex === "unknown" ? (
          <polygon
            points={diamondPoints(individual.x, individual.y, SYMBOL_SIZE / 2 + 4)}
            fill="none"
            stroke={COLORS.selectionStroke}
            strokeWidth={3}
          />
        ) : (
          <circle
            cx={individual.x}
            cy={individual.y}
            r={SYMBOL_SIZE / 2 + 3}
            fill="none"
            stroke={COLORS.selectionStroke}
            strokeWidth={3}
          />
        ))}

      {/* Label */}
      {individual.label && (
        <text
          x={individual.x}
          y={individual.y + SYMBOL_SIZE + 12}
          textAnchor="middle"
          fontSize={COLORS.labelSize}
          fill={COLORS.lineStroke}
          fontFamily={COLORS.labelFont}
        >
          {individual.label}
        </text>
      )}

      {/* Deceased */}
      {individual.deceased &&
        (individual.sex === "male" ? (
          <line
            x1={individual.x - 10 - SYMBOL_SIZE / 2}
            y1={individual.y + 10 + SYMBOL_SIZE / 2}
            x2={individual.x + 10 + SYMBOL_SIZE / 2}
            y2={individual.y - 10 - SYMBOL_SIZE / 2}
            stroke={COLORS.lineStroke}
            strokeWidth={2}
          />
        ) : (
          <line
            x1={individual.x - SYMBOL_SIZE / 2}
            y1={individual.y + SYMBOL_SIZE / 2}
            x2={individual.x + SYMBOL_SIZE / 2}
            y2={individual.y - SYMBOL_SIZE / 2}
            stroke={COLORS.lineStroke}
            strokeWidth={2}
          />
        ))}
    </g>
  );
};

export default IndividualSymbol;
