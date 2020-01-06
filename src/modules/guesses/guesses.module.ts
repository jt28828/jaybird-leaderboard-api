import { Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { GuessController } from "./controllers/guess/guess.controller";

@Module({
  imports: [
    SharedModule,
  ],
  controllers: [
    GuessController,
  ],
})
export class GuessesModule {
}
