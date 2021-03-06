import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { BaseController } from "../../../../models/base-controller";
import { UserService } from "../../../shared/services/user-service/user.service";
import { Request, Response } from "express";
import { CorrectGuess, UserModel } from "../../../../database/models/user.model";
import { HottestHundredService } from "../../../shared/services/hottest-hundred/hottest-hundred.service";
import { HottestHundred } from "../../../../database/models/hottestHundred.model";
import { SearchUtils } from "../../../../utilities/search-utils";
import { CorrectGuesser } from "../../../../models/interfaces/correct-guesser";
import { ServerMessagesGateway } from "../../../shared/gateways/server-messages.gateway";
import { DrinkingGameResponseDto } from "../../../../models/response/drinking-games/drinking-game-response";
import fetch, { Response as FetchResponse } from "node-fetch";
import { DrinkingGame } from "../../../../models/DrinkingGame";
import { HottestHundredDto } from "../../../../models/response/hottest-hundred";
import { DrinkingGameType } from "../../../../models/enums/drinking-game-type";

@Controller("twitter-update")
export class TwitterUpdateController extends BaseController {
  constructor(
    private readonly userService: UserService,
    private readonly hottestHundredService: HottestHundredService,
    private readonly serverMessagesGateway: ServerMessagesGateway,
  ) {
    super();
  }

  @Get()
  public async get10LatestEntries(@Res() response: Response) {
    let allEntries = await this.hottestHundredService.getAll();

    if (allEntries == null) {
      allEntries = [];
    }

    // Order the entries
    let orderedEntries = allEntries.sort((a, b) => a.position - b.position);

    if (allEntries.length > 10) {
      // Trim down to the latest ten
      orderedEntries = orderedEntries.slice(0, 10);
    }

    // Return whatever is set without all the extra Mongo fields
    const formattedResponse = orderedEntries.map(entry => new HottestHundred(entry));
    this.sendOkResponse(response, formattedResponse);
  }

  @Post()
  public async addHottestHundredEntry(@Req() request: Request, @Res() response: Response, @Body() dto: HottestHundredDto) {
    // First check it's not a double up bug
    const alreadyAdded = await this.hottestHundredService.getByName(dto.songName);

    if (alreadyAdded != null) {
      // Return ok anyway in case the server retries on a bad request or something
      this.sendOkResponse(response, { msg: "Thanks songbird" });
      return;
    }

    // Calculate the position
    const lastAdded = await this.hottestHundredService.getNewest();

    const newDbEntry = new HottestHundred();
    newDbEntry.songName = dto.songName;
    if (lastAdded == null) {
      newDbEntry.position = 100;
    } else {
      newDbEntry.position = lastAdded.position - 1;
    }

    // Add the new song into the DB
    try {
      await this.hottestHundredService.create(newDbEntry);
    } catch (e) {
      console.error(e);
      this.sendBadRequestResponse(response, "Something went wrong");
      return;
    }

    // New song added. Return to the server and update people's scores and correct guesses
    const correctGuessers = await this.updateUserGuesses(newDbEntry);

    // Alert subscribers that the board has update
    this.serverMessagesGateway.notifyDataUpdate();

    // Finally get a new drinking game
    let guesserNames: string | null = null;
    if (correctGuessers != null && correctGuessers.length !== 0) {
      guesserNames = correctGuessers.map(u => `${u.guesser.name}, `).join();
      // Remove final comma
      guesserNames = guesserNames.slice(0, guesserNames.length - 2);
    }

    if (this.shouldShowDrinkingGame(newDbEntry.position, correctGuessers)) {
      const drinkingGame = await this.requestDrinkingGame(guesserNames);

      if (drinkingGame != null) {
        // This will appear in-app to all connected clients
        this.serverMessagesGateway.sendNewDrinkingGame(drinkingGame);
      }
    }
    // Finally send response otherwise GET request to drinks server won't work
    this.sendOkResponse(response, { msg: "Thanks songbird" });
  }

  /** Allows drinking games to be shown every 10 songs, every correct guess, and on the number 1 song */
  private shouldShowDrinkingGame(songPosition: number, guesserNames: ReadonlyArray<CorrectGuesser>) {
    return (songPosition % 10 === 0 || guesserNames?.length !== 0 || songPosition === 1);
  }

  private async requestDrinkingGame(winnerNames: string | null): Promise<DrinkingGame | null> {
    let response: FetchResponse;

    const url = `${process.env.DRINKING_GAME_ADDRESS}:${process.env.DRINKING_GAME_PORT}/${process.env.DRINKING_GAME_ROUTE}`;

    try {
      response = await fetch(url, { method: "GET" });
    } catch (e) {
      // No drinking game available
      console.error(e);
      return null;
    }

    if (response.status > 300) {
      // Error occurred
      return null;
    }

    const gameResponse: DrinkingGameResponseDto = await response.json();

    return new DrinkingGame(gameResponse, winnerNames);
  }

  /**
   * Updates all user's scores and guesses based off the new song. Returns the users that guessed the song.
   * In order of who guessed it the highest to lowest
   */
  private async updateUserGuesses(newSong: HottestHundred): Promise<ReadonlyArray<CorrectGuesser>> {
    const allUsers = await this.userService.getAll();

    let correctGuessers: ReadonlyArray<CorrectGuesser> = [];

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
    if (currentGuessers.length === 0) {
      // The user is the first correct guesser
      newArray = [newGuesser];
    } else {
      // Enter the user in their ordered position. I'm not quicksorting or anything there'll be like 10 users max
      for (let i = 0; i < currentGuessers.length; i++) {
        const currentGuesser = currentGuessers[i];
        if (newGuesser.guessedPosition <= currentGuesser.guessedPosition) {
          // Create a new array, splicing the new item in the correct spot
          newArray = [...currentGuessers.slice(0, i), newGuesser, ...currentGuessers.slice(i, currentGuessers.length)];
          console.log(i);
          console.log(newArray);
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

    const matchingSong = SearchUtils.search(user.guesses, songTitle, ["songTitle"]);

    if (matchingSong != null) {
      // First make sure the user doesn't have another guess for that song already
      if (!user.correctGuesses.find(song => song.songTitle === songTitle)) {

        // Get the index of the matching song to determine its position
        const index = user.guesses.indexOf(matchingSong);

        // Add 1 to the index to retrieve the position the user entered it as.
        songPosition = index + 1;
      }
    }

    return songPosition;
  }

}
