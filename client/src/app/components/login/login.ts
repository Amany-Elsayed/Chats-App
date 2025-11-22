import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = ''
  password = ''
  error = ''

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.login({email: this.email, password: this.password}).subscribe({
      next: (res: any) => {
        this.auth.setUser(res)
        this.router.navigate(['/chats'])
      },
      error: err => this.error = err.error.message
    })
  }

}
