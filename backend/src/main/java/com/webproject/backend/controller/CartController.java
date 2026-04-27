package com.webproject.backend.controller;

import com.webproject.backend.model.CartState;
import com.webproject.backend.model.CheckoutRequest;
import com.webproject.backend.model.CheckoutResponse;
import com.webproject.backend.service.serviceInterface.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

  @Autowired private CartService cartService;

  @GetMapping
  public ResponseEntity<CartState> getCart() {
    CartState cart = cartService.getCart();
    return ResponseEntity.ok(cart);
  }

  @PostMapping("/items")
  public ResponseEntity<CartState> addItem(
      @RequestParam(required = false) String movieId,
      @RequestParam(required = false, defaultValue = "1") String quantity) {

    if (movieId == null || movieId.isBlank()) {
      return ResponseEntity.badRequest().build();
    }

    int qty;
    try {
      qty = Integer.parseInt(quantity);
    } catch (NumberFormatException e) {
      return ResponseEntity.badRequest().build();
    }

    CartState updated = cartService.addItem(movieId, qty);
    return ResponseEntity.ok(updated);
  }

  @PutMapping("/items")
  public ResponseEntity<CartState> updateItemQuantity(
      @RequestParam(required = false) String movieId,
      @RequestParam(required = false) Integer quantity) {

    if (movieId == null || movieId.isBlank() || quantity == null) {
      return ResponseEntity.badRequest().build();
    }

    CartState updated = cartService.updateItemQuantity(movieId, quantity);
    return ResponseEntity.ok(updated);
  }

  @DeleteMapping("/items/{movieId}")
  public ResponseEntity<CartState> removeItem(@PathVariable String movieId) {
    CartState updated = cartService.removeItem(movieId);
    return ResponseEntity.ok(updated);
  }

  @DeleteMapping
  public ResponseEntity<CartState> clearCart() {
    CartState updated = cartService.clearCart();
    return ResponseEntity.ok(updated);
  }

  @PostMapping("/checkout")
  public ResponseEntity<CheckoutResponse> checkout(
      @RequestBody(required = false) CheckoutRequest request) {

    if (request == null) {
      return ResponseEntity.badRequest().build();
    }

    CheckoutResponse response = cartService.checkout(request);
    return ResponseEntity.ok(response);
  }
}
