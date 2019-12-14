export interface JwtModel {
  id: string;
  name: string;
  iat: number;
  aud: "jjj-guessers";
  iss: "jjj-server";
}
