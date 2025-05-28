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
    private static final String BASE_URL = "https://10.0.2.2:7103/api";
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
        String url = String.format("%s/ai/recommend?hashTagId=%d&radius=%d&latitude=%f&longitude=%f&tag=%s",
                BASE_URL, request.hashTagId, request.radius, request.latitude, request.longitude, request.tag);

        Request httpRequest = new Request.Builder()
                .url(url)
                .build();

        try (Response response = client.newCall(httpRequest).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }

            String responseBody = response.body().string();
            return parseRecommendations(responseBody);
        }
    }

    private static List<RecommendationsItem> parseRecommendations(String jsonResponse) {
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

                // Calculate distance (placeholder for now)
                String distance = "N/A";

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

    public static void toggleLike(String placeId, boolean like, String token) throws IOException {
        AccountFragment.trustAllCertificates();
        URL url = new URL("https://10.0.2.2:7103/api/Favorites/action?gmapsPlaceId="
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
        public double latitude;
        public double longitude;
        public String tag;

        public RecommendationRequest(int hashTagId, int radius, double latitude, double longitude, String tag) {
            this.hashTagId = hashTagId;
            this.radius = radius;
            this.latitude = latitude;
            this.longitude = longitude;
            this.tag = tag;
        }
    }
}