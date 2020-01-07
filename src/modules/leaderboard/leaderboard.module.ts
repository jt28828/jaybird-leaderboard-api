import { Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { LeaderboardController } from "./controllers/leaderboard/leaderboard.controller";

@Module({
  imports: [
    SharedModule,
  ],
  controllers: [
    LeaderboardController,
  ],
})
export class LeaderboardModule {
}
