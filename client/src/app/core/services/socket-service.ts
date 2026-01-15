import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket

  constructor() {
    this.socket = io(environment.baseURL, {
      auth: {
        token: localStorage.getItem('token')
      }
    })
  }

  listen(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(event, data => observer.next(data))

      return () => this.socket.off(event)
    })
  }

  emit(event: string, data: any): void {
    this.socket.emit(event, data)
  }
}
