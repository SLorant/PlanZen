import { extendTheme } from "@chakra-ui/react";
import "@fontsource/lato";
import "@fontsource/nunito";

const colors = {
  primary: {
    200: "var(--primary)",
    500: "var(--primary)",
  },
  secondary: {
    200: "var(--secondary)",
    500: "var(--secondary)",
  },
  accent: "var(--accent)",
  text: {
    200: "var(--text)",
    500: "var(--text)",
  },
  bg: "var(--bg)",
  darktext: "var(--darktext)",
  /*   lime: {
    500: props.colorMode == "light" ? "#43e56e" : "#19bc8b",
  }, */
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
        "--bg": props.colorMode == "light" ? "#f0f4f3" : "#141f1d",
      },
    }),
  },
  colors,
};

export default extendTheme(overrides);
