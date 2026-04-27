package com.webproject.backend.controller;

import com.webproject.backend.model.CartState;
import com.webproject.backend.model.CheckoutRequest;
import com.webproject.backend.model.CheckoutResponse;
import com.webproject.backend.service.serviceInterface.CartService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
public class CartController {

  @Autowired private CartService cartService;

  private void bindCustomerSession(HttpServletRequest request, Integer customerId) {
    if (customerId != null && customerId > 0) {
      HttpSession session = request.getSession();
      session.setAttribute("customerId", customerId);
    }
  }

  @GetMapping
  public ResponseEntity<CartState> getCart(
      @RequestParam(required = false) Integer customerId,
      HttpServletRequest request) {
    bindCustomerSession(request, customerId);
    CartState cart = cartService.getCart();
    return ResponseEntity.ok(cart);
  }

  @PostMapping("/items")
  public ResponseEntity<CartState> addItem(
      @RequestParam(required = false) Integer customerId,
      @RequestParam(required = false) String movieId,
      @RequestParam(required = false, defaultValue = "1") String quantity,
      HttpServletRequest request) {

    bindCustomerSession(request, customerId);

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
      @RequestParam(required = false) Integer customerId,
      @RequestParam(required = false) String movieId,
      @RequestParam(required = false) Integer quantity,
      HttpServletRequest request) {

    bindCustomerSession(request, customerId);

    if (movieId == null || movieId.isBlank() || quantity == null) {
      return ResponseEntity.badRequest().build();
    }

    CartState updated = cartService.updateItemQuantity(movieId, quantity);
    return ResponseEntity.ok(updated);
  }

  @DeleteMapping("/items/{movieId}")
  public ResponseEntity<CartState> removeItem(
      @PathVariable String movieId,
      @RequestParam(required = false) Integer customerId,
      HttpServletRequest request) {
    bindCustomerSession(request, customerId);
    CartState updated = cartService.removeItem(movieId);
    return ResponseEntity.ok(updated);
  }

  @DeleteMapping
  public ResponseEntity<CartState> clearCart(
      @RequestParam(required = false) Integer customerId,
      HttpServletRequest request) {
    bindCustomerSession(request, customerId);
    CartState updated = cartService.clearCart();
    return ResponseEntity.ok(updated);
  }

  @PostMapping("/checkout")
  public ResponseEntity<CheckoutResponse> checkout(
      @RequestParam(required = false) Integer customerId,
      @RequestBody(required = false) CheckoutRequest request,
      HttpServletRequest httpRequest) {

    bindCustomerSession(httpRequest, customerId);

    if (request == null) {
      return ResponseEntity.badRequest().build();
    }

    CheckoutResponse response = cartService.checkout(request);
    return ResponseEntity.ok(response);
  }
}