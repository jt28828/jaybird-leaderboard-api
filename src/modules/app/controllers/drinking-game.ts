import { Controller, Get } from "@nestjs/common";
import { BaseController } from "src/models/base-controller";
import { DrinkingGame } from "src/models/DrinkingGame";
import fetch, { Response as FetchResponse } from "node-fetch";
import { DrinkingGameResponseDto } from "src/models/response/drinking-games/drinking-game-response";
import { ServerMessagesGateway } from "src/modules/shared/gateways/server-messages.gateway";

@Controller("drinking-games")
export class LeaderboardController extends BaseController {
  constructor(
    private readonly serverMessagesGateway: ServerMessagesGateway,) {
    super();
  }

  @Get()
  public async getDrinkingGame() {
    const drinkingGame = await this.requestDrinkingGame(null);

    if (drinkingGame != null){
      this.serverMessagesGateway.sendNewDrinkingGame(drinkingGame);
    }
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
}