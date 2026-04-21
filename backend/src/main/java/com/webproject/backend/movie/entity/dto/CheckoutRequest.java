package com.webproject.backend.movie.entity.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CheckoutRequest(
    @NotNull(message = "Customer ID is required")
        @Min(value = 1, message = "Customer ID must be greater than 0")
        Integer customerId,
    @NotBlank(message = "Credit card ID is required") String creditCardId,
    @NotBlank(message = "First name is required") String firstName,
    @NotBlank(message = "Last name is required") String lastName,
    @NotBlank(message = "Expiration date is required")
        @Pattern(
            regexp = "^\\d{4}-\\d{2}-\\d{2}$",
            message = "Expiration date must be in format YYYY-MM-DD")
        String expiration) {}
