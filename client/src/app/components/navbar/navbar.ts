import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IUser } from '../../models/iuser';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  user: IUser | null = null

  constructor(private auth: AuthService, private router: Router) {
    this.auth.currentUser$.subscribe(u => (this.user = u))
  }

  logout() {
    this.auth.logout()
    this.router.navigate(['/login'])
  }
}
