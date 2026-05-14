import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../authService/authService';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.me().pipe(
    map((response) => {
      if (response.status === 'SUCCESS') {
        return true;
      }

      return router.createUrlTree(['/'], {
        queryParams: { accessDenied: 'true' }
      });
    }),
    catchError(() =>
      of(
        router.createUrlTree(['/'], {
          queryParams: { accessDenied: 'true' }
        })
      )
    )
  );
};