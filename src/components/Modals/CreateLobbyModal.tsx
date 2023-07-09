import { MutationTuple, useMutation } from "@apollo/client";
import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADD_USER_TO_LOBBY, CREATE_LOBBY } from "../../queries/App";
import { validateYtUrl } from "../../util/helpers";
import FormButton from "../Button/FormButton";
import { UsrContxt } from "../Chatter/UserContextProvider";
import Lobby from "../Chatter/interface/Lobby";
import GenericResponse from "../Chatter/interface/response/GenericResponse";
import OutlinedField from "../InputField/OutlinedField";
import useInput from "../hooks/useInput";
import ModalBase from "./ModalBase";

interface LobbyModalProps {
  opened: boolean;
  handleCloseModal(): void;
}
const CreateLobbyModal = ({ opened, handleCloseModal }: LobbyModalProps) => {
  const userContext = useContext(UsrContxt);
  const navigate = useNavigate();
  const { error, value: videoUrl, reset: resetInputField } = useInput("");
  const [loading, setLoading] = useState<boolean>(false);

  const [createLobbyMutation, createLobbyMutationRes]: MutationTuple<
    { createLobby: Lobby },
    { videoUrl: string }
  > = useMutation(CREATE_LOBBY);

  const createLobby = (videoUrl: string) => {
    // TODO add 1 second delay, loading = true modal should have a spinner inside
    setTimeout(() => {
      createLobbyMutation({
        variables: {
          videoUrl: videoUrl,
        },
      });
    }, 250);
    setLoading(true);
  };

  const [addUserToLobbyMutation, addUserToLobbyMutRes]: MutationTuple<
    { addUserToLobby: GenericResponse },
    { lobbyId: string; userId: string }
  > = useMutation(ADD_USER_TO_LOBBY);

  useEffect(() => {
    if (
      createLobbyMutationRes.data &&
      createLobbyMutationRes.data.createLobby.id
    ) {
      userContext.setVideoUrl(videoUrl.value);
      const { id } = createLobbyMutationRes.data.createLobby;
      userContext.setLobbyId(id);
      handleCloseModal();
      navigate("/lobbyId/" + id);
      addUserToLobbyMutation({
        variables: {
          lobbyId: id,
          userId: userContext.userId,
        },
      });
      setLoading(false);
    }
  }, [createLobbyMutationRes.data]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && videoUrl.value !== "") {
      handleSubmit();
    }
  };

  const handleSubmit = (): void => {
    if (validateYtUrl(videoUrl.value)) createLobby(videoUrl.value);
    else error.setError(true);
  };

  const onCloseHandler = (_: any, reason: string) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown")
      handleCloseModal();
  };

  return (
    <ModalBase
      open={opened}
      onClose={onCloseHandler}
      header="Create your room for watching together!"
    >
      <OutlinedField
        placeholder={"https://www.youtube.com/watch?v=4WXs3sKu41I"}
        defaultValue={""}
        onChange={videoUrl.handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        label="Video Url"
        error={error.value}
        helperText={error.value ? "Incorrect youtube link" : ""}
      />
      <FormButton
        onClick={handleSubmit}
        disabled={loading || error.value}
        loading={loading}
        label={"Create Lobby!"}
      ></FormButton>
    </ModalBase>
  );
};

export default CreateLobbyModal;
