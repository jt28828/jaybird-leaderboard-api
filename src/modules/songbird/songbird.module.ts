import { Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { TwitterUpdateController } from "./controllers/twitter-update/twitter-update.controller";

@Module({
  imports: [
    SharedModule,
  ],
  providers: [],
  controllers: [
    TwitterUpdateController,
  ],
})
export class SongbirdModule {
}
