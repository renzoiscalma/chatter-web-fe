import GenericResponse from "./GenericResponse";

interface IsLobbyExistingResponse extends GenericResponse {
  isExisting: boolean;
  lobbyId: string;
}

export default IsLobbyExistingResponse;
