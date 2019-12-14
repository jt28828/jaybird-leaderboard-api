import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth-service/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { config } from "dotenv";

config();

@Module({
  imports: [
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
  ],
  exports: [
    AuthService,
    JwtModule,
  ],
})
export class SharedModule {
}
