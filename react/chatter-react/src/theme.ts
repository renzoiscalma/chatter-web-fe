import { Theme } from "@mui/material";
import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          background: "#5e646a",
        },
      },
    },
  },
  chat: {
    bubbleFrom: "#182533",
    bubbleTo: "#2b5278",
    bgColor: "#0e1621",
  },
  common: {
    text: {
      primary: "#e4ecf2",
      secondary: "#b9c7d3",
      tertiary: "#6d7f8f",
      accept: "#008148",
      decline: "#ED254E",
    },
    base: "#0e1621",
  },
  appBar: {
    bgColor: "#17212b",
  },
  modal: {
    bgColor: "#17212b",
  },
  button: {
    cancelTextColor: "#ffffff",
    confirmTextColor: "#ffffff",
  },
  textInput: {
    sendBgColor: "#17212b",
    textColor: "#ffffff",
    borderColor: "#5e646a",
  },
});

export const lightTheme: Theme = createTheme({
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          background: "#9f9b9b",
        },
      },
    },
  },
  chat: {
    bubbleFrom: "#e5e5ea",
    bubbleTo: "#248bf5",
    bgColor: "#ffffff",
  },
  common: {
    text: {
      primary: "#ffffff",
      secondary: "#000000",
      tertiary: "#ffffff",
      accept: "#008148",
      decline: "#ED254E",
    },
    base: "#ffffff",
  },
  appBar: {
    bgColor: "#248bf5",
  },
  modal: {
    bgColor: "#ffffff",
  },
  button: {
    cancelTextColor: "#ffffff",
    confirmTextColor: "#ffffff",
  },
  textInput: {
    sendBgColor: "#ffffff",
    textColor: "#000000",
    borderColor: "#000000",
  },
});
