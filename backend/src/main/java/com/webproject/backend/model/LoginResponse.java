package com.webproject.backend.model;

public class LoginResponse {
    private String status;   // "success" or "error"
    private String message;  // optional
    private String userId;   // optional
    private String name;     // optional

    public LoginResponse() {}

    public LoginResponse(String status, String message, String userId, String name) {
        this.status = status;
        this.message = message;
        this.userId = userId;
        this.name = name;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}