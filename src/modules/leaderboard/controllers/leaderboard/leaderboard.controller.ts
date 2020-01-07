import { Controller, Get } from "@nestjs/common";
import { BaseController } from "../../../../models/base-controller";
import { UserService } from "../../../shared/services/user-service/user.service";
import { LeaderboardUser } from "../../../../models/response/leaderboard-user";

@Controller("leaderboard")
export class LeaderboardController extends BaseController {
  constructor(
    private userService: UserService,
  ) {
    super();
  }

  @Get()
  public async getLeaderboard() {
    const users = await this.userService.getAll();

    // Order the users by their number of points descending
    const orderedUsers = users?.sort((a, b) => b.score - a.score) ?? [];

    return orderedUsers.map(userModel => new LeaderboardUser(userModel));
  }
}
