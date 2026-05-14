import { Routes } from '@angular/router';
import { authGuard } from './services/authGuard/auth.guard';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { CartComponent } from './pages/cart/cart';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CheckoutResultComponent } from './pages/checkout/checkout-result.component';
import { MovieListComponent } from './pages/movie_list/movie_list';
import { MovieDetailsComponent } from './pages/movie_details/movie_details';
import { StarDetailsComponent } from './pages/star_details/star_details';
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },

  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'checkout/result', component: CheckoutResultComponent, canActivate: [authGuard] },

  { path: 'movie-list', component: MovieListComponent },
  { path: 'movie_details', component: MovieDetailsComponent },
  { path: 'star_details', component: StarDetailsComponent },
  { path: '**', redirectTo: '' }
];