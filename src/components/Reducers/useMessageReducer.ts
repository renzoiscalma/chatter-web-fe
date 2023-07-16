import Message from "../Chatter/interface/Message";
import SendStatus from "../Chatter/interface/SendStatus";
import User from "../Chatter/interface/User";

export type MessageActionType =
  | { type: "FETCH_ALL"; payload: Message[] }
  | { type: SendStatus.FAILED; payload: Message & { localDateSent: string } }
  | {
      type: SendStatus.SENDING;
      payload: Message;
    }
  | { type: SendStatus.SENT; payload: Message & { localDateSent: string } }
  | { type: "NEW_MESSAGE"; payload: Message[] }
  | {
      type: "USERNAME_CHANGED";
      payload: User;
    }
  | {
      type: "LOBBY_MESSAGE";
      payload: { message: string };
    };

export default function sendMessageReducer(
  state: Message[],
  action: MessageActionType
) {
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
      messages.push(action.payload);
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
    case "LOBBY_MESSAGE": {
      const adminMessage = {
        message: action.payload.message,
        sender: "Admin",
        to: "Everyone",
        sendType: -1,
        localDateSent: new Date().getTime() + "",
      };
      return [...messages, adminMessage];
    }
    default:
      throw new Error();
  }
}
