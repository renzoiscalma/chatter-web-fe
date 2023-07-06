import ClickAwayListener from "@mui/base/ClickAwayListener";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Settings from "@mui/icons-material/Settings";
import ShareIcon from "@mui/icons-material/Share";
import { Tooltip } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { SxProps, useTheme } from "@mui/material/styles";
import { MouseEvent, useContext, useEffect, useState } from "react";

import logo from "../../assets/chatter.png";
import { NONE_LOBBY_ID } from "../../util/constants";
import { UsrContxt } from "../Chatter/UserContextProvider";
import ChangeUsernameModal from "../Modals/ChangeUsernameModal";
import ChangeVideoModal from "../Modals/ChangeVideoModal";
import CreateLobbyModal from "../Modals/CreateLobbyModal";
import ShareLobbyModal from "../Modals/ShareLobbyModal";
import NavBarMenu from "./NavBarMenu";

interface NavbarProps {
  mini?: boolean;
}

function Navbar({ mini }: NavbarProps): JSX.Element {
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);
  const [changeVideoModal, setChangeVideoModal] = useState<boolean>(false);
  const [shareLobbyModal, setShareLobbyModal] = useState<boolean>(false);
  const [createLobbyModal, setCreateLobbyModal] = useState<boolean>(false);
  const [usernameModal, setUsernameModal] = useState<boolean>(false);
  const userContext = useContext(UsrContxt);
  const theme = useTheme();

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    if (menuEl) setMenuEl(null);
    else setMenuEl(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setMenuEl(null);
  };

  const openChangeUsernameModal = (): void => {
    handleMenuClose();
    setUsernameModal(true);
  };

  const openChangeVideoModal = (): void => {
    handleMenuClose();
    setChangeVideoModal(true);
  };

  const openShareLobbyModal = (): void => {
    handleMenuClose();
    setShareLobbyModal(true);
  };

  const openCreateLobbyModal = (): void => {
    setCreateLobbyModal(true);
  };

  useEffect(() => {
    if (userContext.lobbyId === NONE_LOBBY_ID) {
      openCreateLobbyModal();
    } else {
      setCreateLobbyModal(false);
    }
  }, [userContext.lobbyId]);

  const appBarStyle: SxProps = {
    bgcolor: theme.appBar.bgColor,
    zIndex: 1,
  };

  const containerSx: SxProps = {
    margin: "0",
    padding: "0 10px",
  };

  const logoSx: SxProps = {
    width: 95,
  };

  if (mini)
    return (
      <AppBar position="static" sx={appBarStyle}>
        <Container sx={containerSx} maxWidth={false}>
          <Toolbar disableGutters>
            <Typography sx={{ flexGrow: 1 }}>
              <Box component="img" sx={logoSx} alt="chatter" src={logo} />
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    );

  return (
    <AppBar position="static" sx={appBarStyle}>
      <Container sx={containerSx} maxWidth={false}>
        <Toolbar disableGutters>
          <Typography sx={{ flexGrow: 1 }}>
            <Box component="img" sx={logoSx} alt="chatter" src={logo} />
          </Typography>
          <IconButton
            size="large"
            onClick={openCreateLobbyModal}
            color="inherit"
          >
            <Tooltip title="Create a new lobby" placement="bottom">
              <PostAddIcon />
            </Tooltip>
          </IconButton>
          <IconButton
            size="large"
            onClick={openShareLobbyModal}
            color="inherit"
          >
            <Tooltip title="Share this lobby" placement="bottom">
              <ShareIcon />
            </Tooltip>
          </IconButton>
          <ClickAwayListener onClickAway={handleMenuClose}>
            <Box sx={{ flexGrow: 0 }}>
              <IconButton size="large" onClick={handleMenuOpen} color="inherit">
                <Tooltip title="Settings" placement="bottom">
                  <Settings />
                </Tooltip>
              </IconButton>
              <NavBarMenu
                menuEl={menuEl}
                handleClose={handleMenuClose}
                openChangeUsernameModal={openChangeUsernameModal}
                openChangeVideoModal={openChangeVideoModal}
              />
            </Box>
          </ClickAwayListener>
        </Toolbar>
      </Container>
      <CreateLobbyModal
        opened={createLobbyModal}
        closable={Boolean(
          userContext.lobbyId !== NONE_LOBBY_ID && userContext.lobbyId
        )}
        handleCloseModal={() => {
          setCreateLobbyModal(false);
        }}
      />
      <ShareLobbyModal
        lobbyUrl={`${process.env.REACT_APP_URI}#/lobbyId/${userContext.lobbyId}`}
        opened={shareLobbyModal}
        handleCloseModal={() => {
          setShareLobbyModal(false);
        }}
      />
      <ChangeVideoModal
        opened={changeVideoModal}
        handleCloseModal={() => {
          setChangeVideoModal(false);
        }}
      />
      <ChangeUsernameModal
        opened={usernameModal}
        onClose={() => {
          setUsernameModal(false);
        }}
      />
    </AppBar>
  );
}

export default Navbar;
