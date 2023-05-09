import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { SxProps, useTheme } from "@mui/material/styles";
import { KeyboardEvent, useContext, useState } from "react";
import { UsrContxt } from "../../App";
import { validateYtUrl } from "../../util/helpers";
import OutlinedField from "../InputField/OutlinedField";
import ModalBase from "./ModalBase";

interface ChangeVideoModalProps {
  opened: boolean;
  handleCloseModal(): void;
}

interface InputState {
  input: string;
  error: boolean;
}

/**
 *  A generic modal that contains a SINGLE text input, a confirm and a cancel button.
 * does not support validation from backend.
 **/
function ChangeVideoModal({
  opened,
  handleCloseModal,
}: ChangeVideoModalProps): JSX.Element {
  const theme = useTheme();
  const userContext = useContext(UsrContxt);

  const confirmButtonSx: SxProps = {
    flexGrow: 1,
    color: theme.common.text.accept,
    fontWeight: "bold",
  };

  const cancelButtonSx: SxProps = {
    flexGrow: 1,
    color: theme.common.text.decline,
    fontWeight: "bold",
  };

  const buttonContainer: SxProps = {
    display: "flex",
  };

  const [values, setValues] = useState<InputState>({
    input: "",
    error: false,
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && values.input !== "") {
      handleSubmit();
    }
  };

  const handleChange =
    (prop: keyof InputState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((values) => ({
        ...values,
        [prop]: event.target.value,
        error: false,
      }));
    };

  const handleSubmit = (): void => {
    if (validateYtUrl(values.input)) {
      userContext.setVideo(values.input);
      handleCloseModal();
    } else {
      setValues((values) => ({ ...values, error: true }));
    }
  };

  const onCloseHandler = (): void => {
    setValues({
      error: false,
      input: "",
    });
    handleCloseModal();
  };

  return (
    <ModalBase
      open={opened}
      onClose={onCloseHandler}
      header="Input New Video Url"
    >
      <OutlinedField
        error={values.error}
        helperText={values.error ? "Incorrect entry." : ""}
        autoComplete="off"
        id="outlined-basic"
        label={"Youtube Url"}
        onChange={handleChange("input")}
        onKeyDown={handleKeyDown}
        defaultValue={userContext.videoUrl}
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
