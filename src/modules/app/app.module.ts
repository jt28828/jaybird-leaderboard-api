import { Inject, Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "../shared/services/auth-service/auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "../shared/shared.module";
import { config } from "dotenv";
import { GuessesModule } from "../guesses/guesses.module";

config();
const mongoConnectionString = `mongodb://${process.env.DB_HOST}:27017/jjj`;

@Module({
  imports: [
    MongooseModule.forRoot(mongoConnectionString, {
      auth: {
        authdb: "admin",
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
      },
    }),
    UserModule,
    SharedModule,
    GuessesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
