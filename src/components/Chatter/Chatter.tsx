import {
  QueryResult,
  SubscriptionResult,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { Divider, SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { UsrContxt } from "../../App";
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
import UserList from "./UserList";
import Message from "./interface/Message";
import SendStatus from "./interface/SendStatus";
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
    case SendStatus.FAILED:
      return {} as Message[];
    case SendStatus.SENDING: {
      let { to, sender, message, localDateSent } = action.payload;
      messages.push(action.payload);
      action.payload.callback({
        variables: {
          addMessageInput: {
            to,
            from: sender,
            message,
            localDateSent,
          },
        },
      });
      return [...messages];
    }
    case SendStatus.SENT: {
      let { localDateSent, sender } = action.payload;
      let targetMessage = messages.filter(
        (message) =>
          message.localDateSent === localDateSent && message.sender === sender
      );
      targetMessage[0].sendStatus = SendStatus.SENT;
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
  const theme = useTheme();
  // TODO QUERY RESULT ADD PROPER TYPES
  const existingMessages: QueryResult<any, any> = useQuery(
    GET_MESSAGES_ON_LOBBY,
    { variables: { lobbyId: userContext.lobbyId } }
  );

  const getCurrentUsersOnLobby: QueryResult<
    {
      getCurrentUsersOnLobby: GenericResponse & {
        data: Array<{ username: string; id: string }>;
      };
    },
    {
      lobbyId: string;
    }
  > = useQuery(GET_CURR_USERS_ON_LOBBY, {
    variables: { lobbyId: userContext.lobbyId },
  });

  // unless yung state ng message is contained to itself
  const [sendMessage, sendMessageProperties] = useMutation(SEND_MESSAGE);

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

  const [initializedMessage, setInitializedMessage] = useState<boolean>(false);
  const [initializedLobbyList, setInitializedLobbyList] =
    useState<boolean>(false);
  const [showLobbyUsers, setShowLobbyUsers] = useState<boolean>(false);
  const [currentLobbyUsers, setCurrentLobbyUsers] = useState<
    Array<{ username: string; id: string }>
  >([]);

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
        callback: sendMessage,
        sendType: 1,
      },
    });
  };

  useEffect(() => {
    if (!props.chatHidden && !showLobbyUsers) {
      // wait for the transition to end
      setTimeout(() => {
        bottomDivRef?.current?.scrollIntoView();
      }, 750);
    }
  }, [messages, showLobbyUsers, props.chatHidden]);

  useEffect(() => {
    if (
      !initializedMessage &&
      existingMessages.data?.getMessagesOnLobby?.success
    ) {
      setInitializedMessage(true);
      dispatchMessage({
        type: "FETCH_ALL",
        payload: existingMessages.data.getMessagesOnLobby.data,
      });
    }
  }, [initializedMessage, existingMessages.data]);

  useEffect(() => {
    if (sendMessageProperties?.data) {
      let { message, localDateSent } = sendMessageProperties.data.addMessage;
      dispatchMessage({
        type: SendStatus.SENT,
        payload: { ...message, localDateSent, sender: message.from.id },
      });
    }

    if (sendMessageProperties?.error) {
      console.error("ERROR HAS OCCURED");
    }
  }, [sendMessageProperties.data, sendMessageProperties?.error]);

  useEffect(() => {
    if (getCurrentUsersOnLobby?.data) {
      let { data } = getCurrentUsersOnLobby.data.getCurrentUsersOnLobby;
      setCurrentLobbyUsers(data);
    }
  }, [getCurrentUsersOnLobby.data]);

  useEffect(() => {
    // todo add types
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
          !currentLobbyUsers.some((cLobbyUser) => lobbyUser.id == cLobbyUser.id)
      );
      let userLeft = currentLobbyUsers.filter(
        (cLobbyUser) => !data.some((dataUser) => dataUser.id == cLobbyUser.id)
      );

      setCurrentLobbyUsers(data);

      if (newUser[0] && newUser[0].username !== userContext.username) {
        dispatchMessageEnteredLobby(newUser[0].username);
      } else if (userLeft[0] && userLeft[0].username !== userContext.username) {
        dispatchMessageLeftLobby(userLeft[0].username);
      }
    }
  }, [userListChangedSub]);

  useEffect(() => {
    if (videoChanges.data?.videoStatusChanged) {
      let { changedBy, currTime, status, url } =
        videoChanges.data?.videoStatusChanged.data;
      let payload = {
        message: "",
        sender: "Admin",
        to: "Everyone",
        sendType: -1,
      };
      if (url) {
        payload.message = `${changedBy} has changed the video`;
      }
      if (status == 1) {
        payload.message = `${changedBy} has played the video`;
      }
      if (status == 2) {
        payload.message = `${changedBy} has paused the video`;
      }
      if (status == 3) {
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
        },
      ],
    });
  };

  useEffect(() => {
    if (usernameChangedSub?.data?.usernameChanged) {
      const { id, username } = usernameChangedSub.data?.usernameChanged.data;
      // modify messages to account change of name
      dispatchMessage({
        type: "USERNAME_CHANGED",
        payload: usernameChangedSub.data.usernameChanged.data,
      });
      // modify user with the new username
      setCurrentLobbyUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === id ? { ...user, username: username } : user
        )
      );
    }
  }, [usernameChangedSub.data]);

  return (
    <Box sx={chatterContainer}>
      <MessageBar
        {...props}
        setShowLobbyUsers={setShowLobbyUsers}
        showLobbyUsers={showLobbyUsers}
      />
      {showLobbyUsers ? (
        <UserList users={currentLobbyUsers} />
      ) : (
        <Messages messages={messages}>
          <div ref={bottomDivRef} />
        </Messages>
      )}
      <Divider></Divider>
      <Sender handleSendMessage={handleSendMessage}></Sender>
    </Box>
  );
}

export default Chatter;
