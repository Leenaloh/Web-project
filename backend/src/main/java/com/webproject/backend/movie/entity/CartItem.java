package com.webproject.backend.movie.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "cart_items",
    uniqueConstraints = {
      @UniqueConstraint(
          name = "uq_cart_customer_movie",
          columnNames = {"customer_id", "movie_id"})
    })
public class CartItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "customer_id", nullable = false)
  private Customer customer;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "movie_id", nullable = false)
  private Movie movie;

  @Column(nullable = false)
  private Integer quantity;

  public CartItem() {}

  public CartItem(Customer customer, Movie movie, Integer quantity) {
    this.customer = customer;
    this.movie = movie;
    this.quantity = quantity;
  }

  public Long getId() {
    return id;
  }

  public Customer getCustomer() {
    return customer;
  }

  public Movie getMovie() {
    return movie;
  }

  public Integer getQuantity() {
    return quantity;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setCustomer(Customer customer) {
    this.customer = customer;
  }

  public void setMovie(Movie movie) {
    this.movie = movie;
  }

  public void setQuantity(Integer quantity) {
    this.quantity = quantity;
  }
}
