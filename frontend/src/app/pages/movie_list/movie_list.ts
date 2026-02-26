import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

type Movie = { id: string; title: string; year: number; director: string; rating: number };

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie_list.html',
  styleUrls: ['./movie_list.css'],
})
export class MovieListComponent {
  movies: Movie[] = [
    { id: 'tt001', title: 'The Wandering Soap Opera', year: 2017, director: 'Raoul Ruiz', rating: 7.2 },
    { id: 'tt002', title: 'The Shawshank Redemption', year: 1994, director: 'Frank Darabont', rating: 9.3 },
  ];

  constructor(private router: Router) {}

  goDetails(movieId: string): void {
    this.router.navigate(['/movie_details'], { queryParams: { id: movieId } });
  }

  addToCart(_movie: Movie): void {
    // UI only
    alert('Added to cart (UI only)');
  }
}