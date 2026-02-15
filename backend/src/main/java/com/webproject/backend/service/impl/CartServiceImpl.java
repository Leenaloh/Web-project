package com.webproject.backend.service.impl;

import com.webproject.backend.model.CartState;
import com.webproject.backend.model.CheckoutRequest;
import com.webproject.backend.model.CheckoutResponse;
import com.webproject.backend.service.serviceInterface.CartService;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService {

  @Override
  public CartState getCart() { // TODO implement real cart logic
    return new CartState();
  }

  @Override
  public CartState addItem(String movieId, int quantity) {
    return new CartState();
  }

  @Override
  public CartState updateItemQuantity(String movieId, int quantity) {
    return new CartState();
  }

  @Override
  public CartState removeItem(String movieId) {
    return new CartState();
  }

  @Override
  public CartState clearCart() {
    return new CartState();
  }

  @Override
  public CheckoutResponse checkout(CheckoutRequest request) {
    return new CheckoutResponse();
  }
}
