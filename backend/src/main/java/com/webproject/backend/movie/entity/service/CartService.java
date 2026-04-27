package com.webproject.backend.movie.entity.service;

import com.webproject.backend.movie.entity.CartItem;
import com.webproject.backend.movie.entity.Repository.CartItemRepository;
import com.webproject.backend.movie.entity.Repository.CustomerRepository;
import com.webproject.backend.movie.entity.dto.CartItemResponse;
import com.webproject.backend.movie.entity.dto.CartResponse;
import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

  private final CartItemRepository cartItemRepository;
  private final CustomerRepository customerRepository;

  public CartService(CartItemRepository cartItemRepository, CustomerRepository customerRepository) {
    this.cartItemRepository = cartItemRepository;
    this.customerRepository = customerRepository;
  }

  @Transactional(readOnly = true)
  public CartResponse getCart(Integer customerId) {
    customerRepository
        .findById(customerId)
        .orElseThrow(() -> new NoSuchElementException("Customer not found"));

    List<CartItem> cartItems = cartItemRepository.findAllByCustomerId(customerId);

    List<CartItemResponse> items =
        cartItems.stream()
            .map(
                item ->
                    new CartItemResponse(
                        item.getId(),
                        item.getMovie().getId(),
                        item.getMovie().getTitle(),
                        item.getMovie().getYear(),
                        item.getMovie().getDirector(),
                        item.getMovie().getRentalPrice()))
            .toList();

    BigDecimal totalAmount =
        items.stream().map(CartItemResponse::rentalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);

    return new CartResponse(customerId, items, items.size(), totalAmount, items.isEmpty());
  }

  @Transactional
  public void removeCartItem(Integer customerId, Long cartItemId) {
    CartItem cartItem =
        cartItemRepository
            .findByIdAndCustomer_Id(cartItemId, customerId)
            .orElseThrow(() -> new NoSuchElementException("Cart item not found"));

    cartItemRepository.delete(cartItem);
  }
}
