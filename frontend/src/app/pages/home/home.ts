import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // 1. Add Router here
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'], 
})
export class HomeComponent {
  form = { title: '', year: '', director: '', star: '' };
  genres: string[] = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller']; 
  selectedGenre: string | null = null;
  titleChars: string[] = ['*', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // 2. Inject the Router into the constructor
  constructor(private router: Router) {}

  search(): void {
    // Navigate to movie-list and pass the whole form as query parameters
    this.router.navigate(['/movie-list'], { queryParams: this.form });
  }

  clear(): void {
    this.form = { title: '', year: '', director: '', star: '' };
  }

  browseGenre(g: string): void {
    this.selectedGenre = g;
    // Navigate and pass the genre in the URL
    this.router.navigate(['/movie-list'], { queryParams: { genre: g } });
  }

  browseTitle(c: string): void {
    // Navigate and pass the starting character in the URL
    this.router.navigate(['/movie-list'], { queryParams: { startsWith: c } });
  }
}