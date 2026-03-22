import React, { useRef, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { usePedigreeStore } from "../../store/pedigreeStore";
import { COLORS } from "../../theme/colors";
import { Individual, Partnership } from "../../types/pedigree.types";
import IndividualSymbol from "./IndividualSymbol";
import PartnershipLine from "./PartnershipLine";
import ConnectionLine from "./ConnectionLine";

const SYMBOL_SIZE = 20;

interface PedigreeCanvasProps {
  width?: number;
  height?: number;
}

const PedigreeCanvas: React.FC<PedigreeCanvasProps> = ({
  width = 1200,
  height = 900,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width, height });

  const {
    individuals,
    partnerships,
    connections,
    currentMode,
    childGender,
    currentDiseaseId,
    selectedIndividuals,
    selectedPartnership,
    draggedIndividual,
    scale,
    addIndividual,
    removeIndividual,
    updateIndividual,
    addPartnership,
    removePartnership,
    addConnection,
    setSelectedIndividuals,
    setSelectedPartnership,
    setDraggedIndividual,
    toggleDiseaseForIndividual,
    toggleDeceased,
    saveHistory,
  } = usePedigreeStore();

  const getMousePosition = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const CTM = svgRef.current.getScreenCTM();
      if (!CTM) return { x: 0, y: 0 };
      return {
        x: (event.clientX - CTM.e) / CTM.a,
        y: (event.clientY - CTM.f) / CTM.d,
      };
    },
    [],
  );

  const findIndividualAt = useCallback(
    (x: number, y: number): Individual | null => {
      return (
        individuals.find((ind) => {
          const dx = ind.x - x;
          const dy = ind.y - y;
          return Math.sqrt(dx * dx + dy * dy) <= SYMBOL_SIZE;
        }) || null
      );
    },
    [individuals],
  );

  const findPartnershipAt = useCallback(
    (x: number, y: number): Partnership | null => {
      return (
        partnerships.find((p) => {
          const ind1 = individuals.find((i) => i.id === p.individual1Id);
          const ind2 = individuals.find((i) => i.id === p.individual2Id);
          if (!ind1 || !ind2) return false;

          const x1 = Math.min(ind1.x, ind2.x);
          const x2 = Math.max(ind1.x, ind2.x);
          const partY = (ind1.y + ind2.y) / 2;
          return x >= x1 - 10 && x <= x2 + 10 && Math.abs(y - partY) <= 10;
        }) || null
      );
    },
    [partnerships, individuals],
  );

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    const pos = getMousePosition(event);
    const individual = findIndividualAt(pos.x, pos.y);

    if (currentMode === "drag" && individual) {
      setDraggedIndividual(individual);
      return;
    }

    if (event.button === 1 || event.shiftKey || currentMode === "drag") {
      setIsPanning(true);
      setLastMousePos({ x: event.clientX, y: event.clientY });
      return;
    }

    if (currentMode === "delete") {
      if (individual) {
        saveHistory();
        removeIndividual(individual.id);
      } else {
        const partnership = findPartnershipAt(pos.x, pos.y);
        if (partnership) {
          saveHistory();
          removePartnership(partnership.id);
        }
      }
      return;
    }

    if (currentMode === "disease" && individual && currentDiseaseId) {
      saveHistory();
      toggleDiseaseForIndividual(individual.id, currentDiseaseId);
      return;
    }

    if (currentMode === "deceased" && individual) {
      saveHistory();
      toggleDeceased(individual.id);
      return;
    }
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      const dx = event.clientX - lastMousePos.x;
      const dy = event.clientY - lastMousePos.y;
      setViewBox((prev) => ({
        ...prev,
        x: prev.x - dx / scale,
        y: prev.y - dy / scale,
      }));
      setLastMousePos({ x: event.clientX, y: event.clientY });
      return;
    }

    if (draggedIndividual) {
      const pos = getMousePosition(event);
      updateIndividual(draggedIndividual.id, { x: pos.x, y: pos.y });
    }
  };

  const handleMouseUp = () => {
    if (draggedIndividual) {
      saveHistory();
      setDraggedIndividual(null);
    }
    setIsPanning(false);
  };

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const pos = getMousePosition(event);

    if (currentMode === "male" || currentMode === "female") {
      //add individual
      saveHistory();
      const newIndividual: Individual = {
        id: Date.now().toString(),
        x: pos.x,
        y: pos.y,
        sex: currentMode,
        label: "",
        diseases: [],
        affected: false,
        deceased: false,
      };
      addIndividual(newIndividual);
    } else if (currentMode === "partnership") {
      //add partnership
      const individual = findIndividualAt(pos.x, pos.y);
      if (individual) {
        const newSelected = [...selectedIndividuals, individual];
        if (newSelected.length === 2) {
          saveHistory();
          addPartnership({
            id: Date.now().toString(),
            individual1Id: newSelected[0].id,
            individual2Id: newSelected[1].id,
          });
          setSelectedIndividuals([]);
        } else {
          setSelectedIndividuals(newSelected);
        }
      }
    } else if (currentMode === "child") {
      if (!selectedPartnership) {
        const partnership = findPartnershipAt(pos.x, pos.y);
        if (partnership) {
          setSelectedPartnership(partnership.id);
        }
      } else {
        saveHistory();
        const child: Individual = {
          id: Date.now().toString(),
          x: pos.x,
          y: pos.y,
          sex: childGender,
          label: "",
          diseases: [],
          affected: false,
          deceased: false,
        };
        addIndividual(child);
        addConnection({
          id: Date.now().toString(),
          partnershipId: selectedPartnership,
          childId: child.id,
        });
        setSelectedPartnership(null);
      }
    }
  };

  const handleContextMenu = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const pos = getMousePosition(event);
    const individual = findIndividualAt(pos.x, pos.y);
    if (individual) {
      const label = prompt("Enter label:", individual.label);
      if (label !== null) {
        saveHistory();
        updateIndividual(individual.id, { label });
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        bgcolor: COLORS.canvasBg,
        position: "relative",
      }}
    >
      <svg
        ref={svgRef}
        id="pedigree-svg"
        width="100%"
        height="100%"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        style={{
          cursor:
            currentMode === "drag"
              ? "move"
              : isPanning
                ? "grabbing"
                : "crosshair",
        }}
      >
        {/* Render partnership lines */}
        {partnerships.map((partnership) => (
          <PartnershipLine
            key={partnership.id}
            partnership={partnership}
            isSelected={selectedPartnership === partnership.id}
          />
        ))}

        {/* Render connections */}
        {connections.map((connection) => (
          <ConnectionLine key={connection.id} connection={connection} />
        ))}

        {/* Render individuals */}
        {individuals.map((individual) => (
          <IndividualSymbol
            key={individual.id}
            individual={individual}
            isSelected={selectedIndividuals.some(
              (ind) => ind.id === individual.id,
            )}
          />
        ))}
      </svg>
    </Box>
  );
};

export default PedigreeCanvas;
