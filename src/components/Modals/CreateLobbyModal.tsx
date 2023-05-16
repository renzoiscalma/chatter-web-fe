import { MutationTuple, useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsrContxt } from "../../App";
import { ADD_USER_TO_LOBBY, CREATE_LOBBY } from "../../queries/App";
import { validateYtUrl } from "../../util/helpers";
import Lobby from "../Chatter/interface/Lobby";
import GenericResponse from "../Chatter/interface/response/GenericResponse";
import OutlinedField from "../InputField/OutlinedField";
import ModalBase from "./ModalBase";

interface LobbyModalProps {
  opened: boolean;
  closable: boolean;
  handleCloseModal(): void;
}
interface InputState {
  input: string;
  error: boolean;
}

const CreateLobbyModal = ({
  opened,
  handleCloseModal,
  closable,
}: LobbyModalProps) => {
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
    input: "",
    error: false,
  });

  const [addUserToLobbyMutation, addUserToLobbyMutRes]: MutationTuple<
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

  const onCloseHandler = (_: any, reason: string) => {
    if ((reason !== "backdropClick" && reason !== "escapeKeyDown") || closable)
      handleCloseModal();
  };

  return (
    <ModalBase
      open={opened}
      onClose={onCloseHandler}
      header="Create your room for watching together!"
      hasCloseButton={closable}
    >
      <OutlinedField
        placeholder={"https://www.youtube.com/watch?v=4WXs3sKu41I"}
        defaultValue={""}
        onChange={handleChange("input")}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        label="Video Url"
        error={values.error}
        helperText={values.error ? "Incorrect youtube link" : ""}
      />
      <Button onClick={() => submitHandler()}>Create Lobby!</Button>
    </ModalBase>
  );
};

export default CreateLobbyModal;
