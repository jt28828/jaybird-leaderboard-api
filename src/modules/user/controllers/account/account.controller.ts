import { Controller, Delete, Get, Param, Response, UseGuards } from "@nestjs/common";
import { UserService } from "../../../shared/services/user-service/user.service";
import { Response as ExpressResponse } from "express";
import { AuthGuard } from "../../../../guards/auth-guard/auth.guard";

@Controller("user/account")
export class AccountController {
  constructor(
    private readonly service: UserService,
  ) {
  }

  /** Returns the users currently stored in the db */
  @Get()
  public async getUsers() {
    return (await this.service.getAll()).map(u => ({ name: u.name, password: u.password }));
  }

  @UseGuards(AuthGuard)
  @Get(":userName")
  public async getUserImage(
    @Param("userName") userName: string, @Response() response: ExpressResponse) {
    const userIcon = (await this.service.getById(userName))?.icon;
    response.header("Content-Type", userIcon.mimeType);

    response.send(userIcon.data);
  }

  @Delete()
  @UseGuards(AuthGuard)
  public async deleteUsers() {
    await this.service.clearTable();
  }
}
