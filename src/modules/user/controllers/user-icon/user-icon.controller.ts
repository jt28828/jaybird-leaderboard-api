import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../../guards/auth-guard/auth.guard";
import { Request } from "express";
import { BaseController } from "../../../../models/base-controller";

@Controller("user/icon")
export class UserIconController extends BaseController {
  constructor() {
    super();
  }

  @Get()
  public getUserIcon() {

  }

  @UseGuards(AuthGuard)
  @Post()
  public setUserIcon(@Req() request: Request) {
    const userId = request.headers.from;

    return `Thanks for that id: ${userId}`;
  }
}
