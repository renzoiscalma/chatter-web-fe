import {
  LazyQueryResultTuple,
  MutationTuple,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { ThemeProvider } from "@mui/material/styles";
import { createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSearchParams } from "react-router-dom";
import UserContext from "./components/Chatter/interface/UserContext";
import IsLobbyExistingRequest from "./components/Chatter/interface/requests/IsLobbyExistingRequest";
import UpdateVideoStatusRequest from "./components/Chatter/interface/requests/UpdateVideoStatusRequest";
import AddNewUserResponse from "./components/Chatter/interface/response/AddNewUserResponse";
import GenericResponse from "./components/Chatter/interface/response/GenericResponse";
import IsLobbyExistingResponse from "./components/Chatter/interface/response/IsLobbyExistingResponse";
import Layout from "./components/Layout/Layout";
import {
  ADD_NEW_USER,
  ADD_USER_TO_LOBBY,
  IS_LOBBY_EXISTING,
  REMOVE_USER_TO_LOBBY,
} from "./queries/App";
import { UPDATE_VIDEO } from "./queries/Video";
import { darkTheme, lightTheme } from "./theme";
import { NONE_LOBBY_ID } from "./util/constants";

export const UsrContxt = createContext<UserContext>({
  username: "",
  userId: "",
  lobbyId: "",
  videoUrl: "",
  darkMode: true,
  setUsername: () => {},
  setLobbyId: () => {},
  darkModeToggle: () => {},
  setVideo: () => {},
});

function App(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [lobbyId, setLobbyId] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [userCookie, setUserCookie] = useCookies(["user-cookie"]);
  const [searchParams, setSearchParams] = useSearchParams();

  // TODO ADD PROPER TYPES
  const [newUserMutation, newUserMutationRes]: MutationTuple<
    { addNewUser: AddNewUserResponse },
    null
  > = useMutation(ADD_NEW_USER);

  // TODO interface for params
  const [addUserToLobbyMutation, addUserToLobbbyMutRes]: MutationTuple<
    { addUserToLobby: GenericResponse },
    { lobbyId: string; userId: string }
  > = useMutation(ADD_USER_TO_LOBBY);

  // TODO interface for params
  const [removeUserToLobbyMutation, removeUserToLobbyMutRes]: MutationTuple<
    { removeUserToLobby: GenericResponse },
    { lobbyId: string; userId: string }
  > = useMutation(REMOVE_USER_TO_LOBBY);

  const [isLobbyExisting, isLobbyExistingRes]: LazyQueryResultTuple<
    { isLobbyExisting: IsLobbyExistingResponse },
    IsLobbyExistingRequest
  > = useLazyQuery(IS_LOBBY_EXISTING);

  const [videoUrlMutation, videoUrlMutationProps]: MutationTuple<
    { updateVideoStatus: GenericResponse },
    { statusInput: UpdateVideoStatusRequest }
  > = useMutation(UPDATE_VIDEO);

  const handleSetVideo = (videoUrl: string) => {
    setVideoUrl(videoUrl);
  };

  const handleSetLobbyId = (lobbyId: string) => {
    setLobbyId(lobbyId);
  };

  const handleSetUsername = (username: string) => {
    setUsername(username);
    setUserCookie(
      "user-cookie",
      { userId: userId, username },
      {
        path: "/",
        expires: new Date("11-10-2023"),
      }
    );
  };

  const handleDarkModeToggle = () => {
    setDarkMode((val) => !val);
  };

  const handleBeforeUnload = (): void => {
    removeUserToLobbyMutation({
      variables: {
        lobbyId,
        userId,
      },
    });
  };

  useEffect(() => {
    if (!userCookie?.["user-cookie"]) {
      newUserMutation();
    } else {
      const { userId, username } = userCookie["user-cookie"];
      setUsername(username);
      setUserId(userId);
    }
  }, [userCookie]);

  useEffect(() => {
    const lobbyId = searchParams.get("lobbyId") || "";
    if (lobbyId) {
      isLobbyExisting({
        variables: {
          lobbyId: lobbyId,
        },
      });
    } else {
      setLobbyId(NONE_LOBBY_ID); // needed to control initial createlobbymodal to pop up
    }
  }, [searchParams]);

  useEffect(() => {
    if (lobbyId && lobbyId !== NONE_LOBBY_ID)
      videoUrlMutation({
        variables: {
          statusInput: {
            url: videoUrl,
            lobbyId: lobbyId,
            userId: userId, // needed to update self's video as well
            currTime: 0,
            status: -1,
          },
        },
      });
  }, [videoUrl]);

  useEffect(() => {
    if (newUserMutationRes.data) {
      let { code, success, user } = newUserMutationRes.data.addNewUser;
      if (code === 200 && success) {
        setUsername(user.username);
        setUserId(user.id);
        setUserCookie(
          "user-cookie",
          { userId: user.id, username: user.username },
          {
            path: "/",
            expires: new Date("11-10-2023"),
          }
        );
      }
    }
  }, [newUserMutationRes.data]);

  useEffect(() => {
    if (
      userId &&
      isLobbyExistingRes.data &&
      isLobbyExistingRes.data.isLobbyExisting.isExisting
    ) {
      setLobbyId(isLobbyExistingRes.data.isLobbyExisting.lobbyId);
      addUserToLobbyMutation({
        variables: {
          lobbyId: isLobbyExistingRes.data.isLobbyExisting.lobbyId,
          userId,
        },
      });
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeUnload", handleBeforeUnload);
    }
  }, [isLobbyExistingRes, lobbyId, userId]);

  return (
    <UsrContxt.Provider
      value={{
        username,
        setUsername: handleSetUsername,
        userId,
        lobbyId,
        darkMode,
        videoUrl,
        setVideo: handleSetVideo,
        darkModeToggle: handleDarkModeToggle,
        setLobbyId: handleSetLobbyId,
      }}
    >
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <div className="App">
          <Layout />
        </div>
      </ThemeProvider>
    </UsrContxt.Provider>
  );
}

export default App;
