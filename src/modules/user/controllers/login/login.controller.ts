import { Body, Controller, Post, Res } from "@nestjs/common";
import { UserService } from "../../../shared/services/user-service/user.service";
import { AuthService } from "../../../shared/services/auth-service/auth.service";
import { Response } from "express";
import { User, UserModel } from "../../../../database/models/user.model";
import { LoginUserDto } from "../../../../models/request/login-user";
import { BaseController } from "../../../../models/base-controller";

@Controller("user/login")
export class LoginController extends BaseController {
  constructor(
    private readonly service: UserService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  @Post()
  public async loginUser(@Res() response: Response, @Body() dto: LoginUserDto) {
    // Get the user from the database
    let dbUser: UserModel;
    try {
      dbUser = await this.service.getByUsername(dto.username);
    } catch (e) {
      console.error(e);
      this.sendNotFoundResponse(response, "User not found");
      return;
    }

    // User was found. Compare passwords and if valid log in

    const passwordsMatch = this.authService.verifyPassword(dbUser.password, dto.password, dbUser.paprika);

    if (!passwordsMatch) {
      this.sendNotFoundResponse(response, "User not found");
      return;
    }

    const jwt = await this.authService.generateJwt({
      id: dbUser._id,
      name: dbUser.name,
    });

    this.sendOkResponse(response, { jwt });
  }

}
