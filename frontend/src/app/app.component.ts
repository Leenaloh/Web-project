import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  backendMessage: string = '';

  constructor(private http: HttpClient) {}

  checkBackend() {
    this.http.get(`${environment.apiUrl}/api/v1/movies/test`, { responseType: 'text' })
      .subscribe({
        next: (res) => this.backendMessage = res,
        error: () => this.backendMessage = 'Error connecting to backend ❌'
      });
  }
}
