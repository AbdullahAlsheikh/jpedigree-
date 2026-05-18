import React, { useState } from "react";
import {
  Button,
  Box,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Man,
  Woman,
  FaceRetouchingOff,
  ChildCare,
  LocalHospital,
  Delete,
  AutoFixHigh,
  Download,
  Clear,
  Undo,
  PanTool,
  Male,
  Female,
  Settings,
  ArrowDropDown,
} from "@mui/icons-material";
import { usePedigreeStore } from "../../store/pedigreeStore";
import { Mode, PartnershipType } from "../../types/pedigree.types";
import { PANEL_STYLE } from "../../theme/colors";

const PARTNERSHIP_TYPE_OPTIONS: {
  value: PartnershipType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "regular",
    label: "Regular",
    icon: (
      <svg width="32" height="16" viewBox="0 0 32 16">
        <line
          x1="2"
          y1="8"
          x2="30"
          y2="8"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    value: "consanguineous",
    label: "Consanguineous",
    icon: (
      <svg width="32" height="16" viewBox="0 0 32 16">
        <line
          x1="2"
          y1="5"
          x2="30"
          y2="5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="2"
          y1="11"
          x2="30"
          y2="11"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    value: "non-consanguineous",
    label: "Non-consanguineous",
    icon: (
      <svg width="32" height="16" viewBox="0 0 32 16">
        <line
          x1="2"
          y1="12"
          x2="30"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="16"
          cy="5"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="11"
          y1="11"
          x2="21"
          y2="-1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
];

const Toolbar: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [partnershipMenuAnchor, setPartnershipMenuAnchor] =
    useState<null | HTMLElement>(null);

  const {
    currentMode,
    childGender,
    partnershipType,
    scale,
    settings,
    setMode,
    setChildGender,
    setPartnershipType,
    setScale,
    updateSettings,
    updateLayoutSettings,
    clear,
    undo,
    autoLayout,
  } = usePedigreeStore();

  // Derive a unique toggle value so child-male and child-female are distinct
  const toggleValue =
    currentMode === "child" ? `child-${childGender}` : currentMode;

  const handleToggleMode = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string | null,
  ) => {
    if (newValue === null) return;
    if (newValue === "child-male") {
      setMode("child");
      setChildGender("male");
    } else if (newValue === "child-female") {
      setMode("child");
      setChildGender("female");
    } else if (newValue === "child-unknown") {
      setMode("child");
      setChildGender("unknown");
    } else {
      setMode(newValue as Mode);
    }
  };

  const getExportClone = (): {
    clone: SVGSVGElement;
    width: number;
    height: number;
  } | null => {
    const svg = document.getElementById("pedigree-svg") as SVGSVGElement | null;
    if (!svg) return null;
    const { width, height } = svg.getBoundingClientRect();
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("width", String(width));
    clone.setAttribute("height", String(height));
    // Add white background
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("width", "100%");
    bg.setAttribute("height", "100%");
    bg.setAttribute("fill", "white");
    clone.insertBefore(bg, clone.firstChild);
    return { clone, width, height };
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportSVG = () => {
    const result = getExportClone();
    if (!result) return;
    const svgStr = new XMLSerializer().serializeToString(result.clone);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${settings.exportFilename}.svg`);
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = () => {
    const result = getExportClone();
    if (!result) return;
    const { clone, width, height } = result;
    const svgStr = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(blob);
    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement("canvas");
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(svgUrl);
      return;
    }
    ctx.scale(dpr, dpr);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(svgUrl);
      triggerDownload(
        canvas.toDataURL("image/png"),
        `${settings.exportFilename}.png`,
      );
    };
    img.onerror = () => URL.revokeObjectURL(svgUrl);
    img.src = svgUrl;
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
          backdropFilter: PANEL_STYLE.backdropFilter,
          backgroundColor: PANEL_STYLE.backgroundColor,
        }}
      >
        <ToggleButtonGroup
          size="small"
          value={toggleValue}
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

          <ToggleButton value="unknown">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <polygon
                points="12,2 22,12 12,22 2,12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </ToggleButton>

          <ToggleButton value="child-male">
            <Box sx={{ position: "relative", width: 24, height: 24 }}>
              <ChildCare />
              <Male
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  fontSize: 12,
                  backgroundColor: PANEL_STYLE.backgroundColor,
                  borderRadius: "50%",
                }}
              />
            </Box>
          </ToggleButton>

          <ToggleButton value="child-female">
            <Box sx={{ position: "relative", width: 24, height: 24 }}>
              <ChildCare />
              <Female
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  fontSize: 12,
                  backgroundColor: PANEL_STYLE.backgroundColor,
                  borderRadius: "50%",
                }}
              />
            </Box>
          </ToggleButton>

          <ToggleButton value="child-unknown">
            <Box sx={{ position: "relative", width: 24, height: 24 }}>
              <ChildCare />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 12,
                  height: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: PANEL_STYLE.backgroundColor,
                  borderRadius: "50%",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <polygon
                    points="5,1 9,5 5,9 1,5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </Box>
            </Box>
          </ToggleButton>

          <ToggleButton
            value="partnership"
            onClick={(e) => {
              if (currentMode === "partnership") {
                setPartnershipMenuAnchor(e.currentTarget);
              }
            }}
            sx={{ gap: 0.25, pr: 0.5 }}
          >
            {
              PARTNERSHIP_TYPE_OPTIONS.find((o) => o.value === partnershipType)
                ?.icon
            }
            <ArrowDropDown sx={{ fontSize: 14, ml: -0.5 }} />
          </ToggleButton>

          <ToggleButton value="condition">
            <LocalHospital />
          </ToggleButton>

          <ToggleButton value="deceased">
            <FaceRetouchingOff />
          </ToggleButton>

          <ToggleButton value="delete">
            <Delete />
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Partnership type dropdown menu */}
        <Menu
          anchorEl={partnershipMenuAnchor}
          open={Boolean(partnershipMenuAnchor)}
          onClose={() => setPartnershipMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          slotProps={{ paper: { sx: { mt: 0.5 } } }}
        >
          {PARTNERSHIP_TYPE_OPTIONS.map((opt) => (
            <MenuItem
              key={opt.value}
              selected={partnershipType === opt.value}
              onClick={() => {
                setPartnershipType(opt.value);
                setPartnershipMenuAnchor(null);
              }}
              sx={{ gap: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.primary" }}>
                {opt.icon}
              </ListItemIcon>
              <ListItemText
                primary={opt.label}
                primaryTypographyProps={{ fontSize: 13 }}
              />
            </MenuItem>
          ))}
        </Menu>

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

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <IconButton size="small" onClick={handleExportSVG}>
          <Download />
        </IconButton>
        {/* <Button
          size="small"
          startIcon={<Download />}
          onClick={handleExportPNG}
          sx={{ textTransform: "none", fontSize: 12 }}
        >
          PNG
        </Button>
        <Button
          size="small"
          startIcon={<Download />}
          onClick={handleExportSVG}
          sx={{ textTransform: "none", fontSize: 12 }}
        >
          SVG
        </Button> */}

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <IconButton size="small" onClick={() => setSettingsOpen(true)}>
          <Settings />
        </IconButton>
      </Paper>

      {/* Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Export
            </Typography>
            <TextField
              label="File Name"
              size="small"
              value={settings.exportFilename}
              onChange={(e) =>
                updateSettings({ exportFilename: e.target.value })
              }
              helperText="Used for PNG and SVG downloads"
            />

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ pt: 1 }}
            >
              Auto Layout
            </Typography>
            <TextField
              label="Partner Gap"
              size="small"
              type="number"
              value={settings.layout.partnerGap}
              onChange={(e) =>
                updateLayoutSettings({ partnerGap: Number(e.target.value) })
              }
              helperText="Horizontal space between partners"
            />
            <TextField
              label="Sibling Spacing"
              size="small"
              type="number"
              value={settings.layout.siblingSpacing}
              onChange={(e) =>
                updateLayoutSettings({ siblingSpacing: Number(e.target.value) })
              }
              helperText="Horizontal space between siblings"
            />
            <TextField
              label="Family Separation"
              size="small"
              type="number"
              value={settings.layout.familySeparation}
              onChange={(e) =>
                updateLayoutSettings({
                  familySeparation: Number(e.target.value),
                })
              }
              helperText="Extra space between family groups"
            />
            <TextField
              label="Generation Spacing"
              size="small"
              type="number"
              value={settings.layout.generationSpacing}
              onChange={(e) =>
                updateLayoutSettings({
                  generationSpacing: Number(e.target.value),
                })
              }
              helperText="Vertical space between generations"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Toolbar;
