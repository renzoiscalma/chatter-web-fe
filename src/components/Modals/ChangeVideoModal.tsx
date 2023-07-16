import { MutationTuple, useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { SxProps, useTheme } from "@mui/material/styles";
import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { UPDATE_VIDEO } from "../../queries/Video";
import { validateYtUrl } from "../../util/helpers";
import FormButton from "../Button/FormButton";
import { UsrContxt } from "../Chatter/UserContextProvider";
import UpdateVideoStatusRequest from "../Chatter/interface/requests/UpdateVideoStatusRequest";
import GenericResponse from "../Chatter/interface/response/GenericResponse";
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

  const [videoUrlMutation, videoUrlMutationRes]: MutationTuple<
    { updateVideoStatus: GenericResponse },
    { statusInput: UpdateVideoStatusRequest }
  > = useMutation(UPDATE_VIDEO);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && videoUrl.value !== "") {
      handleSubmit();
    }
  };

  const handleSubmit = (): void => {
    setTimeout(() => {
      if (validateYtUrl(videoUrl.value)) {
        videoUrlMutation({
          variables: {
            statusInput: {
              userId: userContext.userId,
              lobbyId: userContext.lobbyId,
              url: videoUrl.value,
              currTime: 0,
              status: 2,
            },
          },
        });
      } else {
        error.setError(true);
      }
    }, 100);
    setLoading(true);
  };

  useEffect(() => {
    if (videoUrlMutationRes.data?.updateVideoStatus.success) {
      setLoading(false);
      userContext.setVideoUrl(videoUrl.value);
      handleCloseModal();
      videoUrlMutationRes.reset();
    }
  }, [videoUrlMutationRes, handleCloseModal, userContext, videoUrl.value]);

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
        <FormButton
          sx={confirmButtonSx}
          onClick={handleSubmit}
          disabled={loading || error.value}
          loading={loading}
          label="SUBMIT"
        ></FormButton>
        <Button sx={cancelButtonSx} onClick={onCloseHandler}>
          CANCEL
        </Button>
      </Box>
    </ModalBase>
  );
}

export default ChangeVideoModal;
