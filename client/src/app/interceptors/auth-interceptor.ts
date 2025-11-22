import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const raw = localStorage.getItem('userInfo')
  if (!raw) return next(req)

  const token = JSON.parse(raw).token
  const cloned = req.clone({
    setHeaders: { Authorization: token ? `Bearer ${token}` : ''}
  })
  return next(cloned)
};
