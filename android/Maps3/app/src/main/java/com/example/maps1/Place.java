package com.example.maps1;

import java.util.List;
import com.google.android.gms.maps.model.LatLng;
public class Place {
    private String id;
    private String name;
    private String address;
    private String description;
    private double rating;
    private String phone;
    private String hours;
    private String email;
    private List<String> photoUrls;
    private LatLng location;

    // Constructors, getters and setters
    public Place() {}

    public Place(String id, String name, String address, String description,
                 double rating, String phone, String hours, String email,
                 List<String> photoUrls, LatLng location) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.description = description;
        this.rating = rating;
        this.phone = phone;
        this.hours = hours;
        this.email = email;
        this.photoUrls = photoUrls;
        this.location = location;
    }

    // Add all getters and setters here
    // ...
}