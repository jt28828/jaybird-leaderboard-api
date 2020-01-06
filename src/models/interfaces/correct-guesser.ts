import { UserModel } from "../../database/models/user.model";

export interface CorrectGuesser {
  guesser: UserModel;
  guessedPosition: number;
}
