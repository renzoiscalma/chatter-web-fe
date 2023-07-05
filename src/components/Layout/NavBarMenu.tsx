import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BadgeIcon from "@mui/icons-material/Badge";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import {
  Box,
  Divider,
  ListItemIcon,
  Menu,
  Switch,
  SxProps,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { useContext } from "react";
import { UsrContxt } from "../Chatter/UserContextProvider";

interface NavBarMenuProps {
  menuEl: HTMLElement | null;
  handleClose(): void;
  openChangeUsernameModal(): void;
  openChangeVideoModal(): void;
}

function NavBarMenu({
  menuEl,
  handleClose,
  openChangeUsernameModal,
  openChangeVideoModal,
}: NavBarMenuProps): JSX.Element {
  const userContext = useContext(UsrContxt);
  const theme = useTheme();

  const menuStyle: SxProps = {
    transform: "translateY(36px)",
    maxWidth: "400px",
    ".MuiPaper-root": {
      background: theme.modal?.bgColor,
      color: theme.common.text.secondary,
    },
  };

  const menuItemStyle: SxProps = {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.20)",
    },
    paddingLeft: "24px",
  };

  const iconStyle: SxProps = {
    color: theme.common.text.secondary,
  };

  const userInfoContainerStyle: SxProps = {
    padding: "10px 16px",
    display: "flex",
    whiteSpace: "nowrap",
  };

  const userIcon: SxProps = {
    ...iconStyle,
    width: "36px",
    height: "36px",
    marginRight: "12px",
  };

  const usernameStyle: SxProps = {
    fontWeight: "bold",
    fontStyle: "italic",
    alignSelf: "center",
  };

  return (
    <Menu
      sx={menuStyle}
      anchorEl={menuEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menuEl)}
      onClose={handleClose}
    >
      <Box sx={userInfoContainerStyle}>
        <AccountCircleIcon sx={userIcon} />
        <Typography sx={usernameStyle}>{userContext.username}</Typography>
      </Box>
      <Divider sx={{ my: 0.5 }} />
      <MenuItem sx={menuItemStyle} onClick={openChangeUsernameModal}>
        <ListItemIcon>
          <BadgeIcon sx={iconStyle} fontSize="small" />
        </ListItemIcon>
        Change Username
      </MenuItem>
      <MenuItem sx={menuItemStyle} onClick={openChangeVideoModal}>
        <ListItemIcon>
          <OndemandVideoIcon sx={iconStyle} fontSize="small" />
        </ListItemIcon>
        Change Video
      </MenuItem>
      <Divider sx={{ my: 0.5 }} />
      <MenuItem sx={menuItemStyle} onClick={userContext.darkModeToggle}>
        <ListItemIcon>
          <DarkModeIcon sx={iconStyle} fontSize="small" />
        </ListItemIcon>
        Dark Mode
        <Switch
          sx={{ marginLeft: "auto" }}
          inputProps={{ "aria-label": "Dark Mode Toggle" }}
          checked={userContext.darkMode}
          onClick={() => (event: React.ChangeEvent<HTMLButtonElement>) => {
            userContext.darkModeToggle();
            event.stopPropagation();
          }}
        ></Switch>
      </MenuItem>
    </Menu>
  );
}

export default NavBarMenu;
