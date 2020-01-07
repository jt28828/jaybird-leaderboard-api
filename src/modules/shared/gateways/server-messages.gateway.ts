import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";

@WebSocketGateway(4001)
export class ServerMessagesGateway implements OnGatewayConnection<Socket>, OnGatewayDisconnect {
  private logger: Logger = new Logger("AppGateway");

  @WebSocketServer()
  private server: Server;

  public handleConnection(client: Socket, ...args: any[]) {
    this.logger.log("User connected");
  }

  public handleDisconnect(client: Socket, ...args: any[]) {
    this.logger.log("User disconnected");
  }

  /** Sends a new drinking game to the user to be displayed on the screen */
  public sendNewDrinkingGame(game: string) {
    this.server.emit("drinking-game", game);
  }

  /** Sends a message to all subscribers to let them know there is new data */
  public notifyDataUpdate() {
    this.server.emit("data-update");
  }
}
