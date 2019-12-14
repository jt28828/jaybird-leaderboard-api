import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HashedPassword } from "../../../../models/interfaces/hashed-password";
import * as crypto from "crypto";
import { JwtModel } from "../../../../models/interfaces/jwt-model";

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
  ) {
  }

  /** Returns a signed JWT containing the provided payload */
  public async generateJwt(payload: object): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  /** Verifies that a JWT was signed by this server */
  public async verifyJwt(token: string): Promise<JwtModel> {
    return await this.jwtService.verifyAsync(token);
  }

  public hashPassword(plaintextPassword: string): HashedPassword {
    const salt = crypto.randomBytes(128).toString("base64");
    // Join server salt and user unique salt together
    const combinedSalt = salt + process.env.PASSWORD_SALT;
    const hashedPassword = crypto.pbkdf2Sync(plaintextPassword, combinedSalt, 10000, 256, "sha512").toString("hex");

    return {
      hashedPassword,
      salt,
    };
  }

  /** Verifies an already hashed password with its possible plaintext equivalent */
  public verifyPassword(hashedPassword: string, plaintextComparison: string, uniqueSalt: string) {
    // Join server salt and user unique salt together
    const combinedSalt = uniqueSalt + process.env.PASSWORD_SALT;
    const hashedComparison = crypto.pbkdf2Sync(plaintextComparison, combinedSalt, 10000, 256, "sha512").toString("hex");

    // Return if both are equal
    return hashedPassword === hashedComparison;
  }
}
