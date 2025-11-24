import { Injectable } from '@angular/core';
import { io, Socket} from 'socket.io-client'
import { enviroment } from '../../enviroments/enviroment';
import { IMessage } from '../models/imessage';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket

  connect(userId: string) {
    this.socket = io(enviroment.socketUrl, { transports: ['websocket']})
    this.socket.on('connect', () => console.log('socket connected', this.socket.id))
    this.socket.emit('setup', {_id: userId})
  }

  disconnect() {
    if(this.socket) {
      this.socket.disconnect()
    }
  }

  joinChat(chatId: string) {
    this.socket.emit('join chat', chatId)
  }

  sendMessage(message: IMessage) {
    this.socket.emit('new message', message)
  }

  onMessageReceived(handler: (msg: IMessage) => void) {
    this.socket.on('message received', handler)
  }
}
