import React from "react";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import Toolbar from "./components/Panels/Toolbar";
import FloatingBottomToolbar from "./components/Panels/FloatingBottomToolbar";
import FloatingTopToolbar from "./components/Panels/FloatingTopToolbar";
import PedigreeCanvas from "./components/Canvas/PedigreeCanvas";
import ConditionPanel from "./components/Panels/ConditionPanel";
import IndividualEditPanel from "./components/Panels/IndividualEditPanel";
import LegendPanel from "./components/Panels/LegendPanel";
import { palette, COLORS } from "./theme/colors";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: palette.primary.main,
      light: palette.primary.light,
      dark: palette.primary.dark,
    },
    secondary: {
      main: palette.secondary.main,
      light: palette.secondary.light,
      dark: palette.secondary.dark,
    },
    error: { main: palette.error.main },
    warning: { main: palette.warning.main },
    info: { main: palette.info.main },
    text: {
      primary: palette.slate800,
      secondary: palette.slate500,
    },
    background: {
      default: COLORS.canvasBg,
      paper: "#F1F5F9",
    },
  },
  typography: {
    fontFamily: COLORS.labelFont,
    fontSize: 14,
    h6: {
      fontSize: "0.875rem",
      fontWeight: 600,
    },
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: palette.primary.main,
            backgroundColor: `${palette.primary.main}18`,
          },
          "&.Mui-selected:hover": {
            backgroundColor: `${palette.primary.main}28`,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: palette.slate200 },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* <Toolbar /> */}
        <FloatingTopToolbar />

        <Box
          sx={{
            position: "relative",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <PedigreeCanvas />
          <LegendPanel />
          <Box
            sx={{
              position: "fixed",
              top: 80,
              left: 16,
              width: 280,
              zIndex: 1500,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxHeight: "calc(100vh - 96px)",
              overflowY: "auto",
            }}
          >
            <ConditionPanel />
            <IndividualEditPanel />
          </Box>
        </Box>

        {/* <FloatingBottomToolbar /> */}

        {/* Instructions */}
        {/* <Box
          sx={{
            bgcolor: "#ecf0f1",
            p: 1.5,
            fontSize: 9,
            color: "#555",
            borderTop: "1px solid #ddd",
          }}
        >
          <strong>Instructions:</strong> Select a mode above, then click on the
          canvas to add individuals. Use "Condition" mode to mark individuals with
          conditions. Use "Drag" mode to move individuals. Use "Delete" mode to
          remove individuals/partnerships. Right-click any individual to edit
          label/name. Click "Auto-Layout" to organize pedigree automatically.
          For partnerships, click two individuals. For children, select gender
          then click parent partnership line first, then click below to place
          child. Use mouse wheel or zoom controls to zoom in/out. Shift+drag to
          pan the canvas.
        </Box> */}
      </Box>
    </ThemeProvider>
  );
};

export default App;
