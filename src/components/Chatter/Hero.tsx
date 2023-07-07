// <a href="https://www.freepik.com/free-vector/friends-watching-horror-movie_7732623.htm#query=watchingmovie&position=3&from_view=keyword&track=ais#position=3&query=watchingmovie?log-in=google">Image by pch.vector</a> on Freepik
import { MutationTuple, useMutation } from "@apollo/client";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { SxProps, useTheme } from "@mui/material/styles";
import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroImage from "../../assets/watching-with-friends.png";
import HeroBg from "../../assets/waves-bg.svg";
import { ADD_USER_TO_LOBBY, CREATE_LOBBY } from "../../queries/App";
import { validateYtUrl } from "../../util/helpers";
import OutlinedField from "../InputField/OutlinedField";
import Navbar from "../Layout/Navbar";
import { UsrContxt } from "./UserContextProvider";
import Lobby from "./interface/Lobby";
import GenericResponse from "./interface/response/GenericResponse";

interface InputState {
  input: string;
  error: boolean;
}

function Hero(): JSX.Element {
  const userContext = useContext(UsrContxt);
  const theme = useTheme();
  const navigate = useNavigate();

  const [values, setValues] = useState<InputState>({
    input: "",
    error: false,
  });

  const contentContainer: SxProps = {
    backgroundColor: theme.appBar.bgColor,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Inter, sans-serif",
  };

  const imageSx: SxProps = {
    width: "100%",
    maxWidth: "1000px",
  };

  const headerSx: SxProps = {
    color: theme.common.text.primary,
    fontWeight: "bold",
    fontSize: "4em",
  };

  const subHeaderSx: SxProps = {
    color: theme.common.text.primary,
    fontSize: "1.3em",
  };

  const heroContainerSx: SxProps = {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    backgroundImage: `url(${HeroBg})`,
    backgroundSize: "100% 100%",
  };

  const imageContainerSx: SxProps = {
    display: "flex",
    alignItems: "flex-end",
    alignSelf: "center",
  };

  const buttonSx: SxProps = {
    width: "240px",
    height: "57px",
    alignSelf: "center",
    fontSize: "1.3em",
    fontWeight: "bold",
    background: theme.chat.bubbleTo,
    color: theme.common.text.primary,
    "&: hover": {
      backgroundColor: theme.chat.bubbleTo,
    },
  };

  const headerContainerSx: SxProps = {
    alignSelf: "center",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    rowGap: 2,
  };

  const gridContainerSx: SxProps = {
    height: "100%",
    alignContent: "center",
    marginTop: 0,
    flexWrap: "nowrap",
  };

  const textFieldSx: SxProps = {
    width: "300px",
    alignSelf: "center",
    "~::placeholder": {
      textAlign: "center",
    },
  };

  const [createLobbyMutation, createLobbyMutationRes]: MutationTuple<
    { createLobby: Lobby },
    { videoUrl: string }
  > = useMutation(CREATE_LOBBY);

  const createLobby = (videoUrl: string) => {
    createLobbyMutation({
      variables: {
        videoUrl: videoUrl,
      },
    });
    userContext.setVideoUrl(videoUrl);
  };

  const [addUserToLobbyMutation, addUserToLobbyMutRes]: MutationTuple<
    { addUserToLobby: GenericResponse },
    { lobbyId: string; userId: string }
  > = useMutation(ADD_USER_TO_LOBBY);

  useEffect(() => {
    if (createLobbyMutationRes.data) {
      createLobbyMutationRes.reset();
      const { id } = createLobbyMutationRes.data.createLobby;
      userContext.setLobbyId(id);
      navigate("/lobbyId/" + id);
      addUserToLobbyMutation({
        variables: {
          lobbyId: id,
          userId: userContext.userId,
        },
      });
    }
  }, [createLobbyMutationRes.data, addUserToLobbyMutation]);

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

  return (
    <Box sx={contentContainer}>
      <Navbar mini></Navbar>
      <Box sx={heroContainerSx}>
        <Grid container spacing={5} direction="column" sx={gridContainerSx}>
          <Grid item xs={6} md={6} sx={headerContainerSx}>
            <Typography sx={headerSx}>
              Watching has never been easier.
            </Typography>
            <Typography sx={subHeaderSx}>
              Watch videos, chat together with your friends
            </Typography>
            <OutlinedField
              placeholder={"https://www.youtube.com/watch?v=4WXs3sKu41I"}
              defaultValue={""}
              onChange={handleChange("input")}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoFocus
              label="Enter a Youtube Url Here"
              error={values.error}
              helperText={values.error ? "Incorrect youtube link" : ""}
              sx={textFieldSx}
            />
            <Button onClick={() => submitHandler()} sx={buttonSx}>
              Get Started!
            </Button>
          </Grid>
          <Grid item xs={6} md={6} sx={imageContainerSx}>
            <Box
              component="img"
              src={HeroImage}
              alt="friends-watching-movie-in-couch"
              sx={imageSx}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Hero;
