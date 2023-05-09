import { gql } from "@apollo/client";

export const ADD_NEW_USER = gql`
  mutation addNewUser {
    addNewUser {
      code
      success
      user {
        id
        username
      }
    }
  }
`;

export const IS_LOBBY_EXISTING = gql`
  query isLobbyExisting($lobbyId: ID!) {
    isLobbyExisting(lobbyId: $lobbyId) {
      code
      success
      isExisting
      lobbyId
    }
  }
`;

export const CREATE_LOBBY = gql`
  mutation createLobby($videoUrl: String) {
    createLobby(videoUrl: $videoUrl) {
      id
      video
      videoStatus {
        status
        currTime
      }
    }
  }
`;

export const ADD_USER_TO_LOBBY = gql`
  mutation addUserToLobby($lobbyId: ID!, $userId: ID!) {
    addUserToLobby(lobbyId: $lobbyId, userId: $userId) {
      code
      success
    }
  }
`;

export const REMOVE_USER_TO_LOBBY = gql`
  mutation removeUserToLobby($lobbyId: ID!, $userId: ID!) {
    removeUserToLobby(lobbyId: $lobbyId, userId: $userId) {
      code
      success
    }
  }
`;
