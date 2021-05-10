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

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private users: { [key: string]: string } = {};

  private logger: Logger = new Logger('ChatGateway');

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleChatMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('message', {
      message,
      name: this.users[client.id] || 'Unnamed',
      date: new Date(),
    });
  }

  @SubscribeMessage('changeUser')
  handleChangeUser(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.users[client.id] = message;
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.users[client.id] = client.id;
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
