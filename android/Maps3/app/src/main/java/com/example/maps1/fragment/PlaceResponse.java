package com.example.maps1.fragment;

public class PlaceResponse {
    public String name;
    public double longitude;
    public double latitude;
    public String address;
    public String gmapsPlaceId;
    public Photo photo;
    public double stars;
    public boolean isFavorite;

    public static class Photo {
        public String path;
        public int placeId;
    }
}
