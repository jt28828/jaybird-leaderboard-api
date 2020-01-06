import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { BaseController } from "../../../../models/base-controller";
import { UserService } from "../../../shared/services/user-service/user.service";
import { Request, Response } from "express";
import { CorrectGuess, UserModel } from "../../../../database/models/user.model";
import { HottestHundredService } from "../../services/hottest-hundred/hottest-hundred.service";
import { HottestHundred } from "../../../../database/models/hottestHundred.model";
import { SearchUtils } from "../../../../utilities/search-utils";
import { CorrectGuesser } from "../../../../models/interfaces/correct-guesser";
import { DrinkingGamesGateway } from "../../../shared/gateways/drinking-games.gateway";

@Controller("twitter-update")
export class TwitterUpdateController extends BaseController {
  constructor(
    private readonly userService: UserService,
    private readonly hottestHundredService: HottestHundredService,
    private readonly drinkingGamesGateway: DrinkingGamesGateway,
  ) {
    super();
  }

  @Post()
  public async addHottestHundredEntry(@Req() request: Request, @Res() response: Response, @Body() dto: HottestHundred) {
    const sender = request.headers.from;

    if (sender !== "songbird") {
      // Not sent by the correct server
      this.sendBadRequestResponse(response, "I caught a bird trying to steal my eggs");
      return;
    }

    // Add the new song into the DB
    try {
      await this.hottestHundredService.create(dto);
    } catch (e) {
      console.error(e);
      this.sendBadRequestResponse(response, "Something went wrong");
      return;
    }

    // New song added. Return to the server and update people's scores and correct guesses
    this.sendOkResponse(response, { msg: "Thanks songbird" });

    // After response send continue to update users.
    const correctGuessers = await this.updateUserGuesses(dto);

    // Finally get a new drinking game

    // TODO get drinking game here
    const drinkingGame = "Drink lots";

    // This will appear in-app to all connected clients
    this.drinkingGamesGateway.sendNewDrinkingGame(drinkingGame);
  }

  /**
   * Updates all user's scores and guesses based off the new song. Returns the users that guessed the song.
   * In order of who guessed it the highest to lowest
   */
  private async updateUserGuesses(newSong: HottestHundred): Promise<ReadonlyArray<CorrectGuesser>> {
    const allUsers = await this.userService.getAll();

    let correctGuessers: ReadonlyArray<CorrectGuesser> = null;

    for (const user of allUsers) {
      const guessedPosition = TwitterUpdateController.getMatchingGuess(user, newSong.songName);

      if (guessedPosition !== -1) {
        // User guessed the song. Tally their points total. Max number of points is 100
        const guessPoints = TwitterUpdateController.calculateGuessPoints(guessedPosition, newSong.position);

        // Update the user's current score and correct guesses
        user.score = user.score + guessPoints;

        const newGuess: CorrectGuess = {
          songTitle: newSong.songName,
          guessedPosition,
          actualPosition: newSong.position,
        };

        // Add the new guess to the user's list and save the changes
        user.correctGuesses = [...user.correctGuesses, newGuess];
        await user.save();

        // Add the user in their sorted position into the guesser's array
        const newCorrectGuess: CorrectGuesser = { guessedPosition, guesser: user };
        correctGuessers = TwitterUpdateController.insertSortedGuesser(newCorrectGuess, correctGuessers);
      }
    }

    // Return the users who guessed correctly
    return correctGuessers;
  }

  private static insertSortedGuesser(newGuesser: CorrectGuesser, currentGuessers: ReadonlyArray<CorrectGuesser>): ReadonlyArray<CorrectGuesser> {
    let newArray: ReadonlyArray<CorrectGuesser>;
    if (currentGuessers == null) {
      // The user is the first correct guesser
      newArray = [newGuesser];
    } else {
      // Enter the user in their ordered position. I'm not quicksorting or anything there'll be like 10 users max
      for (let i = 0; i < currentGuessers.length; i++) {
        const currentGuesser = currentGuessers[i];
        if (newGuesser.guessedPosition <= currentGuesser.guessedPosition) {
          // Create a new array, splicing the new item in the correct spot
          newArray = [...currentGuessers.slice(0, i), newGuesser, ...currentGuessers.slice(i, currentGuessers.length)];
        }
      }
    }

    return newArray;
  }

  /** Calculates the number of points a user gets for their correct guess  */
  private static calculateGuessPoints(guessedPosition: number, actualPosition: number): number {
    let guessPoints = 101 - actualPosition;

    // If the user guess the correct position of the song as well. Give them half as many points again
    if (guessedPosition === actualPosition) {
      guessPoints += (guessPoints / 2);
    }
    // Round up to the nearest point
    return Math.ceil(guessPoints);
  }

  /** Returns the position the user guessed the given song title would be. -1 if user didn't guess the song */
  private static getMatchingGuess(user: UserModel, songTitle: string): number {
    let songPosition = -1;

    const matchingSong = SearchUtils.search(user.guesses, songTitle);

    if (matchingSong != null) {
      // Get the index of the matching song to determine its position
      const index = user.guesses.indexOf(matchingSong);

      // Add 1 to the index to retrieve the position the user entered it as.
      songPosition = index + 1;
    }

    return songPosition;
  }

}
