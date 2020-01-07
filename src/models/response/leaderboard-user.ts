import { CorrectGuess, TopTenGuess, UserModel } from "../../database/models/user.model";
import { SearchUtils } from "../../utilities/search-utils";

export class LeaderboardUser {
  public name: string;
  public score: number;
  public correctGuesses: CorrectGuess[];
  /** Only includes the guesses not already in the correct guesses list */
  public topTenGuesses: TopTenGuess[];

  constructor(user: UserModel) {
    this.name = user.name;
    this.score = user.score;
    this.correctGuesses = user.correctGuesses
      .sort((a, b) => a.actualPosition - b.actualPosition)
      .map(guess => ({
        songTitle: guess.songTitle,
        guessedPosition: guess.guessedPosition,
        actualPosition: guess.actualPosition,
      }));
    this.topTenGuesses = LeaderboardUser.removeGuessesTopTen(user.correctGuesses, user.guesses);
  }

  /** Removes the top ten guesses that have already been played */
  private static removeGuessesTopTen(playedList: TopTenGuess[], guessList: TopTenGuess[]): TopTenGuess[] {
    if (playedList.length === 0) {
      return guessList.map(guess => ({ songTitle: guess.songTitle, guessedPosition: guess.guessedPosition }));
    }

    // Fuzzy search the list for the top 10 that haven't been played yet
    return guessList
      .filter((guess) => SearchUtils.search(playedList, guess.songTitle, ["songTitle"]) == null)
      .map(guess => ({ songTitle: guess.songTitle, guessedPosition: guess.guessedPosition }));
  }
}
