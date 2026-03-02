import { TestBed } from "@angular/core/testing";
import { CartService, CartState, CheckoutResponse } from "./cartService";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

describe("CartService", () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  const baseUrl = "/api/v1/cart";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService],
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should fetch the cart", () => {
    const mockResponse: CartState = {
      items: [
        { movieId: "tt001", title: "The Shawshank Redemption", quantity: 2, unitPrice: 10 }
      ],
      totalPrice: 20
    };

    service.getCart().subscribe((response) => {
      expect(response.items.length).toBe(1);
      expect(response.totalPrice).toBe(20);
    });

    const req = httpMock.expectOne(`${baseUrl}`);

    expect(req.request.method).toBe("GET");
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockResponse);
  });

  it("should add an item to the cart", () => {
    const mockResponse: CartState = {
      items: [{ movieId: "tt001", quantity: 3 }],
      totalPrice: 30
    };

    service.addItem("tt001", 3).subscribe((response) => {
      expect(response.items.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/items?movieId=tt001&quantity=3`);

    expect(req.request.method).toBe("POST");
    req.flush(mockResponse);
  });

  it("should update item quantity", () => {
    const mockResponse: CartState = {
      items: [{ movieId: "tt002", quantity: 5 }],
      totalPrice: 50
    };

    service.updateItemQuantity("tt002", 5).subscribe((response) => {
      expect(response.items[0].quantity).toBe(5);
    });

    const req = httpMock.expectOne(`${baseUrl}/items?movieId=tt002&quantity=5`);

    expect(req.request.method).toBe("PUT");
    req.flush(mockResponse);
  });

  it("should remove an item from the cart", () => {
    const mockResponse: CartState = {
      items: [],
      totalPrice: 0
    };

    service.removeItem("tt003").subscribe((response) => {
      expect(response.items.length).toBe(0);
    });

    const req = httpMock.expectOne(`${baseUrl}/items/tt003`);

    expect(req.request.method).toBe("DELETE");
    req.flush(mockResponse);
  });

  it("should clear the entire cart", () => {
    const mockResponse: CartState = {
      items: [],
      totalPrice: 0
    };

    service.clearCart().subscribe((response) => {
      expect(response.totalPrice).toBe(0);
    });

    const req = httpMock.expectOne(`${baseUrl}`);

    expect(req.request.method).toBe("DELETE");
    req.flush(mockResponse);
  });

  it("should process checkout", () => {
    const mockResponse: CheckoutResponse = {
      success: true,
      message: "Order placed successfully"
    };
    
    const checkoutRequest = { customerName: "Guest" };

    service.checkout(checkoutRequest).subscribe((response) => {
      expect(response.success).toBe(true);
      expect(response.message).toBe("Order placed successfully");
    });

    const req = httpMock.expectOne(`${baseUrl}/checkout`);

    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(checkoutRequest);
    req.flush(mockResponse);
  });
});
