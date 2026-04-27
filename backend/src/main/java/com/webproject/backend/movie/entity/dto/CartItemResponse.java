package com.webproject.backend.movie.entity.dto;

public record CartItemResponse(
    Long cartItemId, String movieId, String title, Integer year, String director) {}
