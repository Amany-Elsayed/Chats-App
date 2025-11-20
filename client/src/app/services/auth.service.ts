import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Iuser } from '../models/iuser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = "http://localhost:5000/api/users"
  currentUser = signal<any>(null)

  constructor(private http: HttpClient) {
    const user = localStorage.getItem("user")
    if (user) this.currentUser.set(JSON.parse(user))
  }

  login(data: any) {
    return this.http.post<Iuser>(`${this.api}/login`, data)
  }

  register(data: any) {
    return this.http.post<Iuser>(`${this.api}/register`, data)
  }

  setUser(user: any) {
    this.currentUser.set(user)
    localStorage.setItem("user", JSON.stringify(user))
  }

  logout() {
    this.currentUser.set(null)
    localStorage.removeItem("user")
  }
}
