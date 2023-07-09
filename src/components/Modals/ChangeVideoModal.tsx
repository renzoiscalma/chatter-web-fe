import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { SxProps, useTheme } from "@mui/material/styles";
import { KeyboardEvent, useContext, useState } from "react";
import { validateYtUrl } from "../../util/helpers";
import { UsrContxt } from "../Chatter/UserContextProvider";
import OutlinedField from "../InputField/OutlinedField";
import useInput from "../hooks/useInput";
import ModalBase from "./ModalBase";

interface ChangeVideoModalProps {
  opened: boolean;
  handleCloseModal(): void;
}

function ChangeVideoModal({
  opened,
  handleCloseModal,
}: ChangeVideoModalProps): JSX.Element {
  const theme = useTheme();
  const userContext = useContext(UsrContxt);
  const [loading, setLoading] = useState<boolean>(false);

  const { error, value: videoUrl, reset: resetInputField } = useInput("");

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && videoUrl.value !== "") {
      handleSubmit();
    }
  };

  const handleSubmit = (): void => {
    setTimeout(() => {
      if (validateYtUrl(videoUrl.value)) {
        userContext.setVideoUrl(videoUrl.value);
        handleCloseModal();
      } else {
        error.setError(true);
      }
    }, 100);
    setLoading(true);
  };

  const onCloseHandler = (): void => {
    resetInputField();
    handleCloseModal();
  };

  const confirmButtonSx: SxProps = {
    flexGrow: 1,
    color: theme.common.text.accept,
    fontWeight: "bold",
    "&.Mui-disabled": {
      color: theme.common.text.accept,
      opacity: 0.6,
      fontWeight: "bold",
    },
  };

  const cancelButtonSx: SxProps = {
    flexGrow: 1,
    color: theme.common.text.decline,
    fontWeight: "bold",
    "&.Mui-disabled": {
      color: theme.common.text.decline,
      opacity: 0.6,
      fontWeight: "bold",
    },
  };

  const buttonContainer: SxProps = {
    display: "flex",
  };

  return (
    <ModalBase
      open={opened}
      onClose={onCloseHandler}
      header="Input New Video Url"
      hasCloseButton
    >
      <OutlinedField
        error={error.value}
        helperText={error.value ? "Incorrect entry." : ""}
        autoComplete="off"
        id="outlined-basic"
        label={"Youtube Url"}
        onChange={videoUrl.handleChange}
        onKeyDown={handleKeyDown}
        defaultValue={""}
        placeholder="https://www.youtube.com/watch?v=4WXs3sKu41I"
      />
      <Box sx={buttonContainer}>
        <Button sx={confirmButtonSx} onClick={handleSubmit}>
          SUBMIT
        </Button>
        <Button sx={cancelButtonSx} onClick={onCloseHandler}>
          CANCEL
        </Button>
      </Box>
    </ModalBase>
  );
}

export default ChangeVideoModal;
