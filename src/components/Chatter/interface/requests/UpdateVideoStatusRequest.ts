interface UpdateVideoStatusRequest {
  lobbyId?: string;
  userId?: string;
  status?: number;
  currTime?: number;
  url?: string;
}

export default UpdateVideoStatusRequest;
