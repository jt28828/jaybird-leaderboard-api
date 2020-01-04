import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth-service/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { config } from "dotenv";
import { UserService } from "./services/user-service/user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { modelInjectors } from "../../database/constants/model-injectors";
import { UserSchema } from "../../database/models/user.model";

config();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: modelInjectors.userModel, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        issuer: "jjj-server",
        audience: "jjj-guessers",
      },
      verifyOptions: {
        issuer: "jjj-server",
        audience: "jjj-guessers",
      },
    }),
  ],
  providers: [
    AuthService,
    UserService,
  ],
  exports: [
    AuthService,
    UserService,
    JwtModule,
  ],
})
export class SharedModule {
}
