package com.webproject.backend.model;

public class CartItem {

  private String movieId;
  private String title;
  private int quantity;
  private double unitPrice;
  private double subtotal;

  public CartItem() {}

  public CartItem(String movieId, String title, int quantity, double unitPrice, double subtotal) {
    this.movieId = movieId;
    this.title = title;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.subtotal = subtotal;
  }

  public String getMovieId() {
    return movieId;
  }

  public void setMovieId(String movieId) {
    this.movieId = movieId;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public int getQuantity() {
    return quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public double getUnitPrice() {
    return unitPrice;
  }

  public void setUnitPrice(double unitPrice) {
    this.unitPrice = unitPrice;
  }

  public double getSubtotal() {
    return subtotal;
  }

  public void setSubtotal(double subtotal) {
    this.subtotal = subtotal;
  }
}
