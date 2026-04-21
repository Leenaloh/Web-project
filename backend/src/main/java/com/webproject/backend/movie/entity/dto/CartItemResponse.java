package com.webproject.backend.movie.entity.dto;

import java.math.BigDecimal;

public record CartItemResponse(
    Long cartItemId,
    String movieId,
    String title,
    Integer year,
    String director,
    BigDecimal rentalPrice) {}
