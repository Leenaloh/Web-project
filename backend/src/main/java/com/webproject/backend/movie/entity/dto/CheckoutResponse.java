package com.webproject.backend.movie.entity.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CheckoutResponse(
    Integer orderId,
    String status,
    String message,
    Integer customerId,
    Integer totalItems,
    BigDecimal totalAmount,
    LocalDate saleDate) {}
