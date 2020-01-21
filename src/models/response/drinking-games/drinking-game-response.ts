export interface DrinkingGameResponseDto {
  description: string;
  dice_roll: number;
  name: string;
  game_type: "DICE" | string;
}
