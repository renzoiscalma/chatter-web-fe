import { gql } from "@apollo/client";

export const VIDEO_STATUS_SUBSCRIPTION = gql`
  subscription VideoStatusChanged($lobbyId: ID!, $userId: ID!) {
    videoStatusChanged(lobbyId: $lobbyId, userId: $userId) {
      code
      success
      data {
        status
        currTime
        url
        changedBy
      }
    }
  }
`;

export const UPDATE_VIDEO = gql`
  mutation updateVideoStatus($statusInput: VideoStatusInput) {
    updateVideoStatus(statusInput: $statusInput) {
      code
      success
    }
  }
`;

export const GET_VIDEO_STATUS = gql`
  query getVideoStatusOnLobby($lobbyId: ID!) {
    getVideoStatusOnLobby(lobbyId: $lobbyId) {
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
