package com.example.maps1.history;

public class HistoryItem {
    private String id;
    private String name;
    private String address;
    private String description;
    private float rating;
    private String imageUrl;

    public HistoryItem(String id, String name, String address,
                       String description, float rating, String imageUrl) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.description = description;
        this.rating = rating;
        this.imageUrl = imageUrl;
    }

    // Getters and setters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getDescription() { return description; }
    public float getRating() { return rating; }
    public String getImageUrl() { return imageUrl; }
}