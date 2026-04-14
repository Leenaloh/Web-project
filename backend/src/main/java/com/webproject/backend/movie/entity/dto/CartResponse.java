package com.webproject.backend.movie.entity.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        Integer customerId,
        List<CartItemResponse> items,
        Integer totalItems,
        BigDecimal totalAmount,
        boolean empty
) {
}