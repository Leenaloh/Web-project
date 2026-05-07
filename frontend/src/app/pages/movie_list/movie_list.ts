import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/authService/authService';
import { Movie, MoviesPageState, MoviesService } from '../../services/movieService/movieService';
import { CartService } from '../../services/cartService/cartService';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './movie_list.html',
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  page = 1;
  pageSize = 20;
  totalPages = 1;
  totalResults = 0;
  error = '';
  success = '';
  isMenuOpen = false;

  sortOption = 'none';
  pageSizeOptions = [20, 25, 50, 100];
  isPageSizeDisabled = false;

  constructor(
  private router: Router,
  private route: ActivatedRoute,
  private moviesService: MoviesService,
  private cartService: CartService,
  private authService: AuthService
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
      const sortOption = params['sort'] ?? 'none';

      this.page = page;
      this.pageSize = pageSize;
      this.sortOption = sortOption;
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
    this.totalPages = res.totalPages ?? 1;
    this.totalResults = res.totalResults ?? this.movies.length;
    this.error = '';

    if (this.totalResults <= 20) {
      this.pageSize = this.totalResults;
      this.isPageSizeDisabled = true;
    } else {
      this.pageSize = res.pageSize ?? this.pageSize;
      this.isPageSizeDisabled = false;
    }

    this.applySorting();
  }

  applySorting(): void {
    if (this.sortOption === 'none') {
      return;
    }

    this.movies = [...this.movies].sort((a, b) => {
      if (this.sortOption === 'title-asc') {
        return (a.title ?? '').localeCompare(b.title ?? '');
      }

      if (this.sortOption === 'title-desc') {
        return (b.title ?? '').localeCompare(a.title ?? '');
      }

      if (this.sortOption === 'rating-asc') {
        return Number(a.rating ?? 0) - Number(b.rating ?? 0);
      }

      if (this.sortOption === 'rating-desc') {
        return Number(b.rating ?? 0) - Number(a.rating ?? 0);
      }

      return 0;
    });
  }

  onPageSizeChange(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: 1,
        pageSize: this.pageSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: 1,
        sort: this.sortOption,
      },
      queryParamsHandling: 'merge',
    });
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
    const windowSize = 7;

    if (this.totalPages <= windowSize) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(windowSize / 2);
    let start = this.page - half;
    let end = this.page + half;

    if (start < 1) {
      start = 1;
      end = windowSize;
    }

    if (end > this.totalPages) {
      end = this.totalPages;
      start = this.totalPages - windowSize + 1;
    }

    return Array.from({ length: windowSize }, (_, i) => start + i);
  }

  logout(): void {
  this.authService.logout().subscribe({
    next: () => this.router.navigate(['/']),
    error: () => this.router.navigate(['/'])
  });
}
}