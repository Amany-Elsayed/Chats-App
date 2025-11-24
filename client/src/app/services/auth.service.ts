import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IUser } from '../models/iuser';
import { enviroment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = `${enviroment.apiUrl}/users`;
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const raw = localStorage.getItem('userInfo');
    if (raw) this.currentUserSubject.next(JSON.parse(raw));
  }

  login(data: { email: string; password: string }): Observable<IUser> {
    return this.http.post<IUser>(`${this.api}/login`, data).pipe(
      tap(user => this.setUser(user))
    );
  }

  register(data: { name: string; email: string; password: string; pic?: string })
    : Observable<IUser>
  {
    return this.http.post<IUser>(`${this.api}/register`, data).pipe(
      tap(user => this.setUser(user))
    );
  }

  private setUser(user: IUser) {
    this.currentUserSubject.next(user);
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('userInfo');
  }

  getToken(): string | null {
    return this.currentUserSubject.value?.token ?? null;
  }
}
