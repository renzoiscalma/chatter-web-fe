import SendStatus from "./SendStatus";

export default interface Message {
  message: string;
  sender: string;
  senderUsername?: string;
  to: string;
  date?: Date;
  imgUrl?: string;
  sendStatus?: SendStatus;
  localDateSent?: string;
  sendType?: number;
}
