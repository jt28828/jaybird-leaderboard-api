import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { BaseController } from "../../../../models/base-controller";
import { UserService } from "../../../shared/services/user-service/user.service";
import { Request, Response } from "express";
import { UserModel } from "../../../../database/models/user.model";
import { AuthGuard } from "../../../../guards/auth-guard/auth.guard";
import { UpdateGuessDto } from "../../../../models/request/update-guess";

@Controller("guess")
export class GuessController extends BaseController {
  constructor(
    private readonly service: UserService,
  ) {
    super();
  }

  @UseGuards(AuthGuard)
  @Get()
  public async getUserGuesses(@Req() request: Request, @Res() response: Response) {
    const userId = request.headers.from;

    // Get the user from the database
    let dbUser: UserModel;
    try {
      dbUser = await this.service.getById(userId);
    } catch (e) {
      console.error(e);
      this.sendNotFoundResponse(response, "User not found");
      return;
    }

    // Retrieve the user's guesses. And if at least 10 haven't been set then return minimum ten.
    const guesses = dbUser.guesses;

    while (guesses.length < 10) {
      guesses.push("");
    }

    // Return nothing
    return this.sendOkResponse(response, { guesses });
  }

  @UseGuards(AuthGuard)
  @Post()
  public async updateUserGuesses(@Req() request: Request, @Res() response: Response, @Body() dto: UpdateGuessDto) {
    const userId = request.headers.from;

    // Get the user from the database
    let dbUser: UserModel;
    try {
      dbUser = await this.service.getById(userId);
    } catch (e) {
      console.error(e);
      this.sendNotFoundResponse(response, "User not found");
      return;
    }

    // Update the user's guesses with the provided ones
    dbUser.guesses = dto.guesses;
    await dbUser.save();

    // Return nothing
    return this.sendNoContentResponse(response);
  }
}
