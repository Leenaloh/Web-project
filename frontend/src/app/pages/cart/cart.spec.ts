import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CartComponent } from "./cart";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { CartService, CartState } from "../../services/cartService/cartService";

describe("CartComponent", () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;

  const mockInitialCart: CartState = {
    items: [
      { movieId: "tt001", title: "The Shawshank Redemption", quantity: 2 },
      { movieId: "tt002", title: "The Wandering Soap Opera", quantity: 1 }
    ],
    totalPrice: 45
  };

  const mockEmptyCart: CartState = {
    items: [],
    totalPrice: 0
  };

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj("CartService", [
      "getCart",
      "removeItem",
      "clearCart",
      "checkout"
    ]);

    await TestBed.configureTestingModule({
      imports: [CartComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  it("should load cart items from service", () => {
    mockCartService.getCart.and.returnValue(of(mockInitialCart));

    fixture.detectChanges(); 

    expect(mockCartService.getCart).toHaveBeenCalled();
    expect(component.cart.items.length).toBe(2);
    expect(component.cart.items[0].title).toBe("The Shawshank Redemption");
  });

  it("should call removeItem on the service and update state", () => {
    mockCartService.getCart.and.returnValue(of(mockInitialCart));
    fixture.detectChanges(); 

    const cartAfterRemoval: CartState = {
      items: [{ movieId: "tt002", title: "The Wandering Soap Opera", quantity: 1 }],
      totalPrice: 15
    };
    mockCartService.removeItem.and.returnValue(of(cartAfterRemoval));

    component.remove("tt001");

    expect(mockCartService.removeItem).toHaveBeenCalledWith("tt001");
    expect(component.cart.items.length).toBe(1);
    expect(component.cart.items[0].movieId).toBe("tt002");
  });

  it("should call clearCart on the service and empty the items", () => {
    mockCartService.getCart.and.returnValue(of(mockInitialCart));
    fixture.detectChanges();

    mockCartService.clearCart.and.returnValue(of(mockEmptyCart));

    component.clear();

    expect(mockCartService.clearCart).toHaveBeenCalled();
    expect(component.cart.items.length).toBe(0);
  });

  it("should call checkout on the service and clear cart on success", () => {
    mockCartService.getCart.and.returnValue(of(mockInitialCart));
    fixture.detectChanges();
    spyOn(window, "alert");

    const mockCheckoutResponse = { success: true, message: "Order placed" };
    mockCartService.checkout.and.returnValue(of(mockCheckoutResponse));

    component.checkout();

    expect(mockCartService.checkout).toHaveBeenCalledWith({ customerName: "Guest" });
    expect(window.alert).toHaveBeenCalledWith("Checkout successful: Order placed");
    expect(component.cart.items.length).toBe(0); 
  });
});
