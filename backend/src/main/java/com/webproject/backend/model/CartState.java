package com.webproject.backend.model;

import java.util.ArrayList;
import java.util.List;

public class CartState {

  private List<CartItem> items;
  private double totalPrice;

  public CartState() {
    this.items = new ArrayList<>();
    this.totalPrice = 0;
  }

  public CartState(List<CartItem> items, double totalPrice) {
    this.items = items;
    this.totalPrice = totalPrice;
  }

  public List<CartItem> getItems() {
    return items;
  }

  public void setItems(List<CartItem> items) {
    this.items = items;
  }

  public double getTotalPrice() {
    return totalPrice;
  }

  public void setTotalPrice(double totalPrice) {
    this.totalPrice = totalPrice;
  }
}
