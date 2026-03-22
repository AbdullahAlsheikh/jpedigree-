import React from "react";
import { Individual } from "../../types/pedigree.types";
import { usePedigreeStore } from "../../store/pedigreeStore";

interface IndividualSymbolProps {
  individual: Individual;
  isSelected: boolean;
}

const SYMBOL_SIZE = 50;

const IndividualSymbol: React.FC<IndividualSymbolProps> = ({
  individual,
  isSelected,
}) => {
  const { diseases } = usePedigreeStore();

  const getDiseaseColors = () => {
    return individual.diseases
      .map((diseaseId) => diseases.find((d) => d.id === diseaseId)?.color)
      .filter(Boolean) as string[];
  };

  const renderSymbol = () => {
    const diseaseColors = getDiseaseColors();
    const { x, y, sex } = individual;

    if (diseaseColors.length === 0) {
      // No diseases - white fill
      if (sex === "male") {
        return (
          <rect
            x={x - SYMBOL_SIZE / 2}
            y={y - SYMBOL_SIZE / 2}
            width={SYMBOL_SIZE}
            height={SYMBOL_SIZE}
            fill="white"
            stroke="black"
            strokeWidth={2}
          />
        );
      } else {
        return (
          <circle
            cx={x}
            cy={y}
            r={SYMBOL_SIZE / 2}
            fill="white"
            stroke="black"
            strokeWidth={2}
          />
        );
      }
    } else if (diseaseColors.length === 1) {
      // Single disease
      if (sex === "male") {
        return (
          <rect
            x={x - SYMBOL_SIZE / 2}
            y={y - SYMBOL_SIZE / 2}
            width={SYMBOL_SIZE}
            height={SYMBOL_SIZE}
            fill={diseaseColors[0]}
            stroke="black"
            strokeWidth={2}
          />
        );
      } else {
        return (
          <circle
            cx={x}
            cy={y}
            r={SYMBOL_SIZE / 2}
            fill={diseaseColors[0]}
            stroke="black"
            strokeWidth={2}
          />
        );
      }
    } else {
      // Multiple diseases
      if (sex === "male") {
        const segmentHeight = SYMBOL_SIZE / diseaseColors.length;
        return (
          <g>
            {diseaseColors.map((color, i) => (
              <rect
                key={i}
                x={x - SYMBOL_SIZE / 2}
                y={y - SYMBOL_SIZE / 2 + i * segmentHeight}
                width={SYMBOL_SIZE}
                height={segmentHeight}
                fill={color}
              />
            ))}
            <rect
              x={x - SYMBOL_SIZE / 2}
              y={y - SYMBOL_SIZE / 2}
              width={SYMBOL_SIZE}
              height={SYMBOL_SIZE}
              fill="none"
              stroke="black"
              strokeWidth={2}
            />
          </g>
        );
      } else {
        const anglePerDisease = 360 / diseaseColors.length;
        return (
          <g>
            {diseaseColors.map((color, i) => {
              const startAngle = (i * anglePerDisease - 90) * (Math.PI / 180);
              const endAngle =
                ((i + 1) * anglePerDisease - 90) * (Math.PI / 180);
              const x1 = x + (SYMBOL_SIZE / 2) * Math.cos(startAngle);
              const y1 = y + (SYMBOL_SIZE / 2) * Math.sin(startAngle);
              const x2 = x + (SYMBOL_SIZE / 2) * Math.cos(endAngle);
              const y2 = y + (SYMBOL_SIZE / 2) * Math.sin(endAngle);
              const largeArc = anglePerDisease > 180 ? 1 : 0;

              return (
                <path
                  key={i}
                  d={`M ${x} ${y} L ${x1} ${y1} A ${SYMBOL_SIZE / 2} ${SYMBOL_SIZE / 2} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={color}
                />
              );
            })}
            <circle
              cx={x}
              cy={y}
              r={SYMBOL_SIZE / 2}
              fill="none"
              stroke="black"
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
            stroke="blue"
            strokeWidth={3}
          />
        ) : (
          <circle
            cx={individual.x}
            cy={individual.y}
            r={SYMBOL_SIZE / 2 + 3}
            fill="none"
            stroke="blue"
            strokeWidth={3}
          />
        ))}

      {/* Label */}
      {individual.label && (
        <text
          x={individual.x}
          y={individual.y + SYMBOL_SIZE + 12}
          textAnchor="middle"
          fontSize="12"
          fill="black"
          fontFamily="Arial"
        >
          {individual.label}
        </text>
      )}

      {/* Diseases */}
      {individual.deceased &&
        (individual.sex === "female" ? (
          <line
            x1={individual.x - SYMBOL_SIZE / 2}
            y1={individual.y + SYMBOL_SIZE / 2}
            x2={individual.x + SYMBOL_SIZE / 2}
            y2={individual.y - SYMBOL_SIZE / 2}
            stroke="black"
            strokeWidth={2}
          />
        ) : (
          <line
            x1={individual.x - 10 - SYMBOL_SIZE / 2}
            y1={individual.y + 10 + SYMBOL_SIZE / 2}
            x2={individual.x + 10 + SYMBOL_SIZE / 2}
            y2={individual.y - 10 - SYMBOL_SIZE / 2}
            stroke="black"
            strokeWidth={2}
          />
        ))}
    </g>
  );
};

export default IndividualSymbol;
