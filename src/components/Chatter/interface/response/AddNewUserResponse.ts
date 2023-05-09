import GenericResponse from "./GenericResponse";

interface AddNewUserResponse extends GenericResponse {
  user: {
    id: string;
    username: string;
  };
}

export default AddNewUserResponse;
