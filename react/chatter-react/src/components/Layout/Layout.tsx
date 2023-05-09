import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";
import { SetStateAction, useEffect, useState } from "react";
import Chatter from "../Chatter/Chatter";
import Video from "../Video/Video";
import Navbar from "./Navbar";

function Layout(): JSX.Element {
  const [chatHidden, setChatHidden] = useState<boolean>(false);
  const [videoContainer, setVideoContainer] =
    useState<SxProps>(videoContainerSx);
  const [chatContainer, setChatContainer] = useState<SxProps>(chatContainerSx);

  useEffect(() => {
    setVideoContainer((prev: SetStateAction<SxProps<{}>>) => {
      let style: SxProps = {
        ...prev,
        width: chatHidden ? "100vw" : "70vw",
      };
      return style;
    });
  }, [chatHidden]);

  return (
    <>
      <Box sx={navBarConatiner}>
        <Navbar></Navbar>
      </Box>
      <Box sx={gridContainerSx}>
        <Box sx={videoContainer}>
          <Video></Video>
        </Box>
        <Box sx={chatContainer}>
          <Chatter
            chatHidden={chatHidden}
            setChatHidden={setChatHidden}
          ></Chatter>
        </Box>
      </Box>
    </>
  );
}

const gridContainerSx: SxProps = {
  display: "inline-grid",
  columnGap: 0,
  gridTemplateAreas: `
		"video video video chat"
		"video video video chat"
		"video video video chat"
	`,
  overflow: "hidden",
  maxWidth: "100vw",
  transition: "all 0.5s ease-in-out",
};

const navBarConatiner: SxProps = {
  gridArea: "navbar",
};

const chatContainerSx: SxProps = {
  gridArea: "chat",
  position: "relative",
  height: "calc(100vh - 64px)", // -64 pixels because of the height of nav bar
  width: "30vw",
  transition: "all 0.5s ease-in-out",
};

const videoContainerSx: SxProps = {
  gridArea: "video",
  width: "70vw",
  transition: "all 0.5s ease-in-out",
};

export default Layout;
