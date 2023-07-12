import { createContext, useCallback, useMemo, useState } from "react";
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

// use useMemo and usecallback to not rerender when calling functions of this context
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

  const handleSetVideoUrl = useCallback((videoUrl: string) => {
    setVideoUrl(videoUrl);
  }, []);

  const handleSetLobbyId = useCallback((lobbyId: string) => {
    setLobbyId(lobbyId);
  }, []);

  const handleSetUserId = useCallback(
    (userId: string) => {
      setUserId(userId);
      setUserCookie(
        "user-cookie",
        { ...userCookie["user-cookie"], userId },
        {
          path: "/",
          expires: new Date("11-10-2023"),
        }
      );
    },
    [userCookie, setUserCookie]
  );

  const handleSetUsername = useCallback(
    (username: string) => {
      setUsername(username);
      setUserCookie(
        "user-cookie",
        { ...userCookie["user-cookie"], username },
        {
          path: "/",
          expires: new Date("11-10-2023"),
        }
      );
    },
    [userCookie, setUserCookie]
  );

  const handleDarkModeToggle = useCallback(() => {
    setDarkMode((val) => !val);
  }, []);

  const values = useMemo(
    () => ({
      username,
      userId,
      lobbyId,
      darkMode,
      videoUrl,
      setUsername: handleSetUsername,
      setVideoUrl: handleSetVideoUrl,
      darkModeToggle: handleDarkModeToggle,
      setLobbyId: handleSetLobbyId,
      setUserId: handleSetUserId,
    }),
    [
      username,
      userId,
      lobbyId,
      darkMode,
      videoUrl,
      handleSetUsername,
      handleSetVideoUrl,
      handleDarkModeToggle,
      handleSetLobbyId,
      handleSetUserId,
    ]
  );

  return <UsrContxt.Provider value={values}>{children}</UsrContxt.Provider>;
}
