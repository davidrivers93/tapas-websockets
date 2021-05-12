import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { getSymbolPrice } from 'src/lib/price';

const MESSAGE_KEY = 'message';
const CHANGE_USER_KEY = 'changeUser';
const GET_PRICE_KEY = 'getPrice';
const USER_LIST_KEY = 'users';

const ADMIN = 'Admin';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private users: { [key: string]: string } = {};

  private logger: Logger = new Logger('ChatGateway');

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(GET_PRICE_KEY)
  async handleGetPriceMessage(
    @MessageBody() symbol: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const name = this.users[client.id] || 'Unnamed';
      const price = await getSymbolPrice(symbol);
      const msg = `User ${name} has requested the price for ${symbol} symbol. Current price is ${price}`;
      this.emitMessage(msg, ADMIN);
    } catch (error) {
      client.send({
        isPrivate: true,
        message: 'You have entered a wrong symbol',
        name: ADMIN,
      });
    }
  }

  @SubscribeMessage(MESSAGE_KEY)
  handleChatMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    const name = this.users[client.id] || 'Unnamed';
    this.emitMessage(message, name);
  }

  @SubscribeMessage(CHANGE_USER_KEY)
  handleChangeUser(
    @MessageBody() newName: string,
    @ConnectedSocket() client: Socket,
  ): void {
    const oldUserName = this.users[client.id];
    this.users[client.id] = newName;
    const msgToSend = `${oldUserName ||
      'Unknown'} has changed his name to ${newName}`;

    this.emitMessage(msgToSend, ADMIN);
    client.send({
      isPrivate: true,
      message: `Now, your name  is ${newName}`,
      name: ADMIN,
    });

    this.sendUsers();
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    delete this.users[client.id];
    this.sendUsers();
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.users[client.id] = client.id;
    this.sendUsers();
    this.logger.log(`Client connected: ${client.id}`);
  }

  private sendUsers(): void {
    const users = Object.values(this.users);
    this.emitMessage(users, ADMIN, USER_LIST_KEY);
  }

  private emitMessage(
    message: string | string[],
    name: string,
    key = MESSAGE_KEY,
  ): void {
    this.server.emit(key, {
      message,
      name,
      date: new Date(),
    });
  }
}
