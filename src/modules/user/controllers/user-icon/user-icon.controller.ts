import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../../guards/auth-guard/auth.guard";
import { Request, Response } from "express";
import { BaseController } from "../../../../models/base-controller";
import { UserService } from "../../../shared/services/user-service/user.service";
import { UpdateIconDto } from "../../../../models/request/update-icon";
import { ServerMessagesGateway } from "../../../shared/gateways/server-messages.gateway";

@Controller("user/icon")
export class UserIconController extends BaseController {
  constructor(
    private userService: UserService,
    private serverMessages: ServerMessagesGateway,
  ) {
    super();
  }

  @UseGuards(AuthGuard)
  @Get()
  public async getUserIcon(@Req() request: Request, @Res() response: Response) {
    const userId = request.headers.from;

    // Get the user first
    const user = await this.userService.getById(userId);

    if (user == null) {
      this.sendBadRequestResponse(response, "User not found");
    } else {
      const responseData = new UpdateIconDto(user.icon);
      this.sendOkResponse(response, responseData);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  public async setUserIcon(@Req() request: Request, @Body() data: UpdateIconDto) {
    const userId = request.headers.from;

    // Get the user first
    const user = await this.userService.getById(userId);

    if (user != null) {
      user.icon = data.icon;
      await user.save();
    }

    // Force users to reload the icon
    this.serverMessages.notifyDataUpdate();
    return "Icon updated";
  }
}
