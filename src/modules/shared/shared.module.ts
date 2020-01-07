import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth-service/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { config } from "dotenv";
import { UserService } from "./services/user-service/user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { modelInjectors } from "../../database/constants/model-injectors";
import { UserSchema } from "../../database/models/user.model";
import { ServerMessagesGateway } from "./gateways/server-messages.gateway";
import { HottestHundredService } from "./services/hottest-hundred/hottest-hundred.service";
import { HottestHundredSchema } from "../../database/models/hottestHundred.model";

config();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: modelInjectors.userModel, schema: UserSchema },
    ]),
    MongooseModule.forFeature([
      { name: modelInjectors.hottestHundredModel, schema: HottestHundredSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        issuer: "jjj-server",
        expiresIn: "50 days",
        audience: "jjj-guessers",
      },
      verifyOptions: {
        issuer: "jjj-server",
        ignoreExpiration: true,
        audience: "jjj-guessers",
      },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    HottestHundredService,
    ServerMessagesGateway,
  ],
  exports: [
    AuthService,
    UserService,
    HottestHundredService,
    JwtModule,
    ServerMessagesGateway,
  ],
})
export class SharedModule {
}
