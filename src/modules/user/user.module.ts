import { Module } from "@nestjs/common";
import { UserService } from "./service/user.service";
import { AccountController } from "./controllers/account/account.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { modelInjectors } from "../../database/constants/model-injectors";
import { UserSchema } from "../../database/models/user.model";
import { SharedModule } from "../shared/shared.module";
import { RegistrationController } from "./controllers/registration/registration.controller";
import { UserIconController } from "./controllers/user-icon/user-icon.controller";
import { LoginController } from "./controllers/login/login.controller";

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      { name: modelInjectors.userModel, schema: UserSchema },
    ]),
  ],
  controllers: [
    AccountController,
    LoginController,
    RegistrationController,
    UserIconController,
  ],
  providers: [UserService],
})
export class UserModule {
}
