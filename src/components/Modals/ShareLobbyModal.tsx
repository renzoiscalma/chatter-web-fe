import { Check } from "@mui/icons-material";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tooltip,
} from "@mui/material";
import { SxProps, useTheme } from "@mui/material/styles";
import { SyntheticEvent, useRef, useState } from "react";
import ModalBase from "./ModalBase";

interface ShareLobbyModalProps {
  lobbyUrl: string;
  opened: boolean;
  handleCloseModal(): void;
}
const ShareLobbyModal = ({
  lobbyUrl,
  opened,
  handleCloseModal,
}: ShareLobbyModalProps): JSX.Element => {
  const theme = useTheme();
  const [copiedLobbyUrl, setCopiedLobbyUrl] = useState<boolean>(false);
  const inputFieldRef = useRef(null);

  const textFieldSx: SxProps = {
    marginBottom: "24px",
    ".MuiInputLabel-outlined": {
      color: theme.common.text.secondary + " !important",
    },
    input: {
      color: theme.common.text.secondary,
      "&:hover": {
        cursor: "pointer",
      },
    },
    fieldset: {
      borderColor: theme.textInput?.borderColor,
      "&.MuiOutlinedInput-notchedOutline": {
        borderColor: theme.textInput?.borderColor + " !important",
      },
    },
  };

  const inputLabelSx: SxProps = {
    color: theme.common.text.secondary,
    "&.Mui-focused": {
      color: theme.common.text.secondary,
    },
  };

  const copyIconSx: SxProps = {
    color: theme.common.text.secondary,
  };

  const handleCopyAllClick = (event: SyntheticEvent): void => {
    navigator.clipboard.writeText(lobbyUrl);
    // highlight text
    (event.target as HTMLTextAreaElement).select();
    setCopiedLobbyUrl(true);

    setTimeout(() => {
      setCopiedLobbyUrl(false);
    }, 3000);
  };

  const checkIconSx: SxProps = {
    color: theme.common.text.secondary,
  };

  const tooltipTitle = (): string =>
    copiedLobbyUrl ? "Copied!" : "Click to copy url";
  const headerStr = "Share this URL to your friends!";
  return (
    <>
      <ModalBase open={opened} onClose={handleCloseModal} header={headerStr}>
        <Tooltip title={tooltipTitle()} placement="top">
          <FormControl variant="outlined">
            <InputLabel htmlFor="copy-url" sx={inputLabelSx}>
              Copy Url
            </InputLabel>
            <OutlinedInput
              onClick={handleCopyAllClick}
              autoComplete="off"
              id="copy-url"
              sx={textFieldSx}
              type="text"
              aria-readonly
              defaultValue={lobbyUrl}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleCopyAllClick}>
                    {copiedLobbyUrl ? (
                      <Check sx={checkIconSx} />
                    ) : (
                      <CopyAllIcon sx={copyIconSx} />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Lobby Url"
              ref={inputFieldRef}
              readOnly
            />
          </FormControl>
        </Tooltip>
      </ModalBase>
    </>
  );
};

export default ShareLobbyModal;
