import { Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { MongooseModule } from "@nestjs/mongoose";
import { modelInjectors } from "../../database/constants/model-injectors";
import { UserSchema } from "../../database/models/user.model";

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      { name: modelInjectors.userModel, schema: UserSchema },
    ]),
  ],
})
export class GuessesModule {
}
