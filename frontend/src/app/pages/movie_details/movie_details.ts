import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; 
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MoviesService, Movie } from '../../services/movieService/movieService';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie_details.html',
  styleUrls: ['./movie_details.css'],
})
export class MovieDetailsComponent implements OnInit {
  qty = 1;
  movie: Movie | null = null;
  error = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private location: Location 
  ) {}

  ngOnInit(): void {
  this.route.queryParams.subscribe((params) => {
    
    const id = params['id']; 
    
    if (id) {
      this.moviesService.getMovieById(id).subscribe({
        next: (data: Movie) => {
          this.movie = data;
          this.error = '';
        },
        error: (err) => {
          console.error(err);
          this.error = 'Movie not found or failed to load.';
        }
      });
    }
  });
}

  inc(): void { this.qty += 1; }
  dec(): void { if (this.qty > 1) this.qty -= 1; }

  add(): void { alert(`Added ${this.qty} item(s) (UI only)`); }

  goStar(starId: string): void {
    this.router.navigate(['/star_details'], { queryParams: { id: starId } });
  }

  goBack(): void {
    this.location.back();
  }
}