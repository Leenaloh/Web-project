import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  useremail: string;
  password: string;
}

export interface LoginResponse {
  status?: string;
  message?: string;
  userId?: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = '/api/v1/auth';

  constructor(private http: HttpClient) {}

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, body, {
      withCredentials: true,
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.base}/logout`, {}, {
      withCredentials: true,
    });
  }

  me(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(`${this.base}/me`, {
      withCredentials: true,
    });
  }
}