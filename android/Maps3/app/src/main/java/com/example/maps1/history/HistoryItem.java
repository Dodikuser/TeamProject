package com.example.maps1.history;



public class HistoryItem {
    private String id;
    private String name;
    private String address;
    private String date;
    private String time;
    private String imageUrl;

    public HistoryItem(String id, String name, String address,
                       String date, String time, String imageUrl) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.date = date;
        this.time = time;
        this.imageUrl = imageUrl;
    }

    // Getters and setters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getDate() { return date; }
    public String getTime() { return time; }
    public String getImageUrl() { return imageUrl; }

    // Optional setters if you need them
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setAddress(String address) { this.address = address; }
    public void setDate(String date) { this.date = date; }
    public void setTime(String time) { this.time = time; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}