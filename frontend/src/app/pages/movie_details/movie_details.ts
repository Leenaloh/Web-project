import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; 
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MoviesService, Movie } from '../../services/movieService/movieService';
import { CartService } from '../../services/cartService/cartService';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie_details.html',
  styleUrls: ['./movie_details.css'],
})
export class MovieDetailsComponent implements OnInit {
  isMenuOpen = false;
  qty = 1;
  movie: Movie | null = null;
  error = '';
  success = '';
  addError = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private cartService: CartService,
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
        error: (err: unknown) => {
          console.error(err);
          this.error = 'Movie not found or failed to load.';
        }
      });
    }
  });
}

  inc(): void { this.qty += 1; }
  dec(): void { if (this.qty > 1) this.qty -= 1; }

  add(): void {
    if (!this.movie?.id) {
      this.addError = 'Unable to add this movie to cart.';
      this.success = '';
      return;
    }

    this.cartService.rememberMovieTitle(this.movie.id, this.movie.title);
    this.cartService.addItem(this.movie.id, this.qty).subscribe({
      next: () => {
        this.success = `Added ${this.qty} item(s) to cart`;
        this.addError = '';
      },
      error: (err: unknown) => {
        console.error('Failed to add item to cart', err);
        this.addError = 'Failed to add item to cart.';
        this.success = '';
      }
    });
  }

  goStar(starId: string): void {
    this.router.navigate(['/star_details'], { queryParams: { id: starId } });
  }

  goBack(): void {
    this.location.back();
  }
}
