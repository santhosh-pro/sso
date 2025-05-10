import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { OAuthService } from './oauth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(OAuthService);
  const token = authService.getAccessToken();

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authReq);
  }

  return next(req);
};
