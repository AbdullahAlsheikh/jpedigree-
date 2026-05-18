import React, { useRef, useState, useCallback } from "react";
import {
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
} from "@mui/material";
import { Man, Woman } from "@mui/icons-material";
import { usePedigreeStore } from "../../store/pedigreeStore";
import { COLORS } from "../../theme/colors";
import { Individual, Partnership, PartnershipType } from "../../types/pedigree.types";
import IndividualSymbol from "./IndividualSymbol";
import PartnershipLine from "./PartnershipLine";
import ConnectionLine from "./ConnectionLine";

const SYMBOL_SIZE = 20;

interface PedigreeCanvasProps {
  width?: number;
  height?: number;
}

const DiamondIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <polygon
      points="10,2 18,10 10,18 2,10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const PedigreeCanvas: React.FC<PedigreeCanvasProps> = ({
  width = 1200,
  height = 900,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width, height });
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    individualId: string;
  } | null>(null);
  const [partnershipContextMenu, setPartnershipContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    partnershipId: string;
  } | null>(null);

  const {
    individuals,
    partnerships,
    connections,
    currentMode,
    childGender,
    partnershipType,
    currentConditionId,
    selectedIndividuals,
    selectedPartnership,
    draggedIndividual,
    scale,
    addIndividual,
    removeIndividual,
    updateIndividual,
    addPartnership,
    removePartnership,
    updatePartnership,
    addConnection,
    setSelectedIndividuals,
    setSelectedPartnership,
    setDraggedIndividual,
    toggleConditionForIndividual,
    toggleDeceased,
    saveHistory,
    setEditingIndividualId,
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

  // ── Context menu actions ────────────────────────────────────────────────

  const makeIndividual = (
    x: number,
    y: number,
    sex: "male" | "female" | "unknown",
    id: string,
  ): Individual => ({
    id,
    x,
    y,
    sex,
    label: "",
    conditions: [],
    affected: false,
    deceased: false,
    conditionAgeOfDiagnosis: {},
  });

  const handleCloseMenu = () => setContextMenu(null);
  const handleClosePartnershipMenu = () => setPartnershipContextMenu(null);

  const handleAddChildToPartnership = (sex: "male" | "female" | "unknown") => {
    const partnership = partnerships.find(
      (p) => p.id === partnershipContextMenu?.partnershipId,
    );
    if (!partnership) return;
    const p1 = individuals.find((i) => i.id === partnership.individual1Id);
    const p2 = individuals.find((i) => i.id === partnership.individual2Id);
    if (!p1 || !p2) return;
    saveHistory();
    const t = Date.now();
    const child = makeIndividual(
      (p1.x + p2.x) / 2,
      Math.max(p1.y, p2.y) + 160,
      sex,
      String(t),
    );
    addIndividual(child);
    addConnection({
      id: String(t + 1),
      partnershipId: partnership.id,
      childId: child.id,
    });
    handleClosePartnershipMenu();
  };

  const handleAddPartner = (sex: "male" | "female" | "unknown") => {
    const source = individuals.find((i) => i.id === contextMenu?.individualId);
    if (!source) return;
    saveHistory();
    const t = Date.now();
    const partner = makeIndividual(source.x + 100, source.y, sex, String(t));
    addIndividual(partner);
    addPartnership({
      id: String(t + 1),
      individual1Id: source.id,
      individual2Id: partner.id,
      type: partnershipType,
    });
    handleCloseMenu();
  };

  const handleAddChild = (sex: "male" | "female" | "unknown") => {
    const source = individuals.find((i) => i.id === contextMenu?.individualId);
    if (!source) return;
    saveHistory();
    const t = Date.now();
    const child = makeIndividual(source.x, source.y + 160, sex, String(t));
    addIndividual(child);
    addConnection({
      id: String(t + 1),
      parentId: source.id,
      childId: child.id,
    });
    handleCloseMenu();
  };

  const handleAddParents = () => {
    const source = individuals.find((i) => i.id === contextMenu?.individualId);
    if (!source) return;
    saveHistory();
    const t = Date.now();
    const father = makeIndividual(source.x - 50, source.y - 160, "male", String(t));
    const mother = makeIndividual(source.x + 50, source.y - 160, "female", String(t + 1));
    addIndividual(father);
    addIndividual(mother);
    addPartnership({
      id: String(t + 2),
      individual1Id: father.id,
      individual2Id: mother.id,
      type: "regular",
    });
    addConnection({
      id: String(t + 3),
      partnershipId: String(t + 2),
      childId: source.id,
    });
    handleCloseMenu();
  };

  // ── Mouse handlers ──────────────────────────────────────────────────────

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

    if (currentMode === "condition" && individual && currentConditionId) {
      saveHistory();
      toggleConditionForIndividual(individual.id, currentConditionId);
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
    const clickedIndividualForPanel = findIndividualAt(pos.x, pos.y);
    if (clickedIndividualForPanel && currentMode !== "delete") {
      setEditingIndividualId(clickedIndividualForPanel.id);
    } else if (!clickedIndividualForPanel) {
      setEditingIndividualId(null);
    }

    if (currentMode === "male" || currentMode === "female" || currentMode === "unknown") {
      saveHistory();
      const newIndividual: Individual = {
        id: Date.now().toString(),
        x: pos.x,
        y: pos.y,
        sex: currentMode,
        label: "",
        conditions: [],
        affected: false,
        deceased: false,
        conditionAgeOfDiagnosis: {},
      };
      addIndividual(newIndividual);
    } else if (currentMode === "partnership") {
      const individual = findIndividualAt(pos.x, pos.y);
      if (individual) {
        const newSelected = [...selectedIndividuals, individual];
        if (newSelected.length === 2) {
          const [a, b] = newSelected;
          const existing = partnerships.find(
            (p) =>
              (p.individual1Id === a.id && p.individual2Id === b.id) ||
              (p.individual1Id === b.id && p.individual2Id === a.id),
          );
          saveHistory();
          if (existing) {
            updatePartnership(existing.id, { type: partnershipType });
          } else {
            addPartnership({
              id: Date.now().toString(),
              individual1Id: a.id,
              individual2Id: b.id,
              type: partnershipType,
            });
          }
          setSelectedIndividuals([]);
        } else {
          setSelectedIndividuals(newSelected);
        }
      }
    } else if (currentMode === "child") {
      if (!selectedPartnership && !selectedParentId) {
        const individual = findIndividualAt(pos.x, pos.y);
        if (individual) {
          setSelectedParentId(individual.id);
          setSelectedIndividuals([individual]);
        } else {
          const partnership = findPartnershipAt(pos.x, pos.y);
          if (partnership) {
            setSelectedPartnership(partnership.id);
          }
        }
      } else if (selectedPartnership) {
        saveHistory();
        const child: Individual = {
          id: Date.now().toString(),
          x: pos.x,
          y: pos.y,
          sex: childGender,
          label: "",
          conditions: [],
          affected: false,
          deceased: false,
          conditionAgeOfDiagnosis: {},
        };
        addIndividual(child);
        addConnection({
          id: Date.now().toString(),
          partnershipId: selectedPartnership,
          childId: child.id,
        });
        setSelectedPartnership(null);
      } else if (selectedParentId) {
        const clickedIndividual = findIndividualAt(pos.x, pos.y);
        if (!clickedIndividual) {
          saveHistory();
          const child: Individual = {
            id: Date.now().toString(),
            x: pos.x,
            y: pos.y,
            sex: childGender,
            label: "",
            conditions: [],
            affected: false,
            deceased: false,
            conditionAgeOfDiagnosis: {},
          };
          addIndividual(child);
          addConnection({
            id: Date.now().toString(),
            parentId: selectedParentId,
            childId: child.id,
          });
          setSelectedParentId(null);
          setSelectedIndividuals([]);
        }
      }
    }
  };

  const handleContextMenu = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const pos = getMousePosition(event);
    const individual = findIndividualAt(pos.x, pos.y);
    if (individual) {
      setContextMenu({
        mouseX: event.clientX,
        mouseY: event.clientY,
        individualId: individual.id,
      });
      return;
    }
    const partnership = findPartnershipAt(pos.x, pos.y);
    if (partnership) {
      setPartnershipContextMenu({
        mouseX: event.clientX,
        mouseY: event.clientY,
        partnershipId: partnership.id,
      });
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
        {partnerships.map((partnership) => (
          <PartnershipLine
            key={partnership.id}
            partnership={partnership}
            isSelected={selectedPartnership === partnership.id}
          />
        ))}

        {connections.map((connection) => (
          <ConnectionLine key={connection.id} connection={connection} />
        ))}

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

      <Menu
        open={contextMenu !== null}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <ListSubheader sx={{ lineHeight: "32px", fontSize: 11 }}>
          Add Partner
        </ListSubheader>
        <MenuItem dense onClick={() => handleAddPartner("male")}>
          <ListItemIcon><Man fontSize="small" /></ListItemIcon>
          <ListItemText>Male</ListItemText>
        </MenuItem>
        <MenuItem dense onClick={() => handleAddPartner("female")}>
          <ListItemIcon><Woman fontSize="small" /></ListItemIcon>
          <ListItemText>Female</ListItemText>
        </MenuItem>
        <MenuItem dense onClick={() => handleAddPartner("unknown")}>
          <ListItemIcon><DiamondIcon /></ListItemIcon>
          <ListItemText>Unknown</ListItemText>
        </MenuItem>

        <Divider />

        <ListSubheader sx={{ lineHeight: "32px", fontSize: 11 }}>
          Add Child
        </ListSubheader>
        <MenuItem dense onClick={() => handleAddChild("male")}>
          <ListItemIcon><Man fontSize="small" /></ListItemIcon>
          <ListItemText>Male</ListItemText>
        </MenuItem>
        <MenuItem dense onClick={() => handleAddChild("female")}>
          <ListItemIcon><Woman fontSize="small" /></ListItemIcon>
          <ListItemText>Female</ListItemText>
        </MenuItem>
        <MenuItem dense onClick={() => handleAddChild("unknown")}>
          <ListItemIcon><DiamondIcon /></ListItemIcon>
          <ListItemText>Unknown</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem dense onClick={handleAddParents}>
          <ListItemIcon>
            <Man fontSize="small" />
            <Woman fontSize="small" sx={{ ml: -0.5 }} />
          </ListItemIcon>
          <ListItemText>Add Parents (♂ + ♀)</ListItemText>
        </MenuItem>
      </Menu>

      {/* Partnership relationship line context menu */}
      <Menu
        open={partnershipContextMenu !== null}
        onClose={handleClosePartnershipMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          partnershipContextMenu !== null
            ? { top: partnershipContextMenu.mouseY, left: partnershipContextMenu.mouseX }
            : undefined
        }
      >
        <ListSubheader sx={{ lineHeight: "32px", fontSize: 11 }}>
          Relationship Type
        </ListSubheader>
        {(
          [
            {
              value: "regular" as PartnershipType,
              label: "Regular",
              icon: (
                <svg width="32" height="16" viewBox="0 0 32 16">
                  <line x1="2" y1="8" x2="30" y2="8" stroke="currentColor" strokeWidth="2" />
                </svg>
              ),
            },
            {
              value: "consanguineous" as PartnershipType,
              label: "Consanguineous",
              icon: (
                <svg width="32" height="16" viewBox="0 0 32 16">
                  <line x1="2" y1="5" x2="30" y2="5" stroke="currentColor" strokeWidth="2" />
                  <line x1="2" y1="11" x2="30" y2="11" stroke="currentColor" strokeWidth="2" />
                </svg>
              ),
            },
            {
              value: "non-consanguineous" as PartnershipType,
              label: "Non-consanguineous",
              icon: (
                <svg width="32" height="16" viewBox="0 0 32 16">
                  <line x1="2" y1="12" x2="30" y2="12" stroke="currentColor" strokeWidth="2" />
                  <circle cx="16" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="11" y1="11" x2="21" y2="-1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ),
            },
          ] as const
        ).map((opt) => {
          const current = partnerships.find(
            (p) => p.id === partnershipContextMenu?.partnershipId,
          );
          return (
            <MenuItem
              key={opt.value}
              dense
              selected={current?.type === opt.value}
              onClick={() => {
                if (partnershipContextMenu) {
                  saveHistory();
                  updatePartnership(partnershipContextMenu.partnershipId, {
                    type: opt.value,
                  });
                  handleClosePartnershipMenu();
                }
              }}
            >
              <ListItemIcon sx={{ color: "text.primary" }}>{opt.icon}</ListItemIcon>
              <ListItemText>{opt.label}</ListItemText>
            </MenuItem>
          );
        })}

        <Divider />

        <ListSubheader sx={{ lineHeight: "32px", fontSize: 11 }}>
          Add Child to Relationship
        </ListSubheader>
        <MenuItem dense onClick={() => handleAddChildToPartnership("male")}>
          <ListItemIcon><Man fontSize="small" /></ListItemIcon>
          <ListItemText>Male</ListItemText>
        </MenuItem>
        <MenuItem dense onClick={() => handleAddChildToPartnership("female")}>
          <ListItemIcon><Woman fontSize="small" /></ListItemIcon>
          <ListItemText>Female</ListItemText>
        </MenuItem>
        <MenuItem dense onClick={() => handleAddChildToPartnership("unknown")}>
          <ListItemIcon><DiamondIcon /></ListItemIcon>
          <ListItemText>Unknown</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PedigreeCanvas;
