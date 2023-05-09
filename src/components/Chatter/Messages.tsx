import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckIcon from "@mui/icons-material/Check";
import PriorityHigh from "@mui/icons-material/PriorityHigh";
import { Box, Paper, SxProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { StrictMode, useContext } from "react";
import { UsrContxt } from "../../App";
import Message from "./interface/Message";
import SendStatus from "./interface/SendStatus";

interface MessageProps {
  messages: Message[];
  children?: React.ReactNode;
}

function Messages({ messages, children }: MessageProps): JSX.Element {
  const theme = useTheme();

  const messagesContainer: SxProps = {
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
    height: "100%",
  };

  const messageBubbleStyle: SxProps = {
    textAlign: "initial",
    borderRadius: "1.15rem",
    lineHeight: 1.25,
    maxWidth: "75%",
    padding: "0.5rem .875rem",
    position: "relative",
    wordWrap: "break-word",
    marginTop: "2.5px",
    marginBottom: "2.5px",
    display: "inline-flex",
    wordBreak: "break-word",
  };

  const commonTailStyle: SxProps = {
    bottom: "-0.1rem",
    content: "''",
    height: "1rem",
    position: "absolute",
  };

  const tailSelfStyle: SxProps = {
    "&::after": {
      ...commonTailStyle,
      backgroundColor: theme.chat.bgColor,
      borderBottomLeftRadius: "0.5rem",
      right: "-40px",
      transform: "translate(-30px, -2px)",
      width: "10px",
    },
    "&::before": {
      ...commonTailStyle,
      borderBottomLeftRadius: "0.8rem 0.7rem",
      borderRight: `1rem solid ${theme.chat.bubbleTo}`,
      right: "-0.35rem",
      transform: "translate(0, -0.1rem)",
    },
  };

  const tailOtherStyle: SxProps = {
    "&::after": {
      ...commonTailStyle,
      backgroundColor: theme.chat.bgColor,
      borderBottomRightRadius: "0.5rem",
      left: "20px",
      transform: "translate(-30px, -2px)",
      width: "10px",
    },
    "&::before": {
      ...commonTailStyle,
      borderBottomRightRadius: "0.8rem 0.7rem",
      borderLeft: `1rem solid ${theme.chat.bubbleFrom}`,
      left: "-0.35rem",
      transform: "translate(0, -0.1rem)",
    },
  };

  const iconStyle: SxProps = {
    width: "12px",
    height: "12px",
    alignSelf: "flex-end",
    marginLeft: "8px",
  };

  const rotateIcon: SxProps = {
    animation: "spin 2s linear infinite",
    "@keyframes spin": {
      "0%": {
        transform: "rotate(0deg)",
      },
      "100%": {
        transform: "rotate(360deg)",
      },
    },
  };

  const nameStyle: SxProps = {
    position: "relative",
    fontSize: "10px",
    display: "block",
    marginTop: "8px",
  };

  const userContext = useContext(UsrContxt);

  const getMessageBubbleStyle = (
    message: Message,
    index: number,
    messages: Message[]
  ): SxProps => {
    const nextMessage = messages[index + 1] ? messages[index + 1] : null;
    const tail: boolean =
      !nextMessage || nextMessage.sender !== message.sender ? true : false;
    let tailStyle: SxProps = {} as SxProps;
    if (tail)
      tailStyle =
        message.sender === userContext.userId ? tailSelfStyle : tailOtherStyle;
    return {
      ...messageBubbleStyle,
      ...tailStyle,
      backgroundColor:
        message.sender !== userContext.userId
          ? theme.chat.bubbleFrom
          : theme.chat.bubbleTo,
      color:
        message.sender !== userContext.userId
          ? theme.common.text.secondary
          : theme.common.text.primary,
      alignSelf:
        message.sender !== userContext.userId ? "flex-start" : "flex-end",
      marginLeft: message.sender !== userContext.userId ? "16px" : "0px",
      marginRight: message.sender !== userContext.userId ? "0px" : "16px",
      marginBottom: "10px",
    };
  };

  const generateMessageStatus = (message: Message): JSX.Element | null => {
    if (message.sender !== userContext.userId) return null;
    if (message.sendStatus === SendStatus.FAILED) {
      return <PriorityHigh sx={iconStyle}></PriorityHigh>;
    } else if (message.sendStatus === SendStatus.SENDING) {
      return (
        <AutorenewIcon sx={{ ...iconStyle, ...rotateIcon }}></AutorenewIcon>
      );
    } else {
      return <CheckIcon sx={iconStyle}></CheckIcon>;
    }
  };

  const getNameStyle = (message: Message): SxProps => {
    return {
      ...nameStyle,
      color: theme.common.text.secondary,
      alignSelf:
        message.sender !== userContext.userId ? "flex-start" : "flex-end",
      marginLeft: message.sender !== userContext.userId ? "26px" : "",
      marginRight: message.sender === userContext.userId ? "26px" : "",
    };
  };

  const messageType2Sx: SxProps = {
    color: theme.common.text.secondary,
    fontSize: "10px",
    margin: "10px auto 10px auto",
  };

  return (
    <StrictMode>
      <Box sx={messagesContainer}>
        {messages ? (
          messages.map((value: Message, index: number, messages: Message[]) => {
            return value.sendType === 1 ? (
              <React.Fragment key={value.date?.getTime()}>
                <Box sx={getNameStyle(value)}>{value.senderUsername}</Box>
                <Paper sx={getMessageBubbleStyle(value, index, messages)}>
                  {value.message} {generateMessageStatus(value)}
                </Paper>
              </React.Fragment>
            ) : (
              <Box sx={messageType2Sx}>{value.message}</Box>
            );
          })
        ) : (
          <>
            <i>crickets</i>
          </>
        )}
        {children}
      </Box>
    </StrictMode>
  );
}

export default Messages;
