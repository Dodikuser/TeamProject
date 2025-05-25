package com.example.maps1.recommendations;

public class RecommendationsItem {
    private String id;
    private String name;
    private String address;
    private String description;
    private float rating;
    private String imageUrl;
    private double latitude;
    private double longitude;

    public RecommendationsItem(String id, String name, String address,
                               String description, float rating,
                               String imageUrl, double latitude, double longitude) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.description = description;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getDescription() { return description; }
    public float getRating() { return rating; }
    public String getImageUrl() { return imageUrl; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
}