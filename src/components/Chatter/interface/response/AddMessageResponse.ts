import Message from "../Message";

interface AddMessageResponse {
  code: number;
  localDateSent: string;
  message: Message;
  success: boolean;
}

export default AddMessageResponse;
