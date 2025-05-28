package com.example.maps1.Favorites;

public class FavoritesItem {
    private String gmapsPlaceId;
    private String name;
    private String address;
    private String description;
    private float rating;
    private String imageUrl;
    private double latitude;
    private double longitude;
    private String distance;

    public FavoritesItem(String gmapsPlaceId, String name, String address,
                         String description, float rating,
                         String imageUrl, double latitude, double longitude, String distance) {
        this.gmapsPlaceId = gmapsPlaceId;
        this.name = name;
        this.address = address;
        this.description = description;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distance = distance;
    }

    // Getters
    public String getGmapsPlaceId() { return gmapsPlaceId; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getDescription() { return description; }
    public float getRating() { return rating; }
    public String getImageUrl() { return imageUrl; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public String getDistance() { return distance; }

    // Для обратной совместимости
    public String getId() { return gmapsPlaceId; }
}