import Message from "./interface/Message";
import SendStatus from "./interface/SendStatus";

let samepleData: Message[] = [
  {
    message: "Hello",
    sender: "Me",
    to: "World",
    date: new Date(new Date().getTime() + 1),
    imgUrl: "",
    sendStatus: SendStatus.SENT,
  },
  {
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    sender: "World",
    to: "Me",
    date: new Date(new Date().getTime() + 1),
    imgUrl: "",
    sendStatus: SendStatus.SENT,
  },
  {
    message: "World",
    sender: "World",
    to: "Me",
    date: new Date(new Date().getTime() + 2),
    imgUrl: "",
    sendStatus: SendStatus.SENT,
  },
  {
    message: "Hello HelloHelloHelloHelloHelloHello Hello Hello Hello Hello",
    sender: "Me",
    to: "World",
    date: new Date(new Date().getTime() + 3),
    imgUrl: "",
    sendStatus: SendStatus.SENT,
  },
  {
    message:
      "World WorldWorldWorldWorldWorldWorldWorld World World WorldWorldWorld",
    sender: "Me",
    to: "World",
    date: new Date(new Date().getTime() + 4),
    imgUrl: "",
    sendStatus: SendStatus.SENT,
  },
  {
    message:
      "World WorldWorldWorldWorldWorldWorldWorld World World WorldWorldWorld",
    sender: "Me",
    to: "World",
    date: new Date(new Date().getTime() + 4),
    imgUrl: "",
    sendStatus: SendStatus.SENDING,
  },
  {
    message:
      "World WorldWorldWorldWorldWorldWorldWorld World World WorldWorldWorld",
    sender: "Me",
    to: "World",
    date: new Date(new Date().getTime() + 4),
    imgUrl: "",
    sendStatus: SendStatus.FAILED,
  },
];

export default samepleData;
