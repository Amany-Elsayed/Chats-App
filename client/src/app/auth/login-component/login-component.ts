import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-login-component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  email = ''
  password = ''

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      alert('Please fill all fields')
      return
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/chat']),
      error: err => alert(err.error?.message || "Login failed")
    })
  }
}
