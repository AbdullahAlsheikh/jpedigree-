import React from "react";
import { Paper, Typography, Box, IconButton } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const LegendPanel: React.FC = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <Paper
      elevation={1}
      sx={{
        position: "fixed",
        top: 16,
        right: 20,
        width: 200,
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
          mb: open ? 1 : 0,
        }}
      >
        <Typography variant="h6" sx={{ fontSize: 14 }}>
          Legend
        </Typography>

        <IconButton size="small" onClick={() => setOpen((p) => !p)}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Body */}
      {open && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Unaffected Male */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <svg width="30" height="30" viewBox="0 0 40 40">
              <rect
                x="10"
                y="10"
                width="20"
                height="20"
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
            <Typography variant="caption">Unaffected Male</Typography>
          </Box>

          {/* Affected Male */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <svg width="30" height="30" viewBox="0 0 40 40">
              <rect
                x="10"
                y="10"
                width="20"
                height="20"
                fill="black"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
            <Typography variant="caption">Affected Male</Typography>
          </Box>

          {/* Deceased Male */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <svg width="30" height="30" viewBox="0 0 40 40">
              <rect
                x="10"
                y="10"
                width="20"
                height="20"
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="35"
                y1="5"
                x2="5"
                y2="35"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
            <Typography variant="caption">Deceased Male</Typography>
          </Box>

          {/* Unaffected Female */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <svg width="30" height="30" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="10"
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
            <Typography variant="caption">Unaffected Female</Typography>
          </Box>

          {/* Affected Female */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <svg width="30" height="30" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="10"
                fill="black"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
            <Typography variant="caption">Affected Female</Typography>
          </Box>

          {/* Deceased Female */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <svg width="30" height="30" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="10"
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="30"
                y1="10"
                x2="10"
                y2="30"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
            <Typography variant="caption">Deceased Female</Typography>
          </Box>

          {/* Partnership */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <svg width="30" height="30" viewBox="0 0 40 40">
              <line
                x1="5"
                y1="20"
                x2="35"
                y2="20"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
            <Typography variant="caption">Partnership</Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default LegendPanel;
