package com.webproject.backend.service.impl;

import com.webproject.backend.model.CartItem;
import com.webproject.backend.model.CartState;
import com.webproject.backend.model.CheckoutRequest;
import com.webproject.backend.model.CheckoutResponse;
import com.webproject.backend.movie.entity.Customer;
import com.webproject.backend.movie.entity.Movie;
import com.webproject.backend.movie.entity.Repository.CartItemRepository;
import com.webproject.backend.movie.entity.Repository.CustomerRepository;
import com.webproject.backend.movie.entity.Repository.MovieRepository;
import com.webproject.backend.service.serviceInterface.CartService;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CartServiceImpl implements CartService {
  private final HttpSession session;
  private final CartItemRepository cartItemRepository;
  private final MovieRepository movieRepository;
  private final CustomerRepository customerRepository;

  public CartServiceImpl(
      HttpSession session,
      CartItemRepository cartItemRepository,
      MovieRepository movieRepository,
      CustomerRepository customerRepository) {
    this.session = session;
    this.cartItemRepository = cartItemRepository;
    this.movieRepository = movieRepository;
    this.customerRepository = customerRepository;
  }

  @Override
  @Transactional(readOnly = true)
  public CartState getCart() {
    Integer customerId = getCurrentCustomerId();
    ensureCustomerExists(customerId);
    return snapshot(cartItemRepository.findAllByCustomerId(customerId));
  }

  @Override
  @Transactional
  public CartState addItem(String movieId, int quantity) {
    validateMovieId(movieId);
    validatePositiveQuantity(quantity);

    Customer customer = getCurrentCustomer();
    Movie movie = getMovie(movieId);
    com.webproject.backend.movie.entity.CartItem existing =
        cartItemRepository.findByCustomerIdAndMovieId(customer.getId(), movieId).orElse(null);

    if (existing == null) {
      cartItemRepository.save(
          new com.webproject.backend.movie.entity.CartItem(customer, movie, quantity));
    } else {
      existing.setQuantity(existing.getQuantity() + quantity);
      cartItemRepository.save(existing);
    }

    return getCart();
  }

  @Override
  @Transactional
  public CartState updateItemQuantity(String movieId, int quantity) {
    validateMovieId(movieId);
    validatePositiveQuantity(quantity);

    Customer customer = getCurrentCustomer();
    Movie movie = getMovie(movieId);
    com.webproject.backend.movie.entity.CartItem existing =
        cartItemRepository.findByCustomerIdAndMovieId(customer.getId(), movieId).orElse(null);

    if (existing == null) {
      cartItemRepository.save(
          new com.webproject.backend.movie.entity.CartItem(customer, movie, quantity));
    } else {
      existing.setQuantity(quantity);
      cartItemRepository.save(existing);
    }

    return getCart();
  }

  @Override
  @Transactional
  public CartState removeItem(String movieId) {
    validateMovieId(movieId);

    Integer customerId = getCurrentCustomerId();
    cartItemRepository
        .findByCustomerIdAndMovieId(customerId, movieId)
        .ifPresent(cartItemRepository::delete);
    return getCart();
  }

  @Override
  @Transactional
  public CartState clearCart() {
    Integer customerId = getCurrentCustomerId();
    cartItemRepository.deleteByCustomerId(customerId);
    return new CartState();
  }

  @Override
  @Transactional
  public CheckoutResponse checkout(CheckoutRequest request) {
    Integer customerId = getCurrentCustomerId();
    List<com.webproject.backend.movie.entity.CartItem> customerCartItems =
        cartItemRepository.findAllByCustomerId(customerId);

    if (customerCartItems.isEmpty()) {
      throw new IllegalStateException("Cannot checkout with an empty cart");
    }

    CartState currentCart = snapshot(customerCartItems);
    cartItemRepository.deleteByCustomerId(customerId);
    return new CheckoutResponse(
        true, "Order placed", UUID.randomUUID().toString(), currentCart.getTotalPrice());
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

  private Integer getCurrentCustomerId() {
    Object customerId = session.getAttribute("customerId");

    if (customerId instanceof Integer integerId) {
      return integerId;
    }

    if (customerId instanceof String stringId) {
      try {
        return Integer.valueOf(stringId);
      } catch (NumberFormatException ex) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid customer session");
      }
    }

    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Customer is not logged in");
  }

  private Customer getCurrentCustomer() {
    Integer customerId = getCurrentCustomerId();
    return customerRepository
        .findById(customerId)
        .orElseThrow(() -> new NoSuchElementException("Customer not found"));
  }

  private void ensureCustomerExists(Integer customerId) {
    customerRepository
        .findById(customerId)
        .orElseThrow(() -> new NoSuchElementException("Customer not found"));
  }

  private Movie getMovie(String movieId) {
    return movieRepository
        .findById(movieId)
        .orElseThrow(() -> new NoSuchElementException("Movie not found"));
  }

  private CartState snapshot(List<com.webproject.backend.movie.entity.CartItem> persistedItems) {
    List<CartItem> items =
        persistedItems.stream()
            .map(
                item -> {
                  double unitPrice = 0;
                  double subtotal = 0;

                  return new CartItem(
                      item.getMovie().getId(),
                      item.getMovie().getTitle(),
                      item.getQuantity(),
                      unitPrice,
                      subtotal);
                })
            .toList();
    double totalPrice = 0;

    for (CartItem item : items) {
      totalPrice += item.getSubtotal();
    }

    return new CartState(items, totalPrice);
  }
}