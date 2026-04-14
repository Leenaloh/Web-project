package com.webproject.backend.movie.entity.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CheckoutResponse(
        String message,
        Integer customerId,
        Integer rentedMoviesCount,
        BigDecimal totalAmount,
        LocalDate saleDate
) {
}