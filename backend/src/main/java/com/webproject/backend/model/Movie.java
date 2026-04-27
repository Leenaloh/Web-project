package com.webproject.backend.model;

import java.util.List;

public class Movie {

  private String id;
  private String title;
  private Integer year;
  private String director;
  private Double rating;
  private Double rentalPrice;
  private List<String> genres;
  private List<Star> stars;

  public Movie() {}

  public Movie(
      String id,
      String title,
      Integer year,
      String director,
      Double rating,
      Double rentalPrice,
      List<String> genres,
      List<Star> stars) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.director = director;
    this.rating = rating;
    this.rentalPrice = rentalPrice;
    this.genres = genres;
    this.stars = stars;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Integer getYear() {
    return year;
  }

  public void setYear(Integer year) {
    this.year = year;
  }

  public String getDirector() {
    return director;
  }

  public void setDirector(String director) {
    this.director = director;
  }

  public Double getRating() {
    return rating;
  }

  public void setRating(Double rating) {
    this.rating = rating;
  }

  public Double getRentalPrice() {
    return rentalPrice;
  }

  public void setRentalPrice(Double rentalPrice) {
    this.rentalPrice = rentalPrice;
  }

  public List<String> getGenres() {
    return genres;
  }

  public void setGenres(List<String> genres) {
    this.genres = genres;
  }

  public List<Star> getStars() {
    return stars;
  }

  public void setStars(List<Star> stars) {
    this.stars = stars;
  }
}
