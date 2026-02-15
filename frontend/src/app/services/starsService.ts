import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Star {
  id: string;
  name: string;
  birthYear?: number;
}

@Injectable({ providedIn: 'root' })
export class StarsService {
  private readonly base = '/api/v1/stars';

  constructor(private http: HttpClient) {}

  getStarById(id: string): Observable<Star> {
    return this.http.get<Star>(`${this.base}/${encodeURIComponent(id)}`);
  }
}