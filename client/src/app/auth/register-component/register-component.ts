import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-register-component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  username = ''
  email = ''
  password = ''

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (!this.username || !this.email || !this.password) {
      alert('Please fill all fields')
      return
    }

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => alert(err.error?.message || 'Registration failed'
      )
    })
  }

}
