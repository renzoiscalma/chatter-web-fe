import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation ($addMessageInput: AddMessageInput) {
    addMessage(addMessageInput: $addMessageInput) {
      code
      success
      localDateSent
      message {
        message
        from {
          username
          id
        }
        to {
          id
        }
      }
    }
  }
`;

export const GET_MESSAGES_ON_LOBBY = gql`
  query getMessagesOnLobby($lobbyId: ID!) {
    getMessagesOnLobby(lobbyId: $lobbyId) {
      code
      success
      data {
        id
        from {
          username
          id
        }
        message
        date
      }
    }
  }
`;

export const GET_CURR_USERS_ON_LOBBY = gql`
  query getCurrentUsersOnLobby($lobbyId: ID!) {
    getCurrentUsersOnLobby(lobbyId: $lobbyId) {
      code
      success
      data {
        username
      }
    }
  }
`;

export const USER_LIST_CHANGED_SUBSCRIPTION = gql`
  subscription userListChanged($lobbyId: ID!) {
    userListChanged(lobbyId: $lobbyId) {
      code
      success
      data {
        id
        username
      }
    }
  }
`;

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription MessageAdded($lobbyId: ID!, $userId: ID!) {
    messageAdded(lobbyId: $lobbyId, userId: $userId) {
      lobbyId
      messages {
        from {
          id
          username
          type
        }
        message
        date
      }
    }
  }
`;

export const VIDEO_STATUS_SUBSCRIPTION = gql`
  subscription VideoStatusChanged($lobbyId: ID!, $userId: ID!) {
    videoStatusChanged(lobbyId: $lobbyId, userId: $userId) {
      code
      success
      data {
        status
        currTime
        url
      }
    }
  }
`;

export const USERNAME_CHANGED_SUBSCRIPTION = gql`
  subscription UsernameChanged($lobbyId: ID!, $userId: ID!) {
    usernameChanged(lobbyId: $lobbyId, userId: $userId) {
      data {
        id
        username
      }
    }
  }
`;
