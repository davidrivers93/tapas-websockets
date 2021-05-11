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

const MESSAGE_KEY = 'message';
const CHANGE_USER_KEY = 'changeUser';
const USER_LIST_KEY = 'users';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private users: { [key: string]: string } = {};

  private logger: Logger = new Logger('ChatGateway');

  @WebSocketServer()
  server: Server;

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
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    const oldUserName = this.users[client.id];
    this.users[client.id] = message;
    const msgToSend = `${oldUserName ||
      'Unknown'} has changed his name to ${message}`;

    this.emitMessage(msgToSend, 'Admin');
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
    this.emitMessage(users, 'Admin', USER_LIST_KEY);
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
