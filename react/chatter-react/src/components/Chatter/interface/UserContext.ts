interface UserContext {
  username: string;
  userId: string;
  lobbyId: string;
  darkMode: boolean;
  videoUrl: string;
  setVideo(videUrl: string): void;
  setUsername(username: string): void;
  setLobbyId(lobbyId: string): void;
  darkModeToggle(): void;
}
export default UserContext;
