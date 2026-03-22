import React, { useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  TextField,
  IconButton,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { Delete, Add, Circle } from "@mui/icons-material";
import { usePedigreeStore } from "../../store/pedigreeStore";
import { COLORS, PANEL_STYLE, DISEASE_COLORS } from "../../theme/colors";

const DiseasePanel: React.FC = () => {
  const {
    diseases,
    addDisease,
    removeDisease,
    updateDisease,
    setCurrentDiseaseId,
    currentDiseaseId,
    setMode,
  } = usePedigreeStore();

  const handleAddDisease = () => {
    const color = DISEASE_COLORS[diseases.length % DISEASE_COLORS.length];

    addDisease({
      id: Date.now().toString(),
      name: `Disease ${diseases.length + 1}`,
      color,
    });
  };

  const handleRemoveDisease = (id: string) => {
    if (diseases.length > 1) {
      removeDisease(id);
    }
  };

  const handleSelectDisease = (id: string) => {
    setCurrentDiseaseId(id);
    setMode("disease");
  };

  const handleNameChange = (id: string, name: string) => {
    updateDisease(id, { name });
  };

  const handleColorChange = (id: string, color: string) => {
    updateDisease(id, { color });
  };

  return (
    <Paper
      elevation={1}
      sx={{
        position: "fixed",
        top: 80,
        left: 16,
        width: 280,
        maxHeight: "calc(100vh - 120px)",
        overflow: "auto",
        p: 2,
        zIndex: 1300,
        borderRadius: PANEL_STYLE.borderRadius,
        backdropFilter: PANEL_STYLE.backdropFilter,
        backgroundColor: PANEL_STYLE.backgroundColor,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontSize: 14 }}>
          Disease Tracking
        </Typography>

        <IconButton size="small" onClick={handleAddDisease} sx={{ mt: 1 }}>
          <Add />
        </IconButton>
      </Box>

      <List dense>
        {diseases.map((disease) => (
          <ListItem
            key={disease.id}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              px: 0,
              py: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleSelectDisease(disease.id)}
              sx={{
                bgcolor: disease.color,
                width: 32,
                height: 32,
                border:
                  currentDiseaseId === disease.id
                    ? `3px solid ${COLORS.selectionStroke}`
                    : `1px solid ${COLORS.lineStroke}`,
                "&:hover": {
                  bgcolor: disease.color,
                  opacity: 0.8,
                },
              }}
            >
              <Circle sx={{ fontSize: 16, color: "transparent" }} />
            </IconButton>

            <TextField
              size="small"
              value={disease.name}
              onChange={(e) => handleNameChange(disease.id, e.target.value)}
              sx={{ flex: 1 }}
            />

            <input
              type="color"
              value={disease.color}
              onChange={(e) => handleColorChange(disease.id, e.target.value)}
              style={{
                width: 32,
                height: 32,
                border: "none",
                cursor: "pointer",
                borderRadius: 8,
              }}
            />

            {diseases.length > 1 && (
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemoveDisease(disease.id)}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>

      {/* <Button
        fullWidth
        variant="contained"
        startIcon={<Add />}
        onClick={handleAddDisease}
        sx={{ mt: 1 }}
      >
        Add Disease
      </Button> */}

      {currentDiseaseId && (
        <Box sx={{ mt: 2 }}>
          <Chip
            label={`Marking: ${diseases.find((d) => d.id === currentDiseaseId)?.name}`}
            color="primary"
            size="small"
            sx={{
              bgcolor: diseases.find((d) => d.id === currentDiseaseId)?.color,
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default DiseasePanel;
