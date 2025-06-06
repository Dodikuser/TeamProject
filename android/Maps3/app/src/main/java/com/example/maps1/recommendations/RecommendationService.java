package com.example.maps1.recommendations;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.widget.Toast;

import com.example.maps1.account.AccountFragment;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;
import okhttp3.RequestBody;

public class RecommendationService {
    private static final String BASE_URL = "https://api.aroundme.pp.ua/api";
    private static final String TAG = "RecommendationService";
    private static OkHttpClient client;

    static {
        try {
            TrustManager[] trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {
                        @Override
                        public void checkClientTrusted(X509Certificate[] chain, String authType) { }
                        @Override
                        public void checkServerTrusted(X509Certificate[] chain, String authType) { }
                        @Override
                        public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[]{}; }
                    }
            };

            SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

            client = new OkHttpClient.Builder()
                    .sslSocketFactory(sslContext.getSocketFactory(), (X509TrustManager) trustAllCerts[0])
                    .hostnameVerifier((hostname, session) -> true)  // игнорируем проверку хоста
                    .build();

        } catch (Exception e) {
            Log.e(TAG, "Error initializing OkHttpClient with trust all certificates", e);
        }
    }



    public static List<RecommendationsItem> getRecommendations(RecommendationRequest request) throws IOException {
        //AccountFragment.trustAllCertificates();
        String url = String.format("%s/ai/recommend?hashTagId=%d&radius=%d&latitude=%s&longitude=%s&tag=%s",
                BASE_URL, request.hashTagId, request.radius, request.latitude, request.longitude, request.tag);

        Request httpRequest = new Request.Builder()
                .url(url)
                .build();

        try (Response response = client.newCall(httpRequest).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }

            String responseBody = response.body().string();

            double latitude = Double.parseDouble(request.latitude);
            double longitude = Double.parseDouble(request.longitude);

            return parseRecommendations(responseBody,  latitude, longitude);
        }
    }

    private static List<RecommendationsItem> parseRecommendations(String jsonResponse, double userLat, double userLng) {
        List<RecommendationsItem> items = new ArrayList<>();

        try {
            JSONObject jsonObject = new JSONObject(jsonResponse);
            JSONArray valuesArray = jsonObject.getJSONArray("$values");

            for (int i = 0; i < valuesArray.length(); i++) {
                JSONObject place = valuesArray.getJSONObject(i);

                String name = place.optString("name", "");
                String address = place.optString("address", "");
                double latitude = place.optDouble("latitude", 0.0);
                double longitude = place.optDouble("longitude", 0.0);
                float rating = (float) place.optDouble("stars", 0.0);
                String placeId = place.optString("gmapsPlaceId", "");
                boolean liked = place.optBoolean("liked", false);

                String imageUrl = "";
                if (place.has("photo") && !place.isNull("photo")) {
                    JSONObject photo = place.getJSONObject("photo");
                    imageUrl = photo.optString("path", "");
                }

                // Calculate distance
                String distance = "N/A";
                if (latitude != 0.0 && longitude != 0.0) {
                    double dist = haversine(userLat, userLng, latitude, longitude);
                    if (dist < 1.0) {
                        distance = String.format("%.0f м", dist * 1000);
                    } else {
                        distance = String.format("%.2f км", dist);
                    }
                }

                RecommendationsItem item = new RecommendationsItem(
                        name, address, "", rating, imageUrl, distance, placeId, liked
                );
                items.add(item);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error parsing recommendations", e);
        }

        return items;
    }

    // Haversine formula to calculate distance between two lat/lng points in km
    private static double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public static void toggleLike(String placeId, boolean like, String token) throws IOException {
        AccountFragment.trustAllCertificates();
        URL url = new URL("https://api.aroundme.pp.ua/api/Favorites/action?gmapsPlaceId="
                + placeId +
                "&action=" + (like ? "Add" : "Remove"));

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + token);
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        conn.setDoOutput(true);
        conn.setDoInput(true);

        int responseCode = conn.getResponseCode();
            if (responseCode != HttpURLConnection.HTTP_OK) {
                throw new IOException("Unexpected code " + responseCode);

            }

    }



    public static class RecommendationRequest {
        public int hashTagId;
        public int radius;
        public String latitude;
        public String longitude;
        public String tag;

        public RecommendationRequest(int hashTagId, int radius, String latitude, String longitude, String tag) {
            this.hashTagId = hashTagId;
            this.radius = radius;
            this.latitude = latitude;
            this.longitude = longitude;
            this.tag = tag;
        }
    }
}