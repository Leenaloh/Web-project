package com.webproject.backend.service.impl;

import com.webproject.backend.model.CartItem;
import com.webproject.backend.model.CartState;
import com.webproject.backend.model.CheckoutRequest;
import com.webproject.backend.model.CheckoutResponse;
import com.webproject.backend.service.serviceInterface.CartService;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService {
  private final Map<String, CartItem> cartItems = new LinkedHashMap<>();

  @Override
  public synchronized CartState getCart() {
    return snapshot();
  }

  @Override
  public synchronized CartState addItem(String movieId, int quantity) {
    validateMovieId(movieId);
    validatePositiveQuantity(quantity);

    CartItem existing = cartItems.get(movieId);
    if (existing == null) {
      cartItems.put(movieId, buildCartItem(movieId, quantity));
    } else {
      existing.setQuantity(existing.getQuantity() + quantity);
      updateSubtotal(existing);
    }

    return snapshot();
  }

  @Override
  public synchronized CartState updateItemQuantity(String movieId, int quantity) {
    validateMovieId(movieId);
    validatePositiveQuantity(quantity);

    CartItem existing = cartItems.get(movieId);
    if (existing == null) {
      cartItems.put(movieId, buildCartItem(movieId, quantity));
    } else {
      existing.setQuantity(quantity);
      updateSubtotal(existing);
    }

    return snapshot();
  }

  @Override
  public synchronized CartState removeItem(String movieId) {
    validateMovieId(movieId);
    cartItems.remove(movieId);
    return snapshot();
  }

  @Override
  public synchronized CartState clearCart() {
    cartItems.clear();
    return snapshot();
  }

  @Override
  public synchronized CheckoutResponse checkout(CheckoutRequest request) {
    if (cartItems.isEmpty()) {
      throw new IllegalStateException("Cannot checkout with an empty cart");
    }

    CartState currentCart = snapshot();
    cartItems.clear();
    return new CheckoutResponse(
        true,
        "Order placed",
        UUID.randomUUID().toString(),
        currentCart.getTotalPrice());
  }

  private void validateMovieId(String movieId) {
    if (movieId == null || movieId.isBlank()) {
      throw new IllegalArgumentException("movieId is required");
    }
  }

  private void validatePositiveQuantity(int quantity) {
    if (quantity <= 0) {
      throw new IllegalArgumentException("Quantity must be greater than zero");
    }
  }

  private CartItem buildCartItem(String movieId, int quantity) {
    CartItem item = new CartItem();
    item.setMovieId(movieId);
    item.setTitle(movieId);
    item.setUnitPrice(0);
    item.setQuantity(quantity);
    updateSubtotal(item);
    return item;
  }

  private void updateSubtotal(CartItem item) {
    item.setSubtotal(item.getUnitPrice() * item.getQuantity());
  }

  private CartState snapshot() {
    List<CartItem> items = new ArrayList<>();
    double totalPrice = 0;

    for (CartItem item : cartItems.values()) {
      CartItem copy =
          new CartItem(
              item.getMovieId(),
              item.getTitle(),
              item.getQuantity(),
              item.getUnitPrice(),
              item.getSubtotal());
      items.add(copy);
      totalPrice += copy.getSubtotal();
    }

    return new CartState(items, totalPrice);
  }
}
