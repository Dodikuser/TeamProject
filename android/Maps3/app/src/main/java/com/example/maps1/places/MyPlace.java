package com.example.maps1.places;

import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.maps.model.LatLng;

import java.util.List;

public class MyPlace implements Parcelable {
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

    public MyPlace() {}

    public MyPlace(String id, String name, String address, String description,
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

    protected MyPlace(Parcel in) {
        id = in.readString();
        name = in.readString();
        address = in.readString();
        description = in.readString();
        rating = in.readDouble();
        phone = in.readString();
        hours = in.readString();
        email = in.readString();
        photoUrls = in.createStringArrayList();
        location = in.readParcelable(LatLng.class.getClassLoader());
    }

    public static final Creator<MyPlace> CREATOR = new Creator<MyPlace>() {
        @Override
        public MyPlace createFromParcel(Parcel in) {
            return new MyPlace(in);
        }

        @Override
        public MyPlace[] newArray(int size) {
            return new MyPlace[size];
        }
    };

    // Getters and setters for all fields
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getHours() { return hours; }
    public void setHours(String hours) { this.hours = hours; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<String> getPhotoUrls() { return photoUrls; }
    public void setPhotoUrls(List<String> photoUrls) { this.photoUrls = photoUrls; }
    public LatLng getLocation() { return location; }
    public void setLocation(LatLng location) { this.location = location; }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(id);
        dest.writeString(name);
        dest.writeString(address);
        dest.writeString(description);
        dest.writeDouble(rating);
        dest.writeString(phone);
        dest.writeString(hours);
        dest.writeString(email);
        dest.writeStringList(photoUrls);
        dest.writeParcelable(location, flags);
    }
}