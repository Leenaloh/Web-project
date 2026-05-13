package com.webproject.backend.model;

public class CheckoutRequest {

  private Integer customerId;
  private String creditCardId;
  private String firstName;
  private String lastName;
  private String expiration;

  public CheckoutRequest() {}

  // ===== customerId =====
  public Integer getCustomerId() {
    return customerId;
  }

  public void setCustomerId(Integer customerId) {
    this.customerId = customerId;
  }

  // ===== creditCardId =====
  public String getCreditCardId() {
    return creditCardId;
  }

  public void setCreditCardId(String creditCardId) {
    this.creditCardId = creditCardId;
  }

  // ===== firstName =====
  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  // ===== lastName =====
  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  // ===== expiration =====
  public String getExpiration() {
    return expiration;
  }

  public void setExpiration(String expiration) {
    this.expiration = expiration;
  }
}
