import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  form = { title: '', year: '', director: '', starName: '' };

  genres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Comedy' },
    { id: 3, name: 'Drama' },
    { id: 4, name: 'Fantasy' },
    { id: 5, name: 'Horror' },
    { id: 6, name: 'Mystery' },
    { id: 7, name: 'Romance' },
    { id: 8, name: 'Sci-Fi' },
    { id: 9, name: 'Thriller' },
  ];

  selectedGenre: number | null = null;

  titleChars: string[] = [
    '*', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  constructor(private router: Router) {}

  search(): void {
    this.router.navigate(['/movie-list'], {
      queryParams: {
        title: this.form.title || null,
        year: this.form.year || null,
        director: this.form.director || null,
        starName: this.form.starName || null,
        page: 1,
        pageSize: 20,
      },
    });
  }

  clear(): void {
    this.form = { title: '', year: '', director: '', starName: '' };
  }

  browseGenre(genreId: number): void {
    this.selectedGenre = genreId;
    this.router.navigate(['/movie-list'], {
      queryParams: { genreId, page: 1, pageSize: 20 },
    });
  }

  browseTitle(c: string): void {
    this.router.navigate(['/movie-list'], {
      queryParams: { startsWith: c, page: 1, pageSize: 20 },
    });
  }
}