import { Injectable } from '@angular/core';
import { enviroment } from '../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { IChat } from '../models/ichat';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private api = `${enviroment.apiUrl}/chats`

  constructor(private http: HttpClient) {}

  accessChat(userId: string) {
    return this.http.post<IChat>(`${this.api}`, { userId })
  }

  fetchChats() {
    return this.http.get<IChat[]>(`${this.api}`)
  }
  
}
