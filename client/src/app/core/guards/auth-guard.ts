import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { SocketService } from '../services/socket-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const socketService = inject(SocketService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const token = authService.getToken();

    if (token) {
      socketService.connect(token);
    }

    return true;
  }

  router.navigate(['/login']);
  return false;
};
