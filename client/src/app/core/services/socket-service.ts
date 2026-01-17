import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../enviroments/enviroment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket
  private messageSubject = new Subject<any>()
  private messageHandler: ((message: any) => void) | null = null

  constructor() {}

  connect(token: string): void {
    if (this.socket && this.socket.connected) {
      if (!this.messageHandler) {
        this.setupMessageListener()
      }
      return
    }
    
    if (this.socket) {
      if (this.messageHandler) {
        this.socket.off('receiveMessage', this.messageHandler)
      }
      this.socket.disconnect()
      this.messageHandler = null
    }
    
    this.socket = io(environment.baseURL, {
      auth: { token }
    })

    this.setupMessageListener()
  }

  private setupMessageListener(): void {
    if (!this.socket || this.messageHandler) return
    
    this.messageHandler = (message: any) => {
      this.messageSubject.next(message)
    }
    
    this.socket.on('receiveMessage', this.messageHandler)
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
    return this.messageSubject.asObservable()
  }
}
