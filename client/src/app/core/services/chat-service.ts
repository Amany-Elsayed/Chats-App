import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../interfaces/message';
import { User } from '../interfaces/user';


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
    return this.httpClient.post<Message>(`${this.baseURL}/message`, { receiverId, content })
  }
}
