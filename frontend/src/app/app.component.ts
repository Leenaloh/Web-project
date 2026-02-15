import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private http: HttpClient) {}

    private call(
    method: HttpMethod,
    url: string,
    body?: unknown,
    useCreds = false
  ) {
    const options: { withCredentials: boolean } = { withCredentials: useCreds };

    const req =
      method === 'GET' ? this.http.get(url, options) :
      method === 'POST' ? this.http.post(url, body ?? {}, options) :
      method === 'PUT' ? this.http.put(url, body ?? {}, options) :
      this.http.delete(url, options);

    req.subscribe({
      next: () => alert(`METHOD: ${method}\nURL: ${url}`),
      error: () => alert(`METHOD: ${method}\nURL: ${url}`),
    });
  }


  testBackend() {
    const url = `${environment.apiUrl}/api/v1/movies/test`;

    this.http.get(url, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          alert(`MESSAGE FROM BACKEND:\n${res}`);
        },
        error: (err) => {
          alert(`ERROR: ${err.status}`);
        }
      });
  }


  listMovies() {
    this.call('GET', `${environment.apiUrl}/api/v1/movies?page=1&pageSize=20`, null, false);
  }

  browseGenre() {
    this.call(
      'GET',
      `${environment.apiUrl}/api/v1/movies/browseByGenre?genreId=1&page=1&pageSize=20`,
      null,
      false
    );
  }

  browseFirstLetter() {
    this.call(
      'GET',
      `${environment.apiUrl}/api/v1/movies/browseByFirstLetter?startsWith=A&page=1&pageSize=20`,
      null,
      false
    );
  }

  viewMovieById() {
    this.call('GET', `${environment.apiUrl}/api/v1/movies/1`, null, false);
  }

  viewStar() {
    // needs an id; using "1" just as a placeholder id
    this.call('GET', `${environment.apiUrl}/api/v1/stars/1`, null, false);
  }

  signIn() {
    this.call(
      'POST',
      `${environment.apiUrl}/api/v1/auth/login`,
      { username: 'test', password: 'test' },
      true
    );
  }

  whoAmI() {
    this.call('GET', `${environment.apiUrl}/api/v1/auth/me`, null, true);
  }

  signOut() {
    this.call('POST', `${environment.apiUrl}/api/v1/auth/logout`, {}, true);
  }

  openCart() {
    this.call('GET', `${environment.apiUrl}/api/v1/cart`, null, true);
  }

  addCartItem() {
    this.call(
      'POST',
      `${environment.apiUrl}/api/v1/cart/items?movieId=tt016371&quantity=1`,
      {},
      true
    );
  }
  updateCartQuantity() {
    this.call(
      'PUT',
      `${environment.apiUrl}/api/v1/cart/items?movieId=tt016371&quantity=3`,
      {},
      true
    );
  }

  removeCartItem() {
    this.call(
      'DELETE',
      `${environment.apiUrl}/api/v1/cart/items/tt016371`,
      null,
      true
    );
  }


  clearShoppingCart() {
    this.call('DELETE', `${environment.apiUrl}/api/v1/cart`, null, true);
  }

  checkoutCart() {
    this.call(
      'POST',
      `${environment.apiUrl}/api/v1/cart/checkout`,
      {},   // empty body
      true
    );
  }

}