import {
  LazyQueryResultTuple,
  MutationTuple,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { useCallback, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { UsrContxt } from "./components/Chatter/UserContextProvider";
import IsLobbyExistingRequest from "./components/Chatter/interface/requests/IsLobbyExistingRequest";
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

function App(): JSX.Element {
  const userContext = useContext(UsrContxt);
  const [validatedLobby, setValidatedLobby] = useState<boolean>(false);
  const [userCookie, setUserCookie] = useCookies(["user-cookie"]);
  const searchParams = useParams();
  const navigate = useNavigate();

  const [newUserMutation, newUserMutationRes]: MutationTuple<
    { addNewUser: AddNewUserResponse },
    null
  > = useMutation(ADD_NEW_USER);

  const [addUserToLobbyMutation]: MutationTuple<
    { addUserToLobby: GenericResponse },
    { lobbyId: string; userId: string }
  > = useMutation(ADD_USER_TO_LOBBY);

  const [removeUserToLobbyMutation]: MutationTuple<
    { removeUserToLobby: GenericResponse },
    { lobbyId: string; userId: string }
  > = useMutation(REMOVE_USER_TO_LOBBY);

  const [isLobbyExisting, isLobbyExistingRes]: LazyQueryResultTuple<
    { isLobbyExisting: IsLobbyExistingResponse },
    IsLobbyExistingRequest
  > = useLazyQuery(IS_LOBBY_EXISTING);

  const handleBeforeUnload = useCallback(
    (lobbyId: string, userId: string): void => {
      removeUserToLobbyMutation({
        variables: {
          lobbyId,
          userId,
        },
      });
    },
    [removeUserToLobbyMutation]
  );

  useEffect(() => {
    const { userId, username } = userCookie["user-cookie"] || {};
    if (userContext.username === username && userContext.userId === userId)
      return;
    if (!userId || !username) {
      newUserMutation();
    } else {
      userContext.setUsername(username);
      userContext.setUserId(userId);
    }
  }, [userCookie, userContext, newUserMutation]);

  useEffect(() => {
    const lobbyId = searchParams.id;
    if (lobbyId) {
      isLobbyExisting({
        variables: {
          lobbyId: lobbyId,
        },
      });
    } else {
      navigate("/");
    }
  }, [searchParams, isLobbyExisting, navigate]);

  useEffect(() => {
    if (newUserMutationRes.data) {
      let { code, success, user } = newUserMutationRes.data.addNewUser;
      if (code === 200 && success) {
        newUserMutationRes.reset();
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
  }, [newUserMutationRes, setUserCookie, userContext]);

  useEffect(() => {
    if (userContext.userId && isLobbyExistingRes.data && !validatedLobby) {
      if (!isLobbyExistingRes.data.isLobbyExisting.isExisting) {
        navigate("/");
      }

      const { lobbyId } = isLobbyExistingRes.data.isLobbyExisting;

      userContext.setLobbyId(lobbyId);

      setValidatedLobby(true);

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
    } else if (isLobbyExistingRes.error) {
      navigate("/");
    }
  }, [
    addUserToLobbyMutation,
    handleBeforeUnload,
    isLobbyExistingRes,
    userContext,
    navigate,
    validatedLobby,
  ]);

  return <Layout></Layout>;
}

export default App;
