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
    const colors = [
      "#e74c3c",
      "#3498db",
      "#2ecc71",
      "#f39c12",
      "#9b59b6",
      "#1abc9c",
    ];
    const color = colors[diseases.length % colors.length];

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
        top: 16,
        left: 10,
        width: 280,
        maxHeight: "calc(100vh - 120px)",
        overflow: "auto",
        p: 2,
        zIndex: 1300,
        borderRadius: 3,
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(255,255,255,0.85)",
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
                    ? "3px solid blue"
                    : "1px solid #333",
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
                borderRadius: 4,
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
