package com.webproject.backend.model;

public class CheckoutResponse {

  private boolean success;
  private String message;
  private String orderId;
  private double totalPaid;

  public CheckoutResponse() {}

  public CheckoutResponse(boolean success, String message, String orderId, double totalPaid) {
    this.success = success;
    this.message = message;
    this.orderId = orderId;
    this.totalPaid = totalPaid;
  }

  public boolean isSuccess() {
    return success;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getOrderId() {
    return orderId;
  }

  public void setOrderId(String orderId) {
    this.orderId = orderId;
  }

  public double getTotalPaid() {
    return totalPaid;
  }

  public void setTotalPaid(double totalPaid) {
    this.totalPaid = totalPaid;
  }
}
