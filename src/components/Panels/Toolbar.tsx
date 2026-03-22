import React from "react";
import {
  AppBar,
  Toolbar as MuiToolbar,
  Typography,
  ButtonGroup,
  Button,
  Box,
  IconButton,
  Tooltip,
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

  const handleModeChange = (mode: Mode) => {
    setMode(mode);
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
    <AppBar position="static" color="default" elevation={1}>
      <MuiToolbar sx={{ gap: 2, flexWrap: "wrap", py: 1 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          Pedigree Graph
        </Typography>

        {/* Mode Selection */}
        <ButtonGroup variant="contained" size="small">
          <Button
            startIcon={<Man />}
            onClick={() => handleModeChange("male")}
            color={currentMode === "male" ? "primary" : "inherit"}
          >
            Add Male
          </Button>
          <Button
            startIcon={<Woman />}
            onClick={() => handleModeChange("female")}
            color={currentMode === "female" ? "primary" : "inherit"}
          >
            Add Female
          </Button>
          <Button
            startIcon={<Favorite />}
            onClick={() => handleModeChange("partnership")}
            color={currentMode === "partnership" ? "primary" : "inherit"}
          >
            Partnership
          </Button>
          <Button
            startIcon={<ChildCare />}
            onClick={() => handleModeChange("child")}
            color={currentMode === "child" ? "primary" : "inherit"}
          >
            Add Child
          </Button>
        </ButtonGroup>

        {/* Gender Selection for Children */}
        {currentMode === "child" && (
          <ButtonGroup variant="outlined" size="small">
            <Button
              onClick={() => setChildGender("male")}
              color={childGender === "male" ? "primary" : "inherit"}
            >
              Male
            </Button>
            <Button
              onClick={() => setChildGender("female")}
              color={childGender === "female" ? "primary" : "inherit"}
            >
              Female
            </Button>
          </ButtonGroup>
        )}

        {/* Action Modes */}
        <ButtonGroup variant="contained" size="small">
          <Button
            startIcon={<OpenWith />}
            onClick={() => handleModeChange("drag")}
            color={currentMode === "drag" ? "success" : "inherit"}
          >
            Drag
          </Button>
          <Button
            startIcon={<LocalHospital />}
            onClick={() => handleModeChange("disease")}
            color={currentMode === "disease" ? "success" : "inherit"}
          >
            Disease
          </Button>
          <Button
            startIcon={<FaceRetouchingOff />}
            onClick={() => handleModeChange("deceased")}
            color={currentMode === "deceased" ? "success" : "inherit"}
          >
            Deceased
          </Button>
          <Button
            startIcon={<Delete />}
            onClick={() => handleModeChange("delete")}
            color={currentMode === "delete" ? "error" : "inherit"}
          >
            Delete
          </Button>
        </ButtonGroup>

        {/* Utility Actions */}
        <Box sx={{ flexGrow: 1 }} />

        <ButtonGroup variant="outlined" size="small">
          <Tooltip title="Auto Layout">
            <Button startIcon={<AutoFixHigh />} onClick={autoLayout}>
              Auto-Layout
            </Button>
          </Tooltip>
          <Tooltip title="Download SVG">
            <Button startIcon={<Download />} onClick={handleExportSVG}>
              SVG
            </Button>
          </Tooltip>
          <Tooltip title="Download PNG">
            <Button startIcon={<Download />} onClick={handleExportPNG}>
              PNG
            </Button>
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup variant="outlined" size="small">
          <Tooltip title="Clear">
            <Button startIcon={<Clear />} onClick={handleClear}>
              Clear
            </Button>
          </Tooltip>
          <Tooltip title="Undo">
            <Button startIcon={<Undo />} onClick={undo}>
              Undo
            </Button>
          </Tooltip>
        </ButtonGroup>

        {/* Zoom Controls */}
        <ButtonGroup variant="outlined" size="small">
          <Tooltip title="Zoom Out">
            <IconButton size="small" onClick={handleZoomOut}>
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Button disabled sx={{ minWidth: 60 }}>
            {Math.round(scale * 100)}%
          </Button>
          <Tooltip title="Zoom In">
            <IconButton size="small" onClick={handleZoomIn}>
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Zoom">
            <IconButton size="small" onClick={handleResetZoom}>
              <RestartAlt />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;
