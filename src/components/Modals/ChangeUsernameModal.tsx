import { MutationTuple, useMutation } from "@apollo/client";
import { SxProps, useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { CHANGE_USERNAME, VALIDATE_USERNAME } from "../../queries/MessageBar";
import FormButton from "../Button/FormButton";
import { UsrContxt } from "../Chatter/UserContextProvider";
import ChangeUsernameRequest from "../Chatter/interface/requests/ChangeUsernameRequest";
import GenericResponse from "../Chatter/interface/response/GenericResponse";
import OutlinedField from "../InputField/OutlinedField";
import useInput from "../hooks/useInput";
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
  const { error, value: username } = useInput("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successs, setSuccess] = useState<boolean>(false);

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    username.handleChange(event);
    setSuccess(false);
  };

  const closeHandler = (): void => {
    error.setError(false);
    onClose();
  };

  const handleSubmit = (): void => {
    setTimeout(() => {
      usernameValidationMutataion({
        variables: {
          username: username.value,
        },
      });
    }, 250);
    setLoading(true);
    setSuccess(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && username.value !== "") {
      handleSubmit();
    }
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
            newUsername: username.value,
          },
        });
      } else {
        error.setError(true);
        setLoading(false);
      }
    }
  }, [usernameValidationMutationProps.data]);

  useEffect(() => {
    if (
      changeUsernameMutationProps.called &&
      changeUsernameMutationProps.data?.changeUsername.success
    ) {
      userContext.setUsername(username.value);
      setSuccess(true);
      setLoading(false);
    }
  }, [changeUsernameMutationProps.data]);

  return (
    <ModalBase
      open={opened}
      onClose={closeHandler}
      header="Input New Username"
      hasCloseButton
    >
      <OutlinedField
        placeholder={"Username"}
        defaultValue={userContext.username}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        error={error.value}
        helperText={error.value ? "Incorrect entry" : ""}
        label="Username"
        disabled={loading}
      />
      <Box sx={buttonContainer}>
        <FormButton
          sx={confirmButtonSx}
          onClick={handleSubmit}
          disabled={loading || error.value}
          loading={loading}
          success={successs}
          label={"SUBMIT"}
        ></FormButton>
        <FormButton
          sx={cancelButtonSx}
          onClick={closeHandler}
          disabled={loading}
          label={"CLOSE"}
        ></FormButton>
      </Box>
    </ModalBase>
  );
};

export default ChangeUsernameModal;
