import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../interfaces/auth-response';
import { SocketService } from './socket-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = `${environment.baseURL}/api/auth`

  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'))

  token$ = this.tokenSubject.asObservable()

  constructor(private httpClient: HttpClient, private socketService: SocketService) {}

  login(email: string, password: string) {
    return this.httpClient.post<AuthResponse>(`${this.baseURL}/login`, {email, password})
      .pipe(tap(res => {
        localStorage.setItem('token', res.token)
        this.tokenSubject.next(res.token)
        this.socketService.connect(res.token)
      }))
  }

  register(username: string, email:string, password: string): Observable<any> {
    return this.httpClient.post(`${this.baseURL}/register`, {username, email, password})
  }

  logout(): void {
    localStorage.removeItem('token')
    this.tokenSubject.next(null)
    this.socketService.disconnect()
  }

  getToken(): string | null {
    return this.tokenSubject.value
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value
  }
}