import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MoviesService } from '../../services/movieService/movieService';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
})
export class HomeComponent {
  form = { title: '', year: '', director: '', starName: '' };

  genres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Adult' },
    { id: 3, name: 'Adventure' },
    { id: 4, name: 'Animation' },
    { id: 5, name: 'Biography' },
    { id: 6, name: 'Comedy' },
    { id: 7, name: 'Crime' },
    { id: 8, name: 'Documentary' },
    { id: 9, name: 'Drama' },
    { id: 10, name: 'Family' },
    { id: 11, name: 'Fantasy' },
    { id: 12, name: 'History' },
    { id: 13, name: 'Horror' },
    { id: 14, name: 'Music' },
    { id: 15, name: 'Musical' },
    { id: 16, name: 'Mystery' },
    { id: 17, name: 'Reality-TV' },
    { id: 18, name: 'Romance' },
    { id: 19, name: 'Sci-Fi' },
    { id: 20, name: 'Sport' },
    { id: 21, name: 'Thriller' },
    { id: 22, name: 'War' },
    { id: 23, name: 'Western' },
  ];

  titleChars: string[] = [
    '*', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  selectedGenreString = '';
  selectedTitleChar = '';

  titleSuggestions: string[] = [];
  showSuggestions = false;
  isLoadingSuggestions = false;
  isMenuOpen = false;

  constructor(
    private router: Router,
    private moviesService: MoviesService
  ) {}

  onTitleInput(): void {
    const value = this.form.title.trim();

    if (value.length < 2) {
      this.titleSuggestions = [];
      this.showSuggestions = false;
      return;
    }

    this.isLoadingSuggestions = true;

    this.moviesService.autocompleteTitles(value).subscribe({
      next: (results: string[]) => {
        this.titleSuggestions = results;
        this.showSuggestions = results.length > 0;
        this.isLoadingSuggestions = false;
      },
      error: () => {
        this.titleSuggestions = [];
        this.showSuggestions = false;
        this.isLoadingSuggestions = false;
      }
    });
  }

  selectSuggestion(title: string): void {
    this.form.title = title;
    this.titleSuggestions = [];
    this.showSuggestions = false;
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 150);
  }

  search(): void {
    const genreId = this.selectedGenreString ? Number(this.selectedGenreString) : null;
    const startsWith = this.selectedTitleChar || null;

    this.router.navigate(['/movie-list'], {
      queryParams: {
        title: this.form.title || null,
        year: this.form.year || null,
        director: this.form.director || null,
        starName: this.form.starName || null,
        genreId,
        startsWith,
        page: 1,
      },
    });
  }

  browseAction(): void {
    this.router.navigate(['/movie-list'], {
      queryParams: { genre: 'Action' },
    });
  }

  browseA(): void {
    this.router.navigate(['/movie-list'], {
      queryParams: { startsWith: 'A' },
    });
  }

  clear(): void {
    this.form = { title: '', year: '', director: '', starName: '' };
    this.selectedGenreString = '';
    this.selectedTitleChar = '';

    this.titleSuggestions = [];
    this.showSuggestions = false;
    this.isLoadingSuggestions = false;
  }
}