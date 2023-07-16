import {
  FetchResult,
  LazyQueryResultTuple,
  MutationTuple,
  SubscriptionResult,
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import { CircularProgress, Divider, SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import {
  GET_CURR_USERS_ON_LOBBY,
  GET_MESSAGES_ON_LOBBY,
  MESSAGE_ADDED_SUBSCRIPTION,
  SEND_MESSAGE,
  USERNAME_CHANGED_SUBSCRIPTION,
  USER_LIST_CHANGED_SUBSCRIPTION,
} from "../../queries/Chatter";
import { VIDEO_STATUS_SUBSCRIPTION } from "../../queries/Video";
import sendMessageReducer from "../Reducers/useMessageReducer";
import MessageBar from "./MessageBar";
import Messages from "./Messages";
import Sender from "./Sender";
import { UsrContxt } from "./UserContextProvider";
import UserList from "./UserList";
import Message from "./interface/Message";
import SendStatus from "./interface/SendStatus";
import User from "./interface/User";
import AddMessageResponse from "./interface/response/AddMessageResponse";
import GenericResponse from "./interface/response/GenericResponse";
import NewMessageSubResponse from "./interface/response/NewMessageSubResponse";
import UsernameChangedSubResponse from "./interface/response/UsernameChangedSubResponse";
import VideoStatusTopicResponse from "./interface/response/VideoStatusTopicResponse";
interface LobbyIdProps {
  lobbyId: string;
}

interface UserIdProps {
  userIdProps: string;
}

interface ChatterProps {
  chatHidden: boolean;
  setChatHidden: Function;
}

function Chatter(props: ChatterProps) {
  const userContext = useContext(UsrContxt);
  const bottomDivRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, dispatchMessage] = useReducer(sendMessageReducer, []);
  const [currentLobbyUsers, setCurrentLobbyUsers] = useState<Array<User>>([]);
  const [lobbyUsersListInitialized, setLobbyUsersListInitialized] =
    useState<boolean>(false);
  const [showLobbyUsers, setShowLobbyUsers] = useState<boolean>(false);
  const theme = useTheme();

  // TODO QUERY RESULT ADD PROPER TYPES
  const [getExistingMsg, getExistingMsgQueryRes]: LazyQueryResultTuple<
    any,
    {
      lobbyId: string;
    }
  > = useLazyQuery(GET_MESSAGES_ON_LOBBY);

  const [getCurrUsers, getCurrUsersRes]: LazyQueryResultTuple<
    {
      getCurrentUsersOnLobby: GenericResponse & {
        data: Array<User>;
      };
    },
    {
      lobbyId: string;
    }
  > = useLazyQuery(GET_CURR_USERS_ON_LOBBY);

  // unless yung state ng message is contained to itself
  const [sendMessage]: MutationTuple<
    { addMessage: AddMessageResponse },
    { addMessageInput: Partial<Message> }
  > = useMutation(SEND_MESSAGE);

  const newMessageSub: SubscriptionResult<
    { messageAdded: NewMessageSubResponse },
    { lobbyId: LobbyIdProps; userId: UserIdProps }
  > = useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    variables: {
      lobbyId: userContext.lobbyId,
      userId: userContext.userId,
    },
  });

  const userListChangedSub: SubscriptionResult<
    {
      userListChanged: GenericResponse & {
        data: Array<User>;
      };
    },
    { lobbyId: string }
  > = useSubscription(USER_LIST_CHANGED_SUBSCRIPTION, {
    variables: {
      lobbyId: userContext.lobbyId,
    },
  });

  const usernameChangedSub: SubscriptionResult<
    {
      usernameChanged: { data: UsernameChangedSubResponse };
    },
    { lobbyId: LobbyIdProps; userId: UserIdProps }
  > = useSubscription(USERNAME_CHANGED_SUBSCRIPTION, {
    variables: {
      lobbyId: userContext.lobbyId,
      userId: userContext.userId,
    },
  });

  const videoChanges: SubscriptionResult<
    { videoStatusChanged: VideoStatusTopicResponse },
    { lobbyId: LobbyIdProps; userId: UserIdProps }
  > = useSubscription(VIDEO_STATUS_SUBSCRIPTION, {
    variables: {
      lobbyId: userContext.lobbyId,
      userId: userContext.userId,
    },
  });

  const sendMessageQuery = async (message: Message) => {
    // used asycn calls here because useEffect of send message is bugging on consecutive api calls
    let res: FetchResult<{ addMessage: AddMessageResponse }> =
      await sendMessage({
        variables: {
          addMessageInput: {
            to: message.to,
            from: message.sender,
            message: message.message,
            localDateSent: message.localDateSent,
          },
        },
      });
    if (res.data) {
      let { message: messageRes, localDateSent } = res.data.addMessage;
      dispatchMessage({
        type: SendStatus.SENT,
        payload: {
          ...messageRes,
          localDateSent: localDateSent,
          sender: userContext.userId,
        },
      });
    } else {
      dispatchMessage({
        type: SendStatus.FAILED,
        payload: {
          ...message,
          localDateSent: message.localDateSent ?? "",
          sender: userContext.userId,
        },
      });
    }
  };

  const handleSendMessage = (messageStr: string) => {
    const message: Message = {
      message: messageStr,
      sender: userContext.userId,
      senderUsername: userContext.username,
      to: userContext.lobbyId,
      sendStatus: SendStatus.SENDING,
      localDateSent: new Date().getTime() + "",
      sendType: 1,
    };

    sendMessageQuery(message);
    dispatchMessage({
      type: SendStatus.SENDING,
      payload: message,
    });
  };

  useEffect(() => {
    if (!props.chatHidden) {
      setTimeout(() => {
        bottomDivRef?.current?.scrollIntoView();
      }, 750);
    }
  }, [props.chatHidden]);

  useEffect(() => {
    if (props.chatHidden) return;
    bottomDivRef?.current?.scrollIntoView();
    // eslint-disable-next-line
  }, [messages, showLobbyUsers]); // have to disable next line because i don't want to call this useEffect when chatHidden hcanges

  useEffect(() => {
    if (userContext.lobbyId) {
      setLoading(true);
      getCurrUsers({
        variables: { lobbyId: userContext.lobbyId },
      });
      getExistingMsg({
        variables: { lobbyId: userContext.lobbyId },
      });
    }
  }, [userContext.lobbyId, getCurrUsers, getExistingMsg]);

  useEffect(() => {
    if (getExistingMsgQueryRes.data?.getMessagesOnLobby?.success) {
      dispatchMessage({
        type: "FETCH_ALL",
        payload: getExistingMsgQueryRes.data.getMessagesOnLobby.data,
      });
      setLoading(false);
    }
  }, [getExistingMsgQueryRes.data]);

  useEffect(() => {
    if (newMessageSub?.data?.messageAdded)
      dispatchMessage({
        type: "NEW_MESSAGE",
        payload: newMessageSub.data.messageAdded.messages.map((value: any) => ({
          ...value,
          sender: value.from.id,
          senderUsername: value.from.username,
          date: new Date(String(value.date)),
          sendType: 1,
        })),
      });
  }, [newMessageSub]);

  useEffect(() => {
    if (userListChangedSub.data?.userListChanged && lobbyUsersListInitialized) {
      let { data } = userListChangedSub.data.userListChanged;

      let newUser = data.filter(
        (lobbyUser) =>
          !currentLobbyUsers.some(
            (cLobbyUser) => lobbyUser.id === cLobbyUser.id
          )
      );
      let userLeft = currentLobbyUsers.filter(
        (cLobbyUser) => !data.some((dataUser) => dataUser.id === cLobbyUser.id)
      );

      if (newUser[0] && newUser[0].username !== userContext.username) {
        dispatchMessageEnteredLobby(newUser[0].username);
      } else if (userLeft[0] && userLeft[0].username !== userContext.username) {
        dispatchMessageLeftLobby(userLeft[0].username);
      }

      setCurrentLobbyUsers(data);
    }
  }, [
    userListChangedSub,
    currentLobbyUsers,
    userContext.username,
    lobbyUsersListInitialized,
  ]);

  useEffect(() => {
    if (getCurrUsersRes.data?.getCurrentUsersOnLobby?.data) {
      setLobbyUsersListInitialized(true);
      setCurrentLobbyUsers(getCurrUsersRes.data.getCurrentUsersOnLobby.data);
    }
  }, [getCurrUsersRes.data]);

  useEffect(() => {
    if (videoChanges.data?.videoStatusChanged) {
      let { changedBy, status, url } =
        videoChanges.data?.videoStatusChanged.data;
      let lobbyMessage = "";
      if (url) {
        lobbyMessage = `${changedBy} has changed the video`;
      }
      if (status === 1) {
        lobbyMessage = `${changedBy} has played the video`;
      }
      if (status === 2) {
        lobbyMessage = `${changedBy} has paused the video`;
      }
      if (status === 3) {
        lobbyMessage = `${changedBy} is buffering...`;
      }
      dispatchMessage({
        type: "LOBBY_MESSAGE",
        payload: { message: lobbyMessage },
      });
    }
  }, [videoChanges]);

  const dispatchMessageEnteredLobby = (user: string): void => {
    dispatchMessage({
      type: "LOBBY_MESSAGE",
      payload: {
        message: `${user} has entered the lobby.`,
      },
    });
  };

  const dispatchMessageLeftLobby = (user: string): void => {
    dispatchMessage({
      type: "LOBBY_MESSAGE",
      payload: {
        message: `${user} has left the lobby.`,
      },
    });
  };

  useEffect(() => {
    if (usernameChangedSub?.data?.usernameChanged) {
      const { id, username } = usernameChangedSub.data?.usernameChanged.data;
      dispatchMessage({
        type: "USERNAME_CHANGED",
        payload: { id, username },
      });
    }
  }, [usernameChangedSub?.data]);

  const chatterContainer: SxProps = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    bgcolor: theme.chat.bgColor,
    minWidth: "inherit",
  };

  return (
    <Box sx={chatterContainer}>
      <MessageBar
        {...props}
        setShowLobbyUsers={setShowLobbyUsers}
        showLobbyUsers={showLobbyUsers}
      />
      {loading ? (
        <>
          <CircularProgress sx={{ margin: "auto" }} />
        </>
      ) : (
        <>
          {showLobbyUsers ? (
            <UserList users={currentLobbyUsers} />
          ) : (
            <Messages messages={messages}>
              <div ref={bottomDivRef} />
            </Messages>
          )}
          <Divider></Divider>
          <Sender handleSendMessage={handleSendMessage}></Sender>
        </>
      )}
    </Box>
  );
}

export default Chatter;
