interface NewMessageSubResponse {
  lobbydId: string;
  messages: {
    date: string;
    from: {
      id: string;
      type: number;
      username: string;
    };
    message: string;
  }[];
}

export default NewMessageSubResponse;
