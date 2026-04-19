import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Movie, MoviesPageState, MoviesService } from '../../services/movieService/movieService';
import { CartService } from '../../services/cartService/cartService';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie_list.html',
  styleUrls: ['./movie_list.css'],
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  page = 1;
  pageSize = 20;
  totalPages = 1;
  totalResults = 0;
  error = '';
  success = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const genreId = params['genreId'];
      const startsWith = params['startsWith'];
      const title = params['title'] ?? '';
      const year = params['year'] ? Number(params['year']) : undefined;
      const director = params['director'] ?? '';
      const starName = params['starName'] ?? '';
      const page = Number(params['page'] ?? 1);
      const pageSize = Number(params['pageSize'] ?? 20);

      this.page = page;
      this.pageSize = pageSize;
      this.error = '';
      this.success = '';

      if (genreId) {
        this.moviesService.browseByGenre(Number(genreId), page, pageSize).subscribe({
          next: (res: MoviesPageState) => this.applyResponse(res),
          error: () => {
            this.movies = [];
            this.error = 'Failed to load movies by genre';
            this.totalPages = 1;
            this.totalResults = 0;
          },
        });
      } else if (startsWith) {
        this.moviesService.browseByFirstLetter(startsWith, page, pageSize).subscribe({
          next: (res: MoviesPageState) => this.applyResponse(res),
          error: () => {
            this.movies = [];
            this.error = 'Failed to load movies by first letter';
            this.totalPages = 1;
            this.totalResults = 0;
          },
        });
      } else {
        this.moviesService
          .searchMovies({
            title,
            year,
            director,
            starName,
            page,
            pageSize,
          })
          .subscribe({
            next: (res: MoviesPageState) => this.applyResponse(res),
            error: () => {
              this.movies = [];
              this.error = 'Failed to search movies';
              this.totalPages = 1;
              this.totalResults = 0;
            },
          });
      }
    });
  }

  private applyResponse(res: MoviesPageState): void {
    this.movies = res.movies ?? [];
    this.page = res.page ?? this.page;
    this.pageSize = res.pageSize ?? this.pageSize;
    this.totalPages = res.totalPages ?? 1;
    this.totalResults = res.totalResults ?? this.movies.length;
    this.error = '';
  }

  goDetails(movieId: string): void {
    this.router.navigate(['/movie_details'], { queryParams: { id: movieId } });
  }

  addToCart(movie: Movie): void {
    if (!movie.id) {
      this.error = 'Unable to add this movie to cart.';
      this.success = '';
      return;
    }

    this.cartService.rememberMovieTitle(movie.id, movie.title);
    this.cartService.addItem(movie.id, 1).subscribe({
      next: () => {
        this.success = 'Added to cart';
        this.error = '';
      },
      error: () => {
        this.error = 'Failed to add item to cart.';
        this.success = '';
      }
    });
  }

  goToPage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages || newPage === this.page) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: newPage, pageSize: this.pageSize },
      queryParamsHandling: 'merge',
    });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
