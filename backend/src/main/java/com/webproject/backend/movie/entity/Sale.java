package com.webproject.backend.movie.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "sales")
public class Sale {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "customerid", nullable = false)
  private Customer customer;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "movieid", nullable = false)
  private Movie movie;

  @Column(name = "saledate", nullable = false)
  private LocalDate saleDate;

  public Sale() {}

  public Sale(Customer customer, Movie movie, LocalDate saleDate) {
    this.customer = customer;
    this.movie = movie;
    this.saleDate = saleDate;
  }

  public Integer getId() {
    return id;
  }

  public Customer getCustomer() {
    return customer;
  }

  public Movie getMovie() {
    return movie;
  }

  public LocalDate getSaleDate() {
    return saleDate;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public void setCustomer(Customer customer) {
    this.customer = customer;
  }

  public void setMovie(Movie movie) {
    this.movie = movie;
  }

  public void setSaleDate(LocalDate saleDate) {
    this.saleDate = saleDate;
  }
}
