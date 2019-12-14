import { Body, Controller, Post, Res } from "@nestjs/common";
import { UserService } from "../../service/user.service";
import { User, UserModel } from "../../../../database/models/user.model";
import { AuthService } from "../../../shared/services/auth-service/auth.service";
import { Response } from "express";
import { dbErrorCodes } from "../../../../database/constants/db-error-codes";
import { BaseController } from "../../../../models/base-controller";

@Controller("user/registration")
export class RegistrationController extends BaseController {
  constructor(
    private readonly service: UserService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  /** Creates a new user and stores them in the DB */
  @Post()
  public async createUser(@Res() response: Response, @Body() newUserDto: User) {

    const toCreate = this.createDbEntry(newUserDto);

    let createdUser: UserModel;
    try {
      createdUser = await this.service.create(toCreate);
    } catch (e) {
      console.error(e);
      if ((e.message as string).includes(dbErrorCodes.conflict)) {
        this.sendOkResponse(response, "A user with that username already exists");
      } else {
        this.sendBadRequestResponse(response, "An unknown error occurred");
      }
      return;
    }

    // User created sucessfully. Generate a JWT for them
    const jwt = await this.authService.generateJwt({
      id: createdUser._id,
      name: createdUser.name,
    });

    this.sendCreatedResponse(response, jwt);
  }

  /** Creates a new user entry from the provided dto to enter into the database */
  private createDbEntry(dto: User): User {
    const dbEntry = new User();
    dbEntry.username = dto.username;
    dbEntry.name = dto.name;

    // Hash their password
    const passwordDetails = this.authService.hashPassword(dto.password);
    dbEntry.password = passwordDetails.hashedPassword;
    dbEntry.paprika = passwordDetails.salt;

    return dbEntry;
  }
}
