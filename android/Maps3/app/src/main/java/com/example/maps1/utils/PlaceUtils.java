package com.example.maps1.utils;

import android.content.Context;
import android.widget.Toast;

import com.example.maps1.places.MyPlace;
import com.google.android.gms.maps.model.LatLng;

import java.util.function.Consumer;

public class PlaceUtils {
    public static void fetchPlaceDetails(Context context, String placeId, Consumer<MyPlace> callback) {
        new Thread(() -> {
            try {
                java.net.URL url = new java.net.URL("https://10.0.2.2:7103/api/Place/info/?placeId=" + placeId);
                java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");

                int responseCode = conn.getResponseCode();
                if (responseCode == java.net.HttpURLConnection.HTTP_OK) {
                    java.io.InputStream is = conn.getInputStream();
                    String response = new java.util.Scanner(is).useDelimiter("\\A").next();
                    org.json.JSONObject json = new org.json.JSONObject(response);
                    org.json.JSONObject placeInfo = json.getJSONObject("placeInfo");

                    String id = placeInfo.optString("gmapsPlaceId", placeId);
                    String name = placeInfo.optString("name", "Без назви");
                    String address = placeInfo.optString("address", "Адреса не вказана");
                    String description = placeInfo.optString("description", "Опис відсутній");
                    double rating = placeInfo.optDouble("stars", 0.0);
                    String phone = placeInfo.optString("phoneNumber", "Не вказано");
                    String hours = placeInfo.optString("openingHours", "Не вказано");
                    String email = placeInfo.optString("site", "Не вказано");
                    double latitude = placeInfo.optDouble("latitude", 0.0);
                    double longitude = placeInfo.optDouble("longitude", 0.0);

                    java.util.List<String> photoUrls = new java.util.ArrayList<>();
                    if (placeInfo.has("photos")) {
                        org.json.JSONObject photosObj = placeInfo.getJSONObject("photos");
                        if (photosObj.has("$values")) {
                            org.json.JSONArray photosArr = photosObj.getJSONArray("$values");
                            for (int i = 0; i < photosArr.length(); i++) {
                                org.json.JSONObject photo = photosArr.getJSONObject(i);
                                String path = photo.optString("path", null);
                                if (path != null) photoUrls.add(path);
                            }
                        }
                    }

                    LatLng latLng = new LatLng(latitude, longitude);
                    MyPlace myPlace = new MyPlace(id, name, address, description, rating, phone, hours, email, photoUrls, latLng);

                    android.os.Handler mainHandler = new android.os.Handler(context.getMainLooper());
                    mainHandler.post(() -> callback.accept(myPlace));
                } else {
                    android.os.Handler mainHandler = new android.os.Handler(context.getMainLooper());
                    mainHandler.post(() -> Toast.makeText(context, "Помилка завантаження місця", Toast.LENGTH_SHORT).show());
                }
                conn.disconnect();
            } catch (Exception e) {
                android.os.Handler mainHandler = new android.os.Handler(context.getMainLooper());
                mainHandler.post(() -> Toast.makeText(context, "Помилка завантаження місця", Toast.LENGTH_SHORT).show());
            }
        }).start();
    }

    public static void addPlaceToHistory(Context context, String token, String placeId) {
        new Thread(() -> {
            try {
                java.net.URL url = new java.net.URL("https://10.0.2.2:7103/api/history/places/action?historyAction=Add");
                javax.net.ssl.HttpsURLConnection conn = (javax.net.ssl.HttpsURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                // Формируем тело запроса
                org.json.JSONObject body = new org.json.JSONObject();
                body.put("GmapsPlaceId", placeId);
                // Можно добавить другие поля, если нужно

                java.io.OutputStream os = conn.getOutputStream();
                byte[] input = body.toString().getBytes("utf-8");
                os.write(input, 0, input.length);
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode != java.net.HttpURLConnection.HTTP_OK) {
                    android.os.Handler mainHandler = new android.os.Handler(context.getMainLooper());
                    mainHandler.post(() -> android.widget.Toast.makeText(context, "Не вдалося додати в історію", android.widget.Toast.LENGTH_SHORT).show());
                }
                conn.disconnect();
            } catch (Exception e) {
                android.os.Handler mainHandler = new android.os.Handler(context.getMainLooper());
                mainHandler.post(() -> android.widget.Toast.makeText(context, "Помилка додавання в історію", android.widget.Toast.LENGTH_SHORT).show());
            }
        }).start();
    }
} 