import {
  LazyQueryResultTuple,
  MutationTuple,
  SubscriptionResult,
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";
import { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";

import {
  GET_VIDEO_STATUS,
  UPDATE_VIDEO,
  VIDEO_STATUS_SUBSCRIPTION,
} from "../../queries/Video";
import { useContainerDimension } from "../../util/ResizeUtil";
import UpdateVideoStatusRequest from "../Chatter/interface/requests/UpdateVideoStatusRequest";
import GenericResponse from "../Chatter/interface/response/GenericResponse";
import VideoStatusTopicResponse from "../Chatter/interface/response/VideoStatusTopicResponse";
import { UsrContxt } from "../Chatter/UserContextProvider";

interface LobbyIdProps {
  lobbyId: string;
}
interface UserIdProps {
  userIdProps: string;
}

enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  VIDEO_CUED = 5,
}

const defaultPlayerProps: ReactPlayerProps = {
  playing: true,
  controls: true,
  // muted: true,
  playbackRate: 1.0,
  loop: false,
  playsinline: true,
};

function Video(): JSX.Element {
  const userContext = useContext(UsrContxt);
  const [playerProps, setPlayerProps] =
    useState<ReactPlayerProps>(defaultPlayerProps);
  const [updateFromBE, setUpdateFromBE] = useState<boolean>(false);
  const videoContainer = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const videoSize = useContainerDimension(videoContainer);

  // needed to track the correct state on callbacks
  // SOURCE: https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
  const updateFromBERef = useRef<boolean>();
  updateFromBERef.current = updateFromBE;

  const videoChanges: SubscriptionResult<
    { videoStatusChanged: VideoStatusTopicResponse },
    { lobbyId: LobbyIdProps; userId: UserIdProps }
  > = useSubscription(VIDEO_STATUS_SUBSCRIPTION, {
    variables: {
      lobbyId: userContext.lobbyId,
      userId: userContext.userId,
    },
  });

  const [updateVideo, updateVideoProperties]: MutationTuple<
    { updateVideoStatus: GenericResponse },
    { statusInput: UpdateVideoStatusRequest }
  > = useMutation(UPDATE_VIDEO);

  const [videoStatus, videoStatusQueryRes]: LazyQueryResultTuple<
    { getVideoStatusOnLobby: VideoStatusTopicResponse },
    { lobbyId: string }
  > = useLazyQuery(GET_VIDEO_STATUS);

  const videoContainerStyle: SxProps = {
    display: "flex",
    bgcolor: "#000",
    width: "inherit",
    height: "100%", // -64px because of top nav bar
    "> div": {
      paddingTop: "30px",
      paddingBottom: "30px",
    },
  };

  const onPlayHandler = (): void => {
    const { lobbyId, userId } = userContext;
    if (!playerRef.current) return;
    setPlayerProps((values) => ({
      ...values,
      playing: true,
    }));
    console.log(updateFromBERef.current, "play");
    if (!updateFromBERef.current) {
      updateVideo({
        variables: {
          statusInput: {
            currTime: +playerRef.current.getCurrentTime().toFixed(0),
            lobbyId,
            userId,
            status: PlayerState.PLAYING,
          },
        },
      });
    }
    setUpdateFromBE(false);
  };

  const onBufferHandler = (): void => {
    console.log("bufferING");
    setUpdateFromBE(true);
  };

  const onBufferEmdHandler = (): void => {
    console.log("bufferED");
  };

  const onPauseHandler = (param: any): void => {
    console.log("pausing", param);
    const { lobbyId, userId } = userContext;
    if (!playerRef.current) return;
    setPlayerProps((values) => ({
      ...values,
      playing: false,
    }));
    console.log(updateFromBERef.current, "pause");

    if (!updateFromBERef.current) {
      updateVideo({
        variables: {
          statusInput: {
            currTime: +playerRef.current.getCurrentTime().toFixed(0),
            lobbyId,
            userId,
            status: PlayerState.PAUSED,
          },
        },
      });
    }
    setUpdateFromBE(false);
  };

  const getPlayerState = (eventData: number): PlayerState => {
    switch (eventData) {
      case 0:
        return PlayerState.ENDED;
      case 1:
        return PlayerState.PLAYING;
      case 2:
        return PlayerState.PAUSED;
      case 3:
        return PlayerState.BUFFERING;
      case 5:
        return PlayerState.VIDEO_CUED;
      default:
        return PlayerState.UNSTARTED;
    }
  };

  useEffect(() => {
    if (videoChanges?.data?.videoStatusChanged) {
      setUpdateFromBE(true);
      const { currTime, status, url } =
        videoChanges.data.videoStatusChanged.data;
      if (url) {
        setPlayerProps((values) => ({
          ...values,
          url,
        }));
        userContext.setVideoUrl(url);
      }

      if (
        currTime > 0 &&
        playerRef.current &&
        currTime - +playerRef.current.getCurrentTime().toFixed(0) !== 0 // do seek when player difference from BE is not 0
      ) {
        playerRef.current?.seekTo(currTime);
      }

      switch (getPlayerState(status)) {
        case PlayerState.PLAYING:
          console.log("played by someone");

          setPlayerProps((values) => ({
            ...values,
            playing: true,
          }));
          break;
        case PlayerState.PAUSED:
          console.log("paused by someone");

          setPlayerProps((values) => ({
            ...values,
            playing: false,
          }));
          break;
        default:
          break;
      }
    }
  }, [videoChanges.data]);

  useEffect(() => {
    if (videoStatusQueryRes.data) {
      const { currTime, url, status } =
        videoStatusQueryRes.data.getVideoStatusOnLobby.data;

      if (currTime > 0) {
        playerRef.current?.seekTo(currTime);
      }
      if (url) {
        setPlayerProps((val) => ({
          ...val,
          url: url,
          playing: status === 1,
          played: 0,
          loaded: 0,
          pip: false,
          loop: false,
        }));
        userContext.setVideoUrl(url);
      }
      setUpdateFromBE(true);
    }
  }, [videoStatusQueryRes.data]);

  useEffect(() => {
    if (userContext.videoUrl || playerProps.url) {
      setPlayerProps((val) => ({
        ...val,
        onPlay: onPlayHandler,
        onPause: onPauseHandler,
        onBuffer: onBufferHandler,
        onBufferEnd: onBufferEmdHandler,
        url: userContext.videoUrl || playerProps.url,
        width: "100%",
        height: videoSize.height - 60,
      }));
    }
  }, [
    videoSize,
    playerProps.url,
    userContext.videoUrl,
    userContext.lobbyId,
    userContext.userId,
  ]); // add these dependencies so we update handlers when the values change

  useEffect(() => {
    if (userContext.lobbyId && userContext.lobbyId !== "NONE") {
      videoStatus({
        variables: {
          lobbyId: userContext.lobbyId,
        },
      });
    }
  }, [userContext.lobbyId]);

  return (
    <Box sx={videoContainerStyle} ref={videoContainer}>
      <ReactPlayer {...playerProps} ref={playerRef}></ReactPlayer>
    </Box>
  );
}

export default Video;
