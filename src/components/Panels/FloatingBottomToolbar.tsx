import React from "react";
import {
  AppBar,
  Toolbar as MuiToolbar,
  Typography,
  ButtonGroup,
  Button,
  Box,
  IconButton,
  Paper,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from "@mui/material";
import {
  Man,
  Woman,
  Favorite,
  FaceRetouchingOff,
  ChildCare,
  OpenWith,
  LocalHospital,
  Delete,
  AutoFixHigh,
  Download,
  Clear,
  Undo,
  ZoomIn,
  ZoomOut,
  RestartAlt,
  PanTool,
  Male,
  Female,
} from "@mui/icons-material";
import { usePedigreeStore } from "../../store/pedigreeStore";
import { Mode } from "../../types/pedigree.types";

const Toolbar: React.FC = () => {
  const {
    currentMode,
    childGender,
    scale,
    setMode,
    setChildGender,
    setScale,
    clear,
    undo,
    autoLayout,
  } = usePedigreeStore();

  const handleToggleMode = (
    _: React.MouseEvent<HTMLElement>,
    newMode: Mode | null,
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleExportSVG = () => {
    // TODO: Implement SVG export
    alert("SVG export will be implemented with backend integration");
  };

  const handleExportPNG = () => {
    // TODO: Implement PNG export
    alert("PNG export will be implemented with backend integration");
  };

  const handleZoomIn = () => {
    setScale(Math.min(scale * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(Math.max(scale / 1.2, 0.2));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  const handleClear = () => {
    if (window.confirm("Clear entire pedigree?")) {
      clear();
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1300,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 0.5,
          borderRadius: 3,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255,255,255,0.85)",
        }}
      >
        <IconButton onClick={handleZoomIn}>
          <ZoomIn />
        </IconButton>
        <IconButton onClick={handleZoomOut}>
          <ZoomOut />
        </IconButton>
        <IconButton onClick={handleResetZoom}>
          <RestartAlt />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default Toolbar;
