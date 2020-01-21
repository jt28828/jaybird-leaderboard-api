import { DrinkingGameResponseDto } from "./response/drinking-games/drinking-game-response";
import { DrinkingGameType } from "./enums/drinking-game-type";

// {"description":"All girls take a drink","dice_role":0,"name":"Chicks"}

const nameTemplate = "{name}";
const countTemplate = "{drinks_count}";

export class DrinkingGame {
  public drinkingGameText: string;
  public gameType: DrinkingGameType;
  public diceRollNumber: number;

  /**
   * Creates a new drinking game object and formats the provided values into a single string
   * @param json - The drinking game data from the server
   * @param winnerNames - The name of the previous round winner(s) csv formatted if multiple people
   */
  constructor(json: DrinkingGameResponseDto, winnerNames: string | null) {
    // Format the name out of the text
    this.drinkingGameText = DrinkingGame.formatDrinkingGameText(json, winnerNames);

    this.gameType = (json.game_type === "DICE") ? DrinkingGameType.dice : DrinkingGameType.regular;

    this.diceRollNumber = json.dice_roll;
  }

  private static formatDrinkingGameText(json: DrinkingGameResponseDto, names: string | null): string {
    let drinkingGameString = "";

    if (names == null) {
      drinkingGameString = json.description.replace(nameTemplate, names);
    } else {
      drinkingGameString = json.description.replace(nameTemplate, json.name);
    }

    return drinkingGameString;
  }

  description: string;
  dice_roll: number;
  game_type: "DICE" | string;
  name: string;
}
