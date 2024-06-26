import { extendTheme } from "@chakra-ui/react";
import "@fontsource/lato";
import "@fontsource/nunito";

const colors = {
  primary: {
    200: "var(--primary)",
    500: "var(--primary)",
  },
  secondary: {
    50: "var(--secondary)",
    100: "var(--secondary)",
    200: "var(--secondary)",
    300: "var(--secondary)",
    400: "var(--secondary)",
    500: "var(--secondary)",
    600: "var(--secondary)",
    700: "var(--secondary)",
    800: "var(--secondary)",
    900: "var(--secondary)",
  },
  secondaryNoScheme: "var(--secondary)",
  accent: "var(--accent)",
  text: {
    200: "var(--text)",
    500: "var(--text)",
  },
  bg: "var(--bg)",
  cardbg: "var(--cardbg)",
  darktext: "var(--darktext)",
};
const overrides = {
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  fonts: {
    heading: '"Nunito", sans-serif',
    body: '"Nunito", sans-serif',
  },
  styles: {
    global: (props) => ({
      "html, body": {
        color: props.colorMode === "dark" ? "#e1e1e1" : "#292929",
        background: props.colorMode === "dark" ? "#141f1d" : "#f0f4f3",
      },
      "*:focus": {
        boxShadow: "none !important",
      },

      "*[data-focus]": {
        boxShadow: "none !important",
      },
      ":root": {
        "--primary": props.colorMode == "light" ? "#43e56e" : "#19bc8b",
        "--secondary": props.colorMode == "light" ? "#9cf971" : "#82d1a6",
        "--accent": props.colorMode == "light" ? "#479467" : "#1e2723",
        "--text": props.colorMode == "light" ? "#292929" : "#e1e1e1",
        "--darktext": "#292929",
        "--bg": props.colorMode == "light" ? "#f0f4f3" : "#1A202C",
        "--cardbg": props.colorMode == "light" ? "white" : "#2D3748",
      },
    }),
  },
  colors,
};

export default extendTheme(overrides);
