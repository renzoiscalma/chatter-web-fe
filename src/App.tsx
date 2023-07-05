import {
  LazyQueryResultTuple,
  MutationTuple,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { ThemeProvider } from "@mui/material/styles";
import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useSearchParams } from "react-router-dom";
import { UsrContxt } from "./components/Chatter/UserContextProvider";
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

function App(): JSX.Element {
  const userContext = useContext(UsrContxt);
  const [userCookie, setUserCookie] = useCookies(["user-cookie"]);
  const [searchParams] = useSearchParams();

  // TODO ADD PROPER TYPES
  const [newUserMutation, newUserMutationRes]: MutationTuple<
    { addNewUser: AddNewUserResponse },
    null
  > = useMutation(ADD_NEW_USER);

  // TODO interface for params
  const [addUserToLobbyMutation]: MutationTuple<
    { addUserToLobby: GenericResponse },
    { lobbyId: string; userId: string }
  > = useMutation(ADD_USER_TO_LOBBY);

  // TODO interface for params
  const [removeUserToLobbyMutation]: MutationTuple<
    { removeUserToLobby: GenericResponse },
    { lobbyId: string; userId: string }
  > = useMutation(REMOVE_USER_TO_LOBBY);

  const [isLobbyExisting, isLobbyExistingRes]: LazyQueryResultTuple<
    { isLobbyExisting: IsLobbyExistingResponse },
    IsLobbyExistingRequest
  > = useLazyQuery(IS_LOBBY_EXISTING);

  const [videoUrlMutation]: MutationTuple<
    { updateVideoStatus: GenericResponse },
    { statusInput: UpdateVideoStatusRequest }
  > = useMutation(UPDATE_VIDEO);

  const handleBeforeUnload = (lobbyId: string, userId: string): void => {
    removeUserToLobbyMutation({
      variables: {
        lobbyId,
        userId,
      },
    });
  };

  useEffect(() => {
    const { userId, username } = userCookie["user-cookie"];
    if (!userId || !username) {
      newUserMutation();
    } else {
      if (userContext.username !== username) userContext.setUsername(username);
      if (userContext.userId !== userId) userContext.setUserId(userId);
    }
  }, [userCookie, userContext, newUserMutation]);

  useEffect(() => {
    const lobbyId = searchParams.get("lobbyId") || "";
    if (lobbyId) {
      isLobbyExisting({
        variables: {
          lobbyId: lobbyId,
        },
      });
    } else {
      userContext.setLobbyId(NONE_LOBBY_ID); // needed to control initial createlobbymodal to pop up
    }
  }, [searchParams]);

  useEffect(() => {
    if (userContext.lobbyId && userContext.lobbyId !== NONE_LOBBY_ID)
      videoUrlMutation({
        variables: {
          statusInput: {
            url: userContext.videoUrl,
            lobbyId: userContext.lobbyId,
            userId: userContext.userId,
            currTime: 0,
            status: -1,
          },
        },
      });
  }, [userContext.videoUrl]);

  useEffect(() => {
    if (newUserMutationRes.data) {
      let { code, success, user } = newUserMutationRes.data.addNewUser;
      if (code === 200 && success) {
        let currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        userContext.setUsername(user.username);
        userContext.setUserId(user.id);
        setUserCookie(
          "user-cookie",
          { userId: user.id, username: user.username },
          {
            path: "/",
            expires: currentDate,
          }
        );
      }
    }
  }, [newUserMutationRes.data]);

  useEffect(() => {
    if (
      userContext.userId &&
      isLobbyExistingRes.data &&
      isLobbyExistingRes.data.isLobbyExisting.isExisting
    ) {
      const { lobbyId } = isLobbyExistingRes.data.isLobbyExisting;

      if (lobbyId !== userContext.lobbyId) userContext.setLobbyId(lobbyId);

      addUserToLobbyMutation({
        variables: {
          lobbyId: lobbyId,
          userId: userContext.userId,
        },
      });

      window.addEventListener("beforeunload", () =>
        handleBeforeUnload(lobbyId, userContext.userId)
      );
      return () =>
        window.removeEventListener("beforeunload", () =>
          handleBeforeUnload(lobbyId, userContext.userId)
        );
    }
  }, [isLobbyExistingRes, userContext.lobbyId, userContext.userId]);

  return (
    <ThemeProvider theme={userContext.darkMode ? darkTheme : lightTheme}>
      <div className="App">
        <Layout />
      </div>
    </ThemeProvider>
  );
}

export default App;
