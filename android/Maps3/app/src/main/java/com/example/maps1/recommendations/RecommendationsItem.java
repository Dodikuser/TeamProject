package com.example.maps1.recommendations;

public class RecommendationsItem {
    private String name;
    private String address;
    private String description;
    private float rating;
    private String imageUrl;
    private String distance;

    // Конструктор
    public RecommendationsItem(String name, String address, String description,
                               float rating, String imageUrl, String distance) {
        this.name = name;
        this.address = address;
        this.description = description;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.distance = distance;
    }

    // Геттеры
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getDescription() { return description; }
    public float getRating() { return rating; }
    public String getImageUrl() { return imageUrl; }
    public String getDistance() { return distance; }
}