import ChatIcon from "@mui/icons-material/Chat";
import PeopleIcon from "@mui/icons-material/People";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { SetStateAction, useState } from "react";

interface messageBarProps {
  chatHidden: boolean;
  showLobbyUsers: boolean;
  setShowLobbyUsers: Function;
  setChatHidden: Function;
}
function MessageBar({
  setChatHidden,
  chatHidden,
  showLobbyUsers,
  setShowLobbyUsers,
}: messageBarProps): JSX.Element {
  const theme = useTheme();
  const [toggleHideStyle, setToggleHideStyle] = useState<SxProps>({
    flexGrow: 0,
    transition: "all 0.5s ease-in",
    left: "0",
  });

  const appBarStyle: SxProps = {
    bgcolor: theme.appBar.bgColor,
    borderTop: "1px rgba(0, 0, 0, 0.32) solid",
  };

  const toolBarStyle: SxProps = {
    minHeight: "50px !important",
    height: "50px !important",
  };

  const typographyStyle: SxProps = {
    flexGrow: 0,
    margin: "0 auto",
  };

  const toggleChat = (): void => {
    setToggleHideStyle((prev: SetStateAction<SxProps<{}>>) => {
      let style: SxProps = {
        ...prev,
        position: chatHidden ? "absolute" : "relative",
        left: chatHidden ? "0" : "-64px",
        transform: chatHidden ? "scaleX(1)" : "scaleX(-1)",
      };
      return style;
    });
    setChatHidden(!chatHidden);
  };

  const toggleShowLobbyUsers = (): void => {
    setShowLobbyUsers(!showLobbyUsers);
  };

  return (
    <AppBar position="static">
      <Container sx={appBarStyle}>
        <Toolbar sx={toolBarStyle} disableGutters>
          <IconButton
            size="medium"
            onClick={toggleChat}
            color="inherit"
            sx={toggleHideStyle}
          >
            <KeyboardTabIcon />
          </IconButton>
          <Box sx={typographyStyle}>
            <Typography>LOBBY CHAT</Typography>
          </Box>
          {showLobbyUsers ? (
            <IconButton
              size="medium"
              onClick={toggleShowLobbyUsers}
              color="inherit"
            >
              <ChatIcon />
            </IconButton>
          ) : (
            <IconButton
              size="medium"
              onClick={toggleShowLobbyUsers}
              color="inherit"
            >
              <PeopleIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default MessageBar;
