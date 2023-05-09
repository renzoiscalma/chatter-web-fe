import { MutationTuple, useMutation } from "@apollo/client";
import { Button } from "@mui/material";
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
  };

  const cancelButtonSx: SxProps = {
    flexGrow: 1,
    color: theme.common.text.decline,
    fontWeight: "bold",
  };

  const buttonContainer: SxProps = {
    display: "flex",
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
      onClose();
    }
  }, [changeUsernameMutationProps.data]);

  return (
    <ModalBase open={opened} onClose={onClose} header="Input New Username">
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
        <Button sx={confirmButtonSx} onClick={submitHandler}>
          SUBMIT
        </Button>
        <Button sx={cancelButtonSx} onClick={onClose}>
          CANCEL
        </Button>
      </Box>
    </ModalBase>
  );
};

export default ChangeUsernameModal;
