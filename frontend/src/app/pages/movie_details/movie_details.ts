import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

type Star = { id: string; name: string };

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie_details.html',
  styleUrls: ['./movie_details.css'],
})
export class MovieDetailsComponent {
  qty = 1;

  movie = {
    id: 'tt001',
    title: 'The Wandering Soap Opera',
    year: 2017,
    director: 'Raoul Ruiz',
    rating: 7.2,
    genres: ['Drama', 'Comedy', 'Fantasy'],
    stars: [
      { id: 'nm001', name: 'Francisco Reyes' },
      { id: 'nm002', name: 'Leo Kocking' },
      { id: 'nm003', name: 'Patricia Rivadeneira' },
    ] as Star[],
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  inc(): void { this.qty += 1; }
  dec(): void { if (this.qty > 1) this.qty -= 1; }

  add(): void { alert(`Added ${this.qty} item(s) (UI only)`); }

  goStar(starId: string): void {
    this.router.navigate(['/star_details'], { queryParams: { id: starId } });
  }
}