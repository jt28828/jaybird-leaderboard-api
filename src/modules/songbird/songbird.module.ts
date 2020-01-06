import { Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { TwitterUpdateController } from "./controllers/twitter-update/twitter-update.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { modelInjectors } from "../../database/constants/model-injectors";
import { HottestHundredSchema } from "../../database/models/hottestHundred.model";
import { HottestHundredService } from "./services/hottest-hundred/hottest-hundred.service";

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      { name: modelInjectors.hottestHundredModel, schema: HottestHundredSchema },
    ]),
  ],
  providers: [
    HottestHundredService,
  ],
  controllers: [
    TwitterUpdateController,
  ],
})
export class SongbirdModule {
}
