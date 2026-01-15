import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

 export interface User {
  _id: string;
  username: string;
  email: string;
 }

 export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
 }

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private baseURL = `${environment.baseURL}/api/chat`

  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseURL}/users`)
  }

  getMessages(userId: string): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${this.baseURL}/messages/${userId}`)
  }

  sendMessage(receiverId: string, content: string): Observable<Message> {
    return this.httpClient.post<Message>(`${this.baseURL}/messages`, { receiverId, content })
  }
}
