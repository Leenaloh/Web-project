package com.webproject.backend.movie.entity.controller;

import com.webproject.backend.movie.entity.dto.CartResponse;
import com.webproject.backend.movie.entity.service.CartService;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@Validated
public class MovieCartController {

  private final CartService cartService;

  public MovieCartController(CartService cartService) {
    this.cartService = cartService;
  }

  @GetMapping
  public ResponseEntity<CartResponse> getCart(
      @RequestParam @Min(value = 1, message = "Customer ID must be greater than 0")
          Integer customerId) {
    return ResponseEntity.ok(cartService.getCart(customerId));
  }

  @DeleteMapping("/items/{cartItemId}")
  public ResponseEntity<Void> removeCartItem(
      @PathVariable Long cartItemId,
      @RequestParam @Min(value = 1, message = "Customer ID must be greater than 0")
          Integer customerId) {
    cartService.removeCartItem(customerId, cartItemId);
    return ResponseEntity.noContent().build();
  }
}
