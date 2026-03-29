package com.webproject.backend.model;

public class LoginResponse {
    private String status;
    private String message;
    private String userId;
    private String name;

    public LoginResponse() {}

    public LoginResponse(String status, String message, String userId, String name) {
        this.status = status;
        this.message = message;
        this.userId = userId;
        this.name = name;
    }

    public String getStatus() { return status; }
    public String getUserId() { return userId; }
    public String getName() { return name; }
}