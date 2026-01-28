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
  private onlineUsersSubject = new Subject<string[]>()
  private userStatusSubject = new Subject<{ userId: string; online: boolean }>()
  private typingSubject = new Subject<string>()
  private stopTypingSubject = new Subject<string>() 

  connect(token: string): void {
    if (this.socket?.connected) return
    
    this.socket = io(environment.baseURL, {auth: { token }})

    this.socket.on('receiveMessage', msg => this.messageSubject.next(msg));
    this.socket.on('onlineUsers', users => this.onlineUsersSubject.next(users));
    this.socket.on('userOnline', userId => this.userStatusSubject.next({ userId, online: true }));
    this.socket.on('userOffline', userId => this.userStatusSubject.next({ userId, online: false }));
    this.socket.on('userTyping', ({ userId }) => this.typingSubject.next(userId));
    this.socket.on('userStopTyping', ({ userId }) => this.stopTypingSubject.next(userId));
  }

  disconnect(): void {
    this.socket?.disconnect()
  }

  sendMessage(receiverId: string, content: string): void {
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

  emitMessageRead(messageIds: string[]): void {
    this.socket.emit('messageRead', { messageIds })
  }

  onMessage(): Observable<any> {
    return this.messageSubject.asObservable()
  }

  onMessageStatusUpdate() {
    return fromEvent<{ messageId: string; delivered: boolean }>(this.socket, 'messageStatusUpdate')
  }

  onMessageReadUpdate() {
    return fromEvent<{ messageId: string }>(this.socket, 'messageReadUpdate')
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

  editMessage(messageId: string, content: string) {
    this.socket.emit('editMessage', { messageId, content })
  }

  deleteMessage(messageId: string) {
    this.socket.emit("deleteMessage", { messageId })
  }

  onMessageEdited() {
    return fromEvent<{ messageId: string; content: string; }>(this.socket, "messageEdited")
  }

  onMessageDeleted() {
    return fromEvent<{ messageId: string }>(this.socket, "messageDeleted")
  }

}
