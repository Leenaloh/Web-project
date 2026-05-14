import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (user || token) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { accessDenied: 'true' }
  });
};