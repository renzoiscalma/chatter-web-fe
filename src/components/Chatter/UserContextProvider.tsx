import { createContext, useState } from "react";
import { useCookies } from "react-cookie";
import UserContext from "./interface/UserContext";

export const UsrContxt = createContext<UserContext>({
  username: "",
  userId: "",
  lobbyId: "",
  videoUrl: "",
  darkMode: true,
  setUsername: () => {},
  setLobbyId: () => {},
  darkModeToggle: () => {},
  setVideoUrl: () => {},
  setUserId: () => {},
});

export default function UserContextProvider({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [lobbyId, setLobbyId] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [userCookie, setUserCookie] = useCookies(["user-cookie"]);

  const handleSetVideoUrl = (videoUrl: string) => {
    setVideoUrl(videoUrl);
  };

  const handleSetLobbyId = (lobbyId: string) => {
    setLobbyId(lobbyId);
  };

  const handleSetUserId = (userId: string) => {
    setUserId(userId);
    setUserCookie(
      "user-cookie",
      { ...userCookie["user-cookie"], userId },
      {
        path: "/",
        expires: new Date("11-10-2023"),
      }
    );
  };

  const handleSetUsername = (username: string) => {
    setUsername(username);
    setUserCookie(
      "user-cookie",
      { ...userCookie["user-cookie"], username },
      {
        path: "/",
        expires: new Date("11-10-2023"),
      }
    );
  };

  const handleDarkModeToggle = () => {
    setDarkMode((val) => !val);
  };

  return (
    <UsrContxt.Provider
      value={{
        username,
        setUsername: handleSetUsername,
        userId,
        lobbyId,
        darkMode,
        videoUrl,
        setVideoUrl: handleSetVideoUrl,
        darkModeToggle: handleDarkModeToggle,
        setLobbyId: handleSetLobbyId,
        setUserId: handleSetUserId,
      }}
    >
      {children}
    </UsrContxt.Provider>
  );
}
