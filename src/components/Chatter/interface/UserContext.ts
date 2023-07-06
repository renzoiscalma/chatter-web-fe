interface UserContext {
  username: string;
  userId: string;
  lobbyId: string;
  darkMode: boolean;
  videoUrl: string;
  setVideoUrl(videUrl: string): void;
  setUsername(username: string): void;
  setLobbyId(lobbyId: string): void;
  setUserId(userId: string): void;
  darkModeToggle(): void;
}
export default UserContext;
