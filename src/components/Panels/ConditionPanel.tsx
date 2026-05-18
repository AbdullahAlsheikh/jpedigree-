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
import { COLORS, PANEL_STYLE, CONDITION_COLORS } from "../../theme/colors";

const ConditionPanel: React.FC = () => {
  const {
    conditions,
    addCondition,
    removeCondition,
    updateCondition,
    setCurrentConditionId,
    currentConditionId,
    setMode,
  } = usePedigreeStore();

  const handleAddCondition = () => {
    const color = CONDITION_COLORS[conditions.length % CONDITION_COLORS.length];

    addCondition({
      id: Date.now().toString(),
      name: `Condition ${conditions.length + 1}`,
      color,
    });
  };

  const handleRemoveCondition = (id: string) => {
    if (conditions.length > 1) {
      removeCondition(id);
    }
  };

  const handleSelectCondition = (id: string) => {
    setCurrentConditionId(id);
    setMode("condition");
  };

  const handleNameChange = (id: string, name: string) => {
    updateCondition(id, { name });
  };

  const handleColorChange = (id: string, color: string) => {
    updateCondition(id, { color });
  };

  return (
    <Paper
      elevation={1}
      sx={{
        overflow: "auto",
        p: 2,
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
          Condition Tracking
        </Typography>

        <IconButton size="small" onClick={handleAddCondition} sx={{ mt: 1 }}>
          <Add />
        </IconButton>
      </Box>

      <List dense>
        {conditions.map((condition) => (
          <ListItem
            key={condition.id}
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
              onClick={() => handleSelectCondition(condition.id)}
              sx={{
                bgcolor: condition.color,
                width: 32,
                height: 32,
                border:
                  currentConditionId === condition.id
                    ? `3px solid ${COLORS.selectionStroke}`
                    : `1px solid ${COLORS.lineStroke}`,
                "&:hover": {
                  bgcolor: condition.color,
                  opacity: 0.8,
                },
              }}
            >
              <Circle sx={{ fontSize: 16, color: "transparent" }} />
            </IconButton>

            <TextField
              size="small"
              value={condition.name}
              onChange={(e) => handleNameChange(condition.id, e.target.value)}
              sx={{ flex: 1 }}
            />

            <input
              type="color"
              value={condition.color}
              onChange={(e) => handleColorChange(condition.id, e.target.value)}
              style={{
                width: 32,
                height: 32,
                border: "none",
                cursor: "pointer",
                borderRadius: 8,
              }}
            />

            {conditions.length > 1 && (
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemoveCondition(condition.id)}
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
        onClick={handleAddCondition}
        sx={{ mt: 1 }}
      >
        Add Condition
      </Button> */}

      {currentConditionId && (
        <Box sx={{ mt: 2 }}>
          <Chip
            label={`Marking: ${conditions.find((d) => d.id === currentConditionId)?.name}`}
            color="primary"
            size="small"
            sx={{
              bgcolor: conditions.find((d) => d.id === currentConditionId)?.color,
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default ConditionPanel;
