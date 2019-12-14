import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { IncomingHttpHeaders } from "http";
import { AuthService } from "../../modules/shared/services/auth-service/auth.service";
import { Request } from "express";
import { JwtModel } from "../../models/interfaces/jwt-model";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
  ) {
  }

  public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.getJwt(request.headers);

    let decodedToken: JwtModel;
    try {
      decodedToken = await this.authService.verifyJwt(token);
    } catch (e) {
      // Error verifying
      return false;
    }

    // Verified sucessfully. Add the user's ID to the request
    request.headers.from = decodedToken.id;
    return true;
  }

  /** Pulls the JWT out of the auth header */
  private getJwt(headers: IncomingHttpHeaders) {
    let authHeader = headers.authorization;
    if (authHeader.length !== 0) {
      // Strip out bearer from the header
      authHeader = authHeader.replace("Bearer ", "");
    }
    return authHeader;
  }
}
