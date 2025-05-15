package com.example.maps1;  // Добавлено

public class AuthRequest {
    public String type;
    public String firstName;
    public String lastName;
    public String email;
    public String password;

    public AuthRequest(String type, String firstName, String lastName,
                       String email, String password) {
        this.type = type;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}