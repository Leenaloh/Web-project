package com.webproject.backend.movie.entity.service;

import com.webproject.backend.movie.entity.CartItem;
import com.webproject.backend.movie.entity.CreditCard;
import com.webproject.backend.movie.entity.Customer;
import com.webproject.backend.movie.entity.Repository.CartItemRepository;
import com.webproject.backend.movie.entity.Repository.CreditCardRepository;
import com.webproject.backend.movie.entity.Repository.CustomerRepository;
import com.webproject.backend.movie.entity.Repository.SaleRepository;
import com.webproject.backend.movie.entity.Sale;
import com.webproject.backend.movie.entity.dto.CheckoutRequest;
import com.webproject.backend.movie.entity.dto.CheckoutResponse;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckoutService {

  private final CustomerRepository customerRepository;

  private final CreditCardRepository creditCardRepository;

  private final CartItemRepository cartItemRepository;

  private final SaleRepository saleRepository;

  public CheckoutService(
      CustomerRepository customerRepository,
      CreditCardRepository creditCardRepository,
      CartItemRepository cartItemRepository,
      SaleRepository saleRepository) {

    this.customerRepository = customerRepository;

    this.creditCardRepository = creditCardRepository;

    this.cartItemRepository = cartItemRepository;

    this.saleRepository = saleRepository;
  }

  @Transactional
  public CheckoutResponse checkout(CheckoutRequest request) {

    Customer customer =
        customerRepository
            .findWithCreditCardById(request.customerId())
            .orElseThrow(() -> new NoSuchElementException("Customer not found"));

    List<CartItem> cartItems = cartItemRepository.findAllByCustomerId(request.customerId());

    if (cartItems.isEmpty()) {

      throw new IllegalArgumentException("Cannot checkout because the cart is empty");
    }

    CreditCard creditCard =
        creditCardRepository
            .findById(request.creditCardId())
            .orElseThrow(() -> new IllegalArgumentException("Credit card not found"));

    validateCard(customer, creditCard, request);

    LocalDate today = LocalDate.now();

    BigDecimal totalAmount = BigDecimal.ZERO;

    int totalItems = 0;

    Integer lastSaleId = null;

    for (CartItem cartItem : cartItems) {

      Sale sale = new Sale(customer, cartItem.getMovie(), today);

      Sale savedSale = saleRepository.save(sale);

      lastSaleId = savedSale.getId();

      // totalAmount = totalAmount.add(cartItem.getMovie().getRentalPrice());

      totalItems++;

      saleRepository.save(sale);
    }

    cartItemRepository.deleteByCustomer_Id(request.customerId());

    return new CheckoutResponse(
        lastSaleId,
        "SUCCESS",
        "Checkout completed successfully",
        request.customerId(),
        totalItems,
        totalAmount,
        today);
  }

  private void validateCard(Customer customer, CreditCard creditCard, CheckoutRequest request) {

    if (!customer.getCreditCard().getId().equals(creditCard.getId())) {

      throw new IllegalArgumentException("This credit card does not belong to the customer");
    }

    if (!creditCard.getFirstName().equalsIgnoreCase(request.firstName().trim())) {

      throw new IllegalArgumentException("Credit card first name does not match");
    }

    if (!creditCard.getLastName().equalsIgnoreCase(request.lastName().trim())) {

      throw new IllegalArgumentException("Credit card last name does not match");
    }

    LocalDate expiration = LocalDate.parse(request.expiration());

    if (!creditCard.getExpiration().equals(expiration)) {

      throw new IllegalArgumentException("Credit card expiration date does not match");
    }
  }
}
