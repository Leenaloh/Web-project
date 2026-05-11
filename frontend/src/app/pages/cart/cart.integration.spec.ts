import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CartComponent } from "./cart";
import { CartState } from "../../services/cartService/cartService";
import { environment } from "../../../environments/environment";

describe('CartComponent Integration', () => {
  let fixture: ComponentFixture<CartComponent>;
  let component: CartComponent;
  let httpMock: HttpTestingController;

  const mockCart: CartState = {
    items: [
      { cartItemId: 1, movieId: 'tt001', title: 'The Shawshank Redemption', quantity: 2 },
      { cartItemId: 2, movieId: 'tt002', title: 'The Wandering Soap Opera', quantity: 1 },
    ],
    totalPrice: 45,
  };

  beforeEach(waitForAsync(() => {
    localStorage.setItem('customerId', '1');

    TestBed.configureTestingModule({
      imports: [CartComponent, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.match(() => true).forEach(req => req.flush({}));
    httpMock.verify();
    localStorage.clear();
  });

  it('should display cart items', waitForAsync(() => {
    component.loadCart();

    const cartReq = httpMock.expectOne(`${environment.apiUrl}/api/v1/cart`);
    expect(cartReq.request.method).toBe('GET');
    cartReq.flush(mockCart);

    httpMock.match(req => req.url.includes('/api/v1/movies/')).forEach(req => {
      req.flush({
        id: 'tt001',
        title: 'The Shawshank Redemption',
        year: 1994,
        director: 'Frank Darabont'
      });
    });

    expect(component).toBeTruthy();
    expect(component.cartItems.length).toBe(2);
  }));

  it('should remove item through backend', waitForAsync(() => {
    component.loadCart();

    const cartReq = httpMock.expectOne(`${environment.apiUrl}/api/v1/cart`);
    cartReq.flush(mockCart);

    httpMock.match(req => req.url.includes('/api/v1/movies/')).forEach(req => {
      req.flush({
        id: 'tt001',
        title: 'The Shawshank Redemption',
        year: 1994,
        director: 'Frank Darabont'
      });
    });

    component.remove(component.cartItems[0]);

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/cart/items/tt001`);
    expect(req.request.method).toBe('DELETE');

    req.flush({ items: [] });

    expect(component).toBeTruthy();
  }));
});
