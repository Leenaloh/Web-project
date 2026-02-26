import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { CartComponent } from './pages/cart/cart';
import { MovieListComponent } from './pages/movie_list/movie_list';
import { MovieDetailsComponent } from './pages/movie_details/movie_details';
import { StarDetailsComponent } from './pages/star_details/star_details';

export const routes: Routes = [
  { path: '', component: LoginComponent }, 
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'movie-list', component: MovieListComponent },
  { path: 'movie_details', component: MovieDetailsComponent },
  { path: 'star_details', component: StarDetailsComponent },
  { path: '**', redirectTo: '' } 
];