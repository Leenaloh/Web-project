package com.webproject.backend.movie.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "movies")
public class Movie {

  @Id private String id;

  @Column(nullable = false, length = 100)
  private String title;

  @Column(nullable = false)
  private Integer year;

  @Column(nullable = false, length = 100)
  private String director;

  @Column(name = "rental_price", nullable = false)
  private BigDecimal rentalPrice;

  public Movie() {}

  public String getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public Integer getYear() {
    return year;
  }

  public String getDirector() {
    return director;
  }

  public BigDecimal getRentalPrice() {
    return rentalPrice;
  }

  public void setId(String id) {
    this.id = id;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public void setYear(Integer year) {
    this.year = year;
  }

  public void setDirector(String director) {
    this.director = director;
  }

  public void setRentalPrice(BigDecimal rentalPrice) {
    this.rentalPrice = rentalPrice;
  }
}
