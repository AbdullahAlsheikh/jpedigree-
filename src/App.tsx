import React from "react";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import Toolbar from "./components/Panels/Toolbar";
import FloatingBottomToolbar from "./components/Panels/FloatingBottomToolbar";
import FloatingTopToolbar from "./components/Panels/FloatingTopToolbar";
import PedigreeCanvas from "./components/Canvas/PedigreeCanvas";
import DiseasePanel from "./components/Panels/DiseasePanel";
import LegendPanel from "./components/Panels/LegendPanel";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3498db",
    },
    secondary: {
      main: "#2ecc71",
    },
    error: {
      main: "#e74c3c",
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
          <DiseasePanel />
        </Box>

        <FloatingBottomToolbar />

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
          canvas to add individuals. Use "Disease" mode to mark individuals with
          diseases. Use "Drag" mode to move individuals. Use "Delete" mode to
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
