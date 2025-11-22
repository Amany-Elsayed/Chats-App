import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Iuser } from '../models/iuser';
import { enviroment } from '../../enviroments/enviroment';
import { tap } from 'rxjs/operators'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = `${enviroment.apiUrl}/users`
  currentUser = signal<Iuser | null>(null)

  constructor(private http: HttpClient) {
    const raw = localStorage.getItem("userInfo")
    if (raw) this.currentUser.set(JSON.parse(raw))
  }

  login(data: { email: string; password: string }) {
    return this.http.post<Iuser>(`${this.api}/login`, data).pipe(
      tap(user => this.setUser(user))
    );
  }

  register(data: {name: string; email: string; password: string; pic?:string}) {
    return this.http.post<Iuser>(`${this.api}/register`, data).pipe(
      tap(user => {this.setUser(user)})
    )
  }

  setUser(user: Iuser) {
    this.currentUser.set(user)
    localStorage.setItem("userInfo", JSON.stringify(user))
  }

  logout() {
    this.currentUser.set(null)
    localStorage.removeItem("userInfo")
  }

  getToken(): string | null {
  const u = this.currentUser()
  return u?.token ?? null
  }
}


