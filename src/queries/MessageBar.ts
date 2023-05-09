import { gql } from "@apollo/client";

export const CHANGE_USERNAME = gql`
  mutation changeUsername($newUsername: String, $userId: ID) {
    changeUsername(newUsername: $newUsername, userId: $userId) {
      code
      success
    }
  }
`;

export const VALIDATE_USERNAME = gql`
  mutation validateUsername($username: String!) {
    validateUsername(username: $username) {
      code
      success
      valid
    }
  }
`;
