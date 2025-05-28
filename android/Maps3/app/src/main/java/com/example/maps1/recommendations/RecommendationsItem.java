package com.example.maps1.recommendations;

public class RecommendationsItem {
    private String name;
    private String address;
    private String description;
    private float rating;
    private String imageUrl;
    private String distance;
    private boolean liked;
    private String placeId;

    // Конструктор
    public RecommendationsItem(String name, String address, String description,
                               float rating, String imageUrl, String distance, String placeId, boolean liked) {
        this.name = name;
        this.address = address;
        this.description = description;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.distance = distance;
        this.placeId = placeId;
        this.liked = liked;
    }

    // Геттеры
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getDescription() { return description; }
    public float getRating() { return rating; }
    public String getImageUrl() { return imageUrl; }
    public String getDistance() { return distance; }
    public boolean isLiked() { return liked; }
    public String getPlaceId() { return placeId; }

    // Сеттеры
    public void setLiked(boolean liked) { this.liked = liked; }
}