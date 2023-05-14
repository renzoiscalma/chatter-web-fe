import { MutationTuple, useMutation } from "@apollo/client";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { SxProps, useTheme } from "@mui/material/styles";
import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsrContxt } from "../../App";
import { ADD_USER_TO_LOBBY, CREATE_LOBBY } from "../../queries/App";
import { NONE_LOBBY_ID } from "../../util/constants";
import { validateYtUrl } from "../../util/helpers";
import Lobby from "../Chatter/interface/Lobby";
import GenericResponse from "../Chatter/interface/response/GenericResponse";

interface LobbyModalProps {
  opened: boolean;
  handleCloseModal(): void;
}
interface InputState {
  input: string;
  error: boolean;
}

const CreateLobbyModal = ({ opened, handleCloseModal }: LobbyModalProps) => {
  const theme = useTheme();
  const userContext = useContext(UsrContxt);
  const navigate = useNavigate();

  const [createLobbyMutation, createLobbyMutationRes]: MutationTuple<
    { createLobby: Lobby },
    { videoUrl: string }
  > = useMutation(CREATE_LOBBY);

  const createLobby = (videoUrl: string) => {
    // TODO add 1 second delay, loading = true modal should have a spinner inside
    createLobbyMutation({
      variables: {
        videoUrl: videoUrl,
      },
    });
    userContext.setVideo(videoUrl);
  };

  const [values, setValues] = useState<InputState>({
    input: "https://www.youtube.com/watch?v=4WXs3sKu41I",
    error: false,
  });

  const [addUserToLobbyMutation, addUserToLobbbyMutRes]: MutationTuple<
    { addUserToLobby: GenericResponse },
    { lobbyId: string; userId: string }
  > = useMutation(ADD_USER_TO_LOBBY);

  useEffect(() => {
    if (createLobbyMutationRes.data) {
      const { id } = createLobbyMutationRes.data.createLobby;
      userContext.setLobbyId(id);
      handleCloseModal();
      navigate("/?lobbyId=" + id);
      addUserToLobbyMutation({
        variables: {
          lobbyId: id,
          userId: userContext.userId,
        },
      });
    }
  }, [createLobbyMutationRes.data]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && values.input !== "") {
      submitHandler();
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

  const validateField = (): boolean => {
    if (!validateYtUrl(values.input)) return false;
    return true;
  };

  const submitHandler = (): void => {
    if (validateField()) createLobby(values.input);
    else setValues((values) => ({ ...values, error: true }));
  };

  const onCloseHandler = (_: object, reason: string) => {
    if (
      (reason !== "backdropClick" && reason !== "escapeKeyDown") ||
      userContext.lobbyId !== NONE_LOBBY_ID
    )
      handleCloseModal();
  };

  const style: SxProps = {
    display: "flex",
    flexDirection: "column",
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "26px",
    width: 400,
    bgcolor: theme.modal?.bgColor,
    px: 4,
    py: 2,
    "&:focus": {
      outline: "none",
    },
  };

  const textFieldSx: SxProps = {
    margin: "18px 0",
    ".MuiInputLabel-outlined": {
      color: theme.common.text.secondary,
    },
    input: {
      color: theme.common.text.secondary,
    },
    fieldset: {
      borderColor: theme.textInput?.borderColor,
      "&.MuiOutlinedInput-notchedOutline": {
        borderColor: theme.textInput?.borderColor,
      },
      "&.Mui-error": {
        borderColor: theme.common.text.decline,
      },
    },
    ".MuiFormHelperText-root": {
      margin: "0 auto",
      marginTop: "5px",
    },
  };

  const closeButtonContainerSx: SxProps = {
    position: "absolute",
    top: "5px",
    right: "8px",
  };

  const closeButtonSx: SxProps = {
    color: theme.common.text.secondary,
    width: "20px",
  };

  return (
    <Modal open={opened} onClose={onCloseHandler}>
      <Box sx={style}>
        {userContext.lobbyId && userContext.lobbyId !== "NONE" && (
          <Box sx={closeButtonContainerSx}>
            <IconButton aria-label="Example" onClick={handleCloseModal}>
              <CloseIcon sx={closeButtonSx} />
            </IconButton>
          </Box>
        )}
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          color={theme.common.text.secondary}
        >
          Create your lobby for you and your friends!
        </Typography>
        <TextField
          error={values.error}
          helperText={values.error ? "Incorrect entry." : ""}
          autoComplete="off"
          sx={textFieldSx}
          id="outlined-basic"
          label="Video Url"
          variant="outlined"
          onChange={handleChange("input")}
          onKeyDown={handleKeyDown}
          defaultValue="https://www.youtube.com/watch?v=4WXs3sKu41I"
          placeholder="https://www.youtube.com/watch?v=4WXs3sKu41I"
        />
        <Button onClick={() => submitHandler()}>Create Lobby!</Button>
      </Box>
    </Modal>
  );
};

export default CreateLobbyModal;
