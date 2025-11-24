import { Injectable } from '@angular/core';
import { enviroment } from '../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { IMessage } from '../models/imessage';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private api = `${enviroment.apiUrl}/messages`

  constructor(private http: HttpClient) {}

  sendMessage(content: string, chatId: string) {
    return this.http.post<IMessage>(`${this.api}`, { content, chatId })
  }

  getMessages(chatId: string) {
    return this.http.get<IMessage[]>(`${this.api}/${chatId}`)
  }
}
