package com.webproject.backend.service.serviceInterface;

import com.webproject.backend.model.CartState;
import com.webproject.backend.model.CheckoutRequest;
import com.webproject.backend.model.CheckoutResponse;

public interface CartService {
    CartState getCart();
    CartState addItem(String movieId, int quantity);
    CartState updateItemQuantity(String movieId, int quantity);
    CartState removeItem(String movieId);
    CartState clearCart();
    CheckoutResponse checkout(CheckoutRequest request);
}

