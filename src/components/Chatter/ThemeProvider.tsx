import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import React, { useContext } from "react";
import { darkTheme, lightTheme } from "../../theme";
import { UsrContxt } from "./UserContextProvider";

export default function ThemeProvider({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element {
  const userContext = useContext(UsrContxt);

  return (
    <MuiThemeProvider theme={userContext.darkMode ? darkTheme : lightTheme}>
      {children}
    </MuiThemeProvider>
  );
}
