import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-star-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './star_details.html',
  styleUrls: ['./star_details.css'],
})
export class StarDetailsComponent {
  star = { id: 'nm001', name: 'Francisco Reyes', birthYear: 1954 };

  movies = [
    { id: 'tt001', title: 'The Wandering Soap Opera' },
    { id: 'tt010', title: 'El Nominado' },
    { id: 'tt020', title: 'Buscando a la señorita Hyde' },
  ];

  constructor(private router: Router) {}

  goMovie(movieId: string): void {
    this.router.navigate(['/movie_details'], { queryParams: { id: movieId } });
  }
}