import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StarMovie {
  id: string;
  title: string;
}

export interface Star {
  id: string;
  name: string;
  birthYear?: number;
  movies?: StarMovie[];
}

@Injectable({ providedIn: 'root' })
export class StarsService {
  private readonly base = 'http://localhost:8080/api/v1/stars';

  constructor(private http: HttpClient) {}

  getStarById(id: string): Observable<Star> {
    return this.http.get<Star>(`${this.base}/${encodeURIComponent(id)}`);
  }
}