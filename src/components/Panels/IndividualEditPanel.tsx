import React from "react";
import {
  Paper,
  Typography,
  Box,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
  Divider,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { usePedigreeStore } from "../../store/pedigreeStore";
import { Individual } from "../../types/pedigree.types";
import { PANEL_STYLE } from "../../theme/colors";

const IndividualEditPanel: React.FC = () => {
  const {
    editingIndividualId,
    setEditingIndividualId,
    individuals,
    conditions,
    updateIndividual,
    toggleConditionForIndividual,
    saveHistory,
  } = usePedigreeStore();

  const individual = individuals.find((i) => i.id === editingIndividualId);
  if (!individual) return null;

  const update = (updates: Partial<Individual>) => {
    updateIndividual(individual.id, updates);
  };

  const handleDeceasedToggle = () => {
    saveHistory();
    update({ deceased: !individual.deceased });
  };

  const handleConditionToggle = (conditionId: string) => {
    saveHistory();
    toggleConditionForIndividual(individual.id, conditionId);
  };

  const handleDiagnosisAge = (conditionId: string, value: string) => {
    const updated = { ...individual.conditionAgeOfDiagnosis };
    if (value) {
      updated[conditionId] = Number(value);
    } else {
      delete updated[conditionId];
    }
    update({ conditionAgeOfDiagnosis: updated });
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: PANEL_STYLE.borderRadius,
        backdropFilter: PANEL_STYLE.backdropFilter,
        backgroundColor: PANEL_STYLE.backgroundColor,
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Typography variant="h6" sx={{ fontSize: 14 }}>
          Individual Details
        </Typography>
        <IconButton size="small" onClick={() => setEditingIndividualId(null)}>
          <Close fontSize="small" />
        </IconButton>
      </Box>

      <TextField
        label="Name"
        size="small"
        fullWidth
        value={individual.label}
        onChange={(e) => update({ label: e.target.value })}
        sx={{ mb: 1.5 }}
      />

      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={individual.deceased}
            onChange={handleDeceasedToggle}
          />
        }
        label={
          <Typography variant="body2">
            {individual.deceased ? "Deceased" : "Alive"}
          </Typography>
        }
        sx={{ mb: 1 }}
      />

      {individual.deceased ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <TextField
            label="Age of Death"
            type="number"
            size="small"
            fullWidth
            inputProps={{ min: 0 }}
            value={individual.ageOfDeath ?? ""}
            onChange={(e) =>
              update({
                ageOfDeath: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <TextField
            label="Cause of Death"
            size="small"
            fullWidth
            value={individual.causeOfDeath ?? ""}
            onChange={(e) =>
              update({ causeOfDeath: e.target.value || undefined })
            }
          />
        </Box>
      ) : (
        <TextField
          label="Age"
          type="number"
          size="small"
          fullWidth
          inputProps={{ min: 0 }}
          value={individual.age ?? ""}
          onChange={(e) =>
            update({ age: e.target.value ? Number(e.target.value) : undefined })
          }
        />
      )}

      <Divider sx={{ my: 1.5 }} />

      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontSize: 12, color: "text.secondary" }}
      >
        Conditions
      </Typography>

      {conditions.map((condition) => {
        const isAffected = individual.conditions.includes(condition.id);
        return (
          <Box key={condition.id} sx={{ mb: isAffected ? 1 : 0.5 }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={isAffected}
                  onChange={() => handleConditionToggle(condition.id)}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: condition.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="caption">{condition.name}</Typography>
                </Box>
              }
            />
            {isAffected && (
              <TextField
                label="Age of Diagnosis"
                type="number"
                size="small"
                fullWidth
                inputProps={{ min: 0 }}
                value={individual.conditionAgeOfDiagnosis[condition.id] ?? ""}
                onChange={(e) => handleDiagnosisAge(condition.id, e.target.value)}
                sx={{ mt: 0.5, pl: 4 }}
              />
            )}
          </Box>
        );
      })}
    </Paper>
  );
};

export default IndividualEditPanel;
