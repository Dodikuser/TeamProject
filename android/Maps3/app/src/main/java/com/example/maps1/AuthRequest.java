package com.example.maps1;  // Добавлено

public class AuthRequest {
    public String type;
    public String name;
    public String email;
    public String password;

    public AuthRequest(String type, String name, String email, String password) {
        this.type = type;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}