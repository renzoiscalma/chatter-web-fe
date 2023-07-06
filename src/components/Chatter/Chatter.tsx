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
import MessageBar from "./MessageBar";
import Messages from "./Messages";
import Sender from "./Sender";
import { UsrContxt } from "./UserContextProvider";
import UserList from "./UserList";
import Message from "./interface/Message";
import SendStatus from "./interface/SendStatus";
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

type MESSAGEACTIONTYPE =
  | { type: "FETCH_ALL"; payload: any } // todo change proper types
  | { type: SendStatus.FAILED; payload: Message & { localDateSent: string } }
  | {
      type: SendStatus.SENDING;
      payload: Message & { index: number; callback: Function };
    }
  | { type: SendStatus.SENT; payload: Message & { localDateSent: string } }
  | { type: "NEW_MESSAGE"; payload: Message[] }
  | {
      type: "USERNAME_CHANGED";
      payload: { username: string; id: string };
    };

function sendMessageReducer(
  state: Message[],
  action: MESSAGEACTIONTYPE
): Message[] {
  let messages = state;
  switch (action.type) {
    case "FETCH_ALL":
      return action.payload.map((message: any): Message => {
        return {
          date: new Date(+message.date),
          message: message.message,
          sender: message.from.id,
          senderUsername: message.from.username,
          to: "Lobby",
          sendStatus: SendStatus.SENT,
          sendType: 1,
        };
      });
    case SendStatus.SENDING: {
      let { to, sender, message, localDateSent, callback } = action.payload;
      messages.push(action.payload);
      callback({
        to,
        from: sender,
        message,
        localDateSent,
      });
      return [...messages];
    }
    case SendStatus.FAILED:
    case SendStatus.SENT: {
      let { localDateSent, sender } = action.payload;
      messages
        .filter(
          (message) =>
            message.localDateSent === localDateSent && message.sender === sender
        )
        .forEach((message) => (message.sendStatus = action.type));
      return [...messages];
    }
    case "NEW_MESSAGE": {
      // todo sort
      return [...messages, ...action.payload];
    }
    case "USERNAME_CHANGED": {
      return messages.map((message: Message) => {
        if (message.sender === action.payload.id)
          return {
            ...message,
            senderUsername: action.payload.username,
          };
        return message;
      });
    }
    default:
      throw new Error();
  }
}

function Chatter(props: ChatterProps) {
  const userContext = useContext(UsrContxt);
  const bottomDivRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const theme = useTheme();
  // TODO QUERY RESULT ADD PROPER TYPES
  const [getExistingMsg, getExistingMsgQueryRes]: LazyQueryResultTuple<
    any,
    {
      lobbyId: string;
    }
  > = useLazyQuery(GET_MESSAGES_ON_LOBBY);

  const [getCurrUsers]: LazyQueryResultTuple<
    {
      getCurrentUsersOnLobby: GenericResponse & {
        data: Array<{ username: string; id: string }>;
      };
    },
    {
      lobbyId: string;
    }
  > = useLazyQuery(GET_CURR_USERS_ON_LOBBY);

  // unless yung state ng message is contained to itself
  const [sendMessage]: MutationTuple<
    { addMessage: AddMessageResponse },
    { addMessageInput: Message }
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
        data: Array<{ username: string; id: string }>;
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

  const chatterContainer: SxProps = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    bgcolor: theme.chat.bgColor,
    minWidth: "inherit",
  };

  let initialMessages: Message[] = [] as Message[];

  const [messages, dispatchMessage] = useReducer(
    sendMessageReducer,
    initialMessages
  );

  const [initializedLobbyList, setInitializedLobbyList] =
    useState<boolean>(false);
  const [showLobbyUsers, setShowLobbyUsers] = useState<boolean>(false);
  const [currentLobbyUsers, setCurrentLobbyUsers] = useState<
    Array<{ username: string; id: string }>
  >([]);

  const messageSendingCallback = async (message: Message) => {
    let res: FetchResult<{ addMessage: AddMessageResponse }> =
      await sendMessage({
        variables: {
          addMessageInput: message,
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

  const handleSendMessage = (message: string) => {
    const messageStatusIndex: number = messages.length;

    dispatchMessage({
      type: SendStatus.SENDING,
      payload: {
        message: message,
        sender: userContext.userId,
        senderUsername: userContext.username,
        to: userContext.lobbyId,
        sendStatus: SendStatus.SENDING,
        index: messageStatusIndex,
        localDateSent: new Date().getTime() + "",
        callback: messageSendingCallback,
        sendType: 1,
      },
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
    if (userContext.lobbyId && userContext.lobbyId !== "NONE") {
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
  }, [getExistingMsgQueryRes.data?.getMessagesOnLobby?.success]);

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
    if (userListChangedSub.data?.userListChanged) {
      let { data } = userListChangedSub.data.userListChanged;

      if (!initializedLobbyList) {
        setInitializedLobbyList(true);
        setCurrentLobbyUsers(data);
        return;
      }

      let newUser = data.filter(
        (lobbyUser) =>
          !currentLobbyUsers.some(
            (cLobbyUser) => lobbyUser.id === cLobbyUser.id
          )
      );
      let userLeft = currentLobbyUsers.filter(
        (cLobbyUser) => !data.some((dataUser) => dataUser.id === cLobbyUser.id)
      );

      setCurrentLobbyUsers(data);

      if (newUser[0] && newUser[0].username !== userContext.username) {
        dispatchMessageEnteredLobby(newUser[0].username);
      } else if (userLeft[0] && userLeft[0].username !== userContext.username) {
        dispatchMessageLeftLobby(userLeft[0].username);
      }
    }
  }, [
    userListChangedSub,
    currentLobbyUsers,
    initializedLobbyList,
    userContext.username,
  ]);

  useEffect(() => {
    if (videoChanges.data?.videoStatusChanged) {
      let { changedBy, status, url } =
        videoChanges.data?.videoStatusChanged.data;
      let payload = {
        message: "",
        sender: "Admin",
        to: "Everyone",
        sendType: -1,
        localDateSent: new Date().getTime() + "",
      };
      if (url) {
        payload.message = `${changedBy} has changed the video`;
      }
      if (status === 1) {
        payload.message = `${changedBy} has played the video`;
      }
      if (status === 2) {
        payload.message = `${changedBy} has paused the video`;
      }
      if (status === 3) {
        payload.message = `${changedBy} is buffering...`;
      }
      dispatchMessage({
        type: "NEW_MESSAGE",
        payload: [payload],
      });
    }
  }, [videoChanges]);

  const dispatchMessageEnteredLobby = (user: string): void => {
    dispatchMessage({
      type: "NEW_MESSAGE",
      payload: [
        {
          message: `${user} has entered the lobby.`,
          sender: "Admin",
          to: "Everyone",
          sendType: -1,
          localDateSent: new Date().getTime() + "",
        },
      ],
    });
  };

  const dispatchMessageLeftLobby = (user: string): void => {
    dispatchMessage({
      type: "NEW_MESSAGE",
      payload: [
        {
          message: `${user} has left the lobby.`,
          sender: "Admin",
          to: "Everyone",
          sendType: -1,
          localDateSent: new Date().getTime() + "",
        },
      ],
    });
  };

  useEffect(() => {
    console.log("fired");
    if (usernameChangedSub?.data?.usernameChanged) {
      const { id, username } = usernameChangedSub.data?.usernameChanged.data;
      dispatchMessage({
        type: "USERNAME_CHANGED",
        payload: { id, username },
      });
    }
  }, [usernameChangedSub?.data]);

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
