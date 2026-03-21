export interface CreateRequestModel {
  username: string;
  email: string;
  name: string|null;
  otherUsers: string[]|null;
}
