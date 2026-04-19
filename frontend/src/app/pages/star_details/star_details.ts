import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StarsService } from '../../services/starsService/starsService';

@Component({
  selector: 'app-star-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './star_details.html',
  styleUrls: ['./star_details.css'],
})
export class StarDetailsComponent implements OnInit {
  star: any = { id: '', name: '', birthYear: undefined };
  movies: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private starsService: StarsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');

    if (id) {
      this.starsService.getStarById(id).subscribe({
        next: (data: any) => {
          this.star = data;
          this.movies = data.movies || [];
        },
        error: () => {
          this.star = { id: '', name: 'Star not found', birthYear: undefined };
          this.movies = [];
        },
      });
    }
  }

  goMovie(movieId: string): void {
    this.router.navigate(['/movie_details'], { queryParams: { id: movieId } });
  }
}