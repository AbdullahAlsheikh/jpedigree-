// Single source of truth for all colors and style constants.
// MUI components consume `palette` via App.tsx createTheme().
// SVG components import COLORS directly (SVG attrs can't use MUI theme).

export const palette = {
  primary:  { main: "#2563EB", light: "#3B82F6", dark: "#1D4ED8" },
  secondary:{ main: "#059669", light: "#34D399", dark: "#047857" },
  error:    { main: "#DC2626" },
  warning:  { main: "#D97706" },
  info:     { main: "#0891B2" },
  slate200: "#E2E8F0",
  slate500: "#64748B",
  slate800: "#1E293B",
} as const;

export const COLORS = {
  canvasBg:        "#F8FAFC",
  lineStroke:      "#334155",
  selectionStroke: "#2563EB",
  symbolFill:      "#FFFFFF",
  labelFont:       "Inter, system-ui, sans-serif",
  labelSize:       11,
} as const;

export const PANEL_STYLE = {
  borderRadius:    3,
  backdropFilter:  "blur(10px)",
  backgroundColor: "rgba(248, 250, 252, 0.88)",
  elevation:       1,
} as const;

// Ordered disease color palette — cycles when more diseases are added.
export const DISEASE_COLORS: readonly string[] = [
  "#DC2626", // red
  "#2563EB", // primary blue
  "#059669", // secondary green
  "#D97706", // amber
  "#7C3AED", // violet
  "#0891B2", // cyan
];
