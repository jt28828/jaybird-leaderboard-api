import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "../shared/shared.module";
import { config } from "dotenv";
import { GuessesModule } from "../guesses/guesses.module";
import { SongbirdModule } from "../songbird/songbird.module";

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
    SongbirdModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
