package com.webproject.backend.model;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

  @NotBlank(message = "Email is required")
  private String useremail;

  @NotBlank(message = "Password is required")
  private String password;

  public String getUseremail() { return useremail; }
  public void setUseremail(String useremail) { this.useremail = useremail; }

  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
}