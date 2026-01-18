import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../enviroments/enviroment';
import { fromEvent, Observable, retry, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket
  private messageSubject = new Subject<any>()
  private messageHandler: ((message: any) => void) | null = null
  private onlineUsersSubject = new Subject<string[]>()
  private userStatusSubject = new Subject<{ userId: string; online: boolean }>()
  private typingSubject = new Subject<string>()
  private stopTypingSubject = new Subject<string>() 

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

    this.socket.on('onlineUsers', (users: string[]) => {
      this.onlineUsersSubject.next(users)
    })

    this.socket.on('userOnline', (userId: string) => {
      this.userStatusSubject.next({ userId, online: true })
    })

    this.socket.on('userOffline', (userId: string) => {
      this.userStatusSubject.next({ userId, online: false })
    })

    this.socket.on('userTyping', ({ userId }) => {
      this.typingSubject.next(userId)
    })

    this.socket.on('userStopTyping', ({ userId }) => {
      this.stopTypingSubject.next(userId)
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
    if (!this.socket || !this.socket.connected) return
    this.socket.emit('sendMessage', { receiverId, content })
  }

  emitTyping(receiverId: string): void {
    this.socket.emit('typing', { receiverId })
  }

  emitStopTyping(receiverId: string): void {
    this.socket.emit('stopTyping', { receiverId })
  }

  sendDelivered(messageId: string): void {
    this.socket.emit('messageDelivered', { messageId })
  }

  emitMessageRead(senderId: string) {
    this.socket.emit('messageRead', { senderId })
  }

  onMessageRead() {
    return fromEvent(this.socket, 'messageRead')
  }

  onMessageStatusUpdate() {
    return fromEvent(this.socket, 'messageStatusUpdate')
  }

  onMessageStatus(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('messageStatusUpdate', status => {
        observer.next(status)
      })
    })
  }

  onMessage(): Observable<any> {
    return this.messageSubject.asObservable()
  }

  onOnlineUsers(): Observable<string[]> {
    return this.onlineUsersSubject.asObservable()
  }

  onUserStatus(): Observable<{ userId: string; online: boolean}> {
    return this.userStatusSubject.asObservable()
  }

  onTyping(): Observable<string> {
    return this.typingSubject.asObservable()
  }

  onStopTyping(): Observable<string> {
    return this.stopTypingSubject.asObservable()
  }
}
