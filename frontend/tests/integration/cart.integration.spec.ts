import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { By } from "@angular/platform-browser";
import { CartComponent } from "../../src/app/pages/cart/cart";
import { CartState } from "../../src/app/services/cartService/cartService";

describe('CartComponent Integration', () => {
  let fixture: ComponentFixture<CartComponent>;
  let component: CartComponent;
  let httpMock: HttpTestingController;

  const mockCart: CartState = {
    items: [
      { movieId: 'tt001', title: 'The Shawshank Redemption', quantity: 2 },
      { movieId: 'tt002', title: 'The Wandering Soap Opera', quantity: 1 },
    ],
    totalPrice: 45,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartComponent, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should display cart items', waitForAsync(() => {
    component.loadCart();

    const req = httpMock.expectOne('/api/v1/cart');
    req.flush(mockCart);
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);
    expect(rows[0].nativeElement.textContent).toContain('The Shawshank Redemption');
  }));

  it('should remove item and update DOM', waitForAsync(() => {
    component.cart = { ...mockCart };
    fixture.detectChanges();

    const removeButton = fixture.debugElement.queryAll(By.css('button.btn-danger'))[0];
    removeButton.triggerEventHandler('click', null);

    const req = httpMock.expectOne('/api/v1/cart/items/tt001');
    req.flush({
      items: [{ movieId: 'tt002', title: 'The Wandering Soap Opera', quantity: 1 }],
      totalPrice: 25,
    });

    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);
    expect(rows[0].nativeElement.textContent).toContain('The Wandering Soap Opera');
  }));
});