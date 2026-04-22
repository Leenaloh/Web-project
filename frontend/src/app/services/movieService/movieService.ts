import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Star {
  id: string;
  name: string;
}

export interface Movie {
  id: string;
  title: string;
  year?: number;
  director?: string;
  rating?: number;
  price?: number;
  rentalPrice?: number;
  genres?: string[];
  stars?: Star[];
}

export interface MoviesPageState {
  page: number;
  pageSize: number;
  totalResults?: number;
  totalPages?: number;
  movies: Movie[];
}

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private readonly base = 'http://localhost:8080/api/v1/movies';

  constructor(private http: HttpClient) {}

  searchMovies(opts: {
    title?: string;
    year?: number;
    director?: string;
    starName?: string;
    page?: number;
    pageSize?: number;
  }): Observable<MoviesPageState> {
    let params = new HttpParams();
    Object.entries(opts).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });

    return this.http.get<MoviesPageState>(this.base, { params });
  }

  browseByGenre(genreId: number, page = 1, pageSize = 20): Observable<MoviesPageState> {
    const params = new HttpParams()
      .set('genreId', String(genreId))
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<MoviesPageState>(`${this.base}/browseByGenre`, { params });
  }

  browseByFirstLetter(startsWith: string, page = 1, pageSize = 20): Observable<MoviesPageState> {
    const params = new HttpParams()
      .set('startsWith', startsWith)
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<MoviesPageState>(`${this.base}/browseByFirstLetter`, { params });
  }

  getMovieById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.base}/${encodeURIComponent(id)}`);
  }

  autocompleteTitles(query: string) {
    return this.http.get<string[]>(`${this.base}/autocomplete`, {
      params: { query }
    });
  }
}
