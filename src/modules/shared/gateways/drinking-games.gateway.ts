import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";

@WebSocketGateway(4001)
export class DrinkingGamesGateway implements OnGatewayConnection<Socket>, OnGatewayDisconnect {
  private logger: Logger = new Logger("AppGateway");

  @WebSocketServer()
  private server: Server;

  public handleConnection(client: Socket, ...args: any[]) {
    client.emit("connection", "A user connected");
  }

  public handleDisconnect(client: Socket, ...args: any[]) {
    client.emit("connection", "A user disconnected");
  }

  /** Sends a new drinking game to the user to be displayed on the screen */
  public sendNewDrinkingGame(game: string) {
    this.server.emit("drinking-game", game);
  }
}
