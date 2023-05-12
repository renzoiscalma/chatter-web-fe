import { MutationTuple, useMutation } from "@apollo/client";
import CheckIcon from "@mui/icons-material/Check";
import { Button, CircularProgress } from "@mui/material";
import { SxProps, useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { UsrContxt } from "../../App";
import { CHANGE_USERNAME, VALIDATE_USERNAME } from "../../queries/MessageBar";
import ChangeUsernameRequest from "../Chatter/interface/requests/ChangeUsernameRequest";
import GenericResponse from "../Chatter/interface/response/GenericResponse";
import OutlinedField from "../InputField/OutlinedField";
import ModalBase from "./ModalBase";
interface ChangeUsernameModalProps {
  opened: boolean;
  onClose(): void;
}

const ChangeUsernameModal = ({
  opened,
  onClose,
}: ChangeUsernameModalProps): JSX.Element => {
  const theme = useTheme();
  const userContext = useContext(UsrContxt);
  const [error, setError] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const [changeUsernameMutation, changeUsernameMutationProps]: MutationTuple<
    { changeUsername: GenericResponse },
    ChangeUsernameRequest
  > = useMutation(CHANGE_USERNAME);

  const [
    usernameValidationMutataion,
    usernameValidationMutationProps,
  ]: MutationTuple<
    { validateUsername: GenericResponse & { valid: boolean } },
    {
      username: string;
    }
  > = useMutation(VALIDATE_USERNAME);

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

  const loadingSx: SxProps = {
    width: "24px !important",
    height: "24px !important",
    position: "absolute",
    left: "38px",
  };

  const successSx: SxProps = {
    width: "24px !important",
    height: "24px !important",
    position: "absolute",
    left: "38px",
  };

  const closeHandler = (): void => {
    usernameValidationMutationProps.reset();
    changeUsernameMutationProps.reset();
    setError(false);
    onClose();
  };

  const submitHandler = (): void => {
    usernameValidationMutataion({
      variables: {
        username: username,
      },
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && username !== "") {
      submitHandler();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setError(false);
  };

  useEffect(() => {
    if (
      usernameValidationMutationProps.called &&
      usernameValidationMutationProps.data
    ) {
      if (usernameValidationMutationProps.data?.validateUsername?.valid) {
        changeUsernameMutation({
          variables: {
            userId: userContext.userId,
            newUsername: username,
          },
        });
      } else {
        setError(true);
      }
    }
  }, [usernameValidationMutationProps.data]);

  useEffect(() => {
    if (
      changeUsernameMutationProps.called &&
      changeUsernameMutationProps.data?.changeUsername.success
    ) {
      userContext.setUsername(username);
      setTimeout(() => {
        closeHandler();
      }, 1000);
    }
  }, [changeUsernameMutationProps.data]);

  return (
    <ModalBase open={opened} onClose={closeHandler} header="Input New Username">
      <OutlinedField
        placeholder={"Username"}
        defaultValue={userContext.username}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        error={error}
        helperText={error ? "Incorrect entry" : ""}
        label="Username"
        disabled={usernameValidationMutationProps.loading}
      />
      <Box sx={buttonContainer}>
        <Button
          sx={confirmButtonSx}
          onClick={submitHandler}
          disabled={usernameValidationMutationProps.loading}
        >
          {usernameValidationMutationProps.loading && (
            <CircularProgress sx={loadingSx} />
          )}
          {changeUsernameMutationProps.data?.changeUsername.success && (
            <CheckIcon sx={successSx} />
          )}
          SUBMIT
        </Button>
        <Button
          sx={cancelButtonSx}
          onClick={closeHandler}
          disabled={usernameValidationMutationProps.loading}
        >
          CANCEL
        </Button>
      </Box>
    </ModalBase>
  );
};

export default ChangeUsernameModal;
