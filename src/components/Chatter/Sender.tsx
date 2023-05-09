import { Send } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  OutlinedInput,
  SxProps,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { KeyboardEvent, useContext } from "react";
import { UsrContxt } from "../../App";

interface SenderProps {
  handleSendMessage(message: string): void;
}
interface State {
  message: string;
}

function Sender({ handleSendMessage }: SenderProps): JSX.Element {
  const theme = useTheme();

  const userContext = useContext(UsrContxt);

  const [values, setValues] = React.useState<State>({
    message: "",
  });

  const textFieldStyle = {
    width: "95%",
    margin: "12px",
    color: theme.common.text.secondary,
    fieldset: {
      borderColor: theme.textInput?.borderColor,
      "&.MuiOutlinedInput-notchedOutline": {
        borderColor: theme.textInput?.borderColor + " !important",
      },
    },
  };

  const iconSx: SxProps = {
    color: theme.chat.bubbleTo,
    "&.Mui-disabled": {
      color: theme.chat.bubbleTo,
      opacity: "60%",
    },
  };

  const sendContainerStyle: SxProps = {
    bgcolor: theme.textInput?.sendBgColor,
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && values.message !== "") {
      handleSendMessage(values.message);
      setValues({ message: "" });
    }
  };

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ [prop]: event.target.value });
    };

  const sendButton = (
    <InputAdornment position="end">
      <IconButton
        disabled={values.message === ""}
        aria-label="send message"
        onClick={() => {
          handleSendMessage(values.message);
          setValues({ message: "" });
        }}
        edge="end"
        sx={iconSx}
      >
        <Send />
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box sx={sendContainerStyle}>
      <OutlinedInput
        autoComplete="off"
        value={values.message}
        onChange={handleChange("message")}
        onKeyDown={handleKeyDown}
        id="outlined-basic"
        size="small"
        sx={textFieldStyle}
        endAdornment={sendButton}
      />
    </Box>
  );
}

export default Sender;
