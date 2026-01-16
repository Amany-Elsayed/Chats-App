import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket

  constructor() {}

  connect(token: string): void {
    this.socket = io(environment.baseURL, {
      auth: { token }
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  sendMessage(receiverId: string, content: string): void {
    this.socket.emit('sendMessage', { receiverId, content })
  }

  onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receiveMessage', message => {
        observer.next(message)
      })
    })
  }
}
