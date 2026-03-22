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
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 1,
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
        <ToggleButtonGroup
          size="small"
          value={currentMode}
          exclusive
          onChange={handleToggleMode}
          sx={{
            "& .MuiToggleButton-root": {
              border: "none",
              borderRadius: 2,
              px: 1,
            },
          }}
        >
          <ToggleButton value="drag">
            <PanTool />
          </ToggleButton>

          {/* <ToggleButton value=""> Need a selector Icon (Curser Icon for drag)
            <PanTool />
          </ToggleButton> */}

          <ToggleButton value="male">
            <Man />
          </ToggleButton>

          <ToggleButton value="female">
            <Woman />
          </ToggleButton>

          <ToggleButton value="child" onClick={() => setChildGender("male")}>
            <Box sx={{ position: "relative", width: 24, height: 24 }}>
              <ChildCare />
              <Male
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  fontSize: 12,
                  backgroundColor: "white",
                  borderRadius: "50%",
                }}
              />
            </Box>
          </ToggleButton>

          <ToggleButton value="child" onClick={() => setChildGender("female")}>
            <Box sx={{ position: "relative", width: 24, height: 24 }}>
              <ChildCare />
              <Female
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  fontSize: 12,
                  backgroundColor: "white",
                  borderRadius: "50%",
                }}
              />
            </Box>
          </ToggleButton>

          <ToggleButton value="partnership">
            <Favorite />
          </ToggleButton>

          <ToggleButton value="disease">
            <LocalHospital />
          </ToggleButton>

          <ToggleButton value="deceased">
            <FaceRetouchingOff />
          </ToggleButton>

          <ToggleButton value="delete">
            <Delete />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <IconButton size="small" onClick={autoLayout}>
          <AutoFixHigh />
        </IconButton>

        <IconButton size="small" onClick={undo}>
          <Undo />
        </IconButton>

        <IconButton size="small" onClick={handleClear}>
          <Clear />
        </IconButton>
      </Paper>

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
        <IconButton size="small" onClick={handleExportPNG}>
          <Download />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default Toolbar;
