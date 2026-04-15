package com.webproject.backend.controller;

import com.webproject.backend.model.CartState;
import com.webproject.backend.model.CheckoutRequest;
import com.webproject.backend.model.CheckoutResponse;
import com.webproject.backend.service.serviceInterface.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cart")
public class CartControllerOld {

  @Autowired private CartService cartService;

  /**
   * Get the current shopping cart state for the current user/session.
   *
   * @return CartState containing cart items, quantities, and total price
   */
  @GetMapping
  public ResponseEntity<CartState> getCart() {
    CartState cart = cartService.getCart();
    return ResponseEntity.ok(cart);
  }

  /**
   * Add a movie item to the cart (or increase quantity if it already exists).
   *
   * @param movieId unique identifier of the movie to add
   * @param quantity quantity to add (default is 1)
   * @return CartState representing the updated cart
   */
  @PostMapping("/items")
  public ResponseEntity<CartState> addItem(
      @RequestParam String movieId, @RequestParam(defaultValue = "1") int quantity) {
    CartState updated = cartService.addItem(movieId, quantity);
    return ResponseEntity.ok(updated);
  }

  /**
   * Update the quantity of a specific movie item in the cart.
   *
   * @param movieId unique identifier of the movie
   * @param quantity new quantity to set
   * @return CartState representing the updated cart
   */
  @PutMapping("/items")
  public ResponseEntity<CartState> updateItemQuantity(
      @RequestParam String movieId, @RequestParam int quantity) {
    CartState updated = cartService.updateItemQuantity(movieId, quantity);
    return ResponseEntity.ok(updated);
  }

  /**
   * Remove a specific movie item from the cart.
   *
   * @param movieId unique identifier of the movie to remove
   * @return CartState representing the updated cart
   */
  @DeleteMapping("/items/{movieId}")
  public ResponseEntity<CartState> removeItem(@PathVariable String movieId) {
    CartState updated = cartService.removeItem(movieId);
    return ResponseEntity.ok(updated);
  }

  /**
   * Clear all items from the cart.
   *
   * @return CartState representing the empty cart
   */
  @DeleteMapping
  public ResponseEntity<CartState> clearCart() {
    CartState updated = cartService.clearCart();
    return ResponseEntity.ok(updated);
  }

  /**
   * Checkout the current cart.
   *
   * @param request checkout request containing customer/shipping/payment fields
   * @return CheckoutResponse indicating whether checkout succeeded or failed
   */
  @PostMapping("/checkout")
  public ResponseEntity<CheckoutResponse> checkout(@RequestBody CheckoutRequest request) {
    CheckoutResponse response = cartService.checkout(request);
    return ResponseEntity.ok(response);
  }
}
