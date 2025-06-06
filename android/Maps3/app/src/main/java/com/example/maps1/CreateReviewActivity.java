package com.example.maps1;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class CreateReviewActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_review);

        // Отримуємо дані про місце
        String placeName = getIntent().getStringExtra("place_name");
        String placeId = getIntent().getStringExtra("place_id");
        String gmapId = getIntent().getStringExtra("gmap_id");

        // Ініціалізуємо елементи UI
        Button btnBack = findViewById(R.id.btn_back);
        Button btnCancel = findViewById(R.id.btn_cancel);
        Button btnSubmit = findViewById(R.id.btn_submit);
        Button btnAddPhoto = findViewById(R.id.btn_add_photo);
        TextView tvPlaceName = findViewById(R.id.tv_place_name);
        RatingBar ratingBar = findViewById(R.id.rating_bar);
        RatingBar ratingPrice = findViewById(R.id.rating_price);
        RatingBar ratingQuality = findViewById(R.id.rating_quality);
        RatingBar ratingDistance = findViewById(R.id.rating_distance);
        RatingBar ratingCrowd = findViewById(R.id.rating_crowd);
        RatingBar ratingInfrastructure = findViewById(R.id.rating_infrastructure);
        EditText etReviewText = findViewById(R.id.et_review_text);

        // Встановлюємо значення
        tvPlaceName.setText(placeName);

        // Делаем рейтинги кликабельными
        ratingBar.setIsIndicator(false);
        ratingPrice.setIsIndicator(false);
        ratingQuality.setIsIndicator(false);
        ratingDistance.setIsIndicator(false);
        ratingCrowd.setIsIndicator(false);
        ratingInfrastructure.setIsIndicator(false);

        // Обробники кліків
        btnBack.setOnClickListener(v -> finish());
        btnCancel.setOnClickListener(v -> finish());
        btnSubmit.setOnClickListener(v -> {
            String reviewText = etReviewText.getText().toString();
            if (reviewText.isEmpty()) {
                Toast.makeText(this, "Будь ласка, напишіть відгук", Toast.LENGTH_SHORT).show();
                return;
            }
            if (reviewText.length() > 250) {
                Toast.makeText(this, "Відгук не може бути довшим за 250 символів", Toast.LENGTH_SHORT).show();
                return;
            }

            int overallRating = Math.max(1, Math.min(5, Math.round(ratingBar.getRating())));
            int priceRating = Math.max(1, Math.min(5, Math.round(ratingPrice.getRating())));
            int qualityRating = Math.max(1, Math.min(5, Math.round(ratingQuality.getRating())));
            int distanceRating = Math.max(1, Math.min(5, Math.round(ratingDistance.getRating())));
            int crowdRating = Math.max(1, Math.min(5, Math.round(ratingCrowd.getRating())));
            int infrastructureRating = Math.max(1, Math.min(5, Math.round(ratingInfrastructure.getRating())));

            // Получаем токен авторизации
            android.content.SharedPreferences prefs = getSharedPreferences("app_prefs", MODE_PRIVATE);
            String token = prefs.getString("auth_token", null);
            if (token == null) {
                Toast.makeText(this, "Необхідна авторизація", Toast.LENGTH_SHORT).show();
                return;
            }

            // Формируем JSON для ReviewDTO
            org.json.JSONObject reviewJson = new org.json.JSONObject();
            try {
                reviewJson.put("text", reviewText);
                reviewJson.put("price", priceRating);
                reviewJson.put("quality", qualityRating);
                reviewJson.put("congestion", crowdRating);
                reviewJson.put("location", distanceRating);
                reviewJson.put("infrastructure", infrastructureRating);
                reviewJson.put("stars", overallRating);
                if (gmapId != null) reviewJson.put("gmapId", gmapId);
                if (placeId != null) {
                    try {
                        reviewJson.put("placeId", Long.parseLong(placeId));
                    } catch (Exception e) {
                        // Если не число — не отправляем
                    }
                }
            } catch (Exception e) {
                Toast.makeText(this, "Помилка формування відгуку", Toast.LENGTH_SHORT).show();
                return;
            }

            // Отключаем проверку сертификата и отправляем POST
            new Thread(() -> {
                try {
                    javax.net.ssl.TrustManager[] trustAllCerts = new javax.net.ssl.TrustManager[]{
                        new javax.net.ssl.X509TrustManager() {
                            public java.security.cert.X509Certificate[] getAcceptedIssuers() { return new java.security.cert.X509Certificate[0]; }
                            public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                            public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                        }
                    };
                    javax.net.ssl.SSLContext sc = javax.net.ssl.SSLContext.getInstance("SSL");
                    sc.init(null, trustAllCerts, new java.security.SecureRandom());
                    javax.net.ssl.HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
                    javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

                    java.net.URL url = new java.net.URL("https://app.aroundme.pp.ua/api/Review/add");
                    javax.net.ssl.HttpsURLConnection conn = (javax.net.ssl.HttpsURLConnection) url.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                    conn.setRequestProperty("Authorization", "Bearer " + token);
                    conn.setDoOutput(true);

                    java.io.OutputStream os = conn.getOutputStream();
                    byte[] input = reviewJson.toString().getBytes("utf-8");
                    os.write(input, 0, input.length);
                    os.close();

                    int responseCode = conn.getResponseCode();
                    if (responseCode == 200 || responseCode == 201) {
                        runOnUiThread(() -> {
                            Toast.makeText(this, "Відгук успішно додано", Toast.LENGTH_SHORT).show();
                            finish();
                        });
                    } else {
                        java.io.InputStream errorStream = conn.getErrorStream();
                        String errorMsg = "";
                        if (errorStream != null) {
                            java.util.Scanner s = new java.util.Scanner(errorStream).useDelimiter("\\A");
                            errorMsg = s.hasNext() ? s.next() : "";
                        }
                        String finalErrorMsg = errorMsg;
                        runOnUiThread(() -> Toast.makeText(this, "Помилка сервера: " + responseCode + "\n" + finalErrorMsg, Toast.LENGTH_LONG).show());
                    }
                    conn.disconnect();
                } catch (Exception e) {
                    runOnUiThread(() -> Toast.makeText(this, "Помилка відправки: " + e.getMessage(), Toast.LENGTH_LONG).show());
                }
            }).start();
        });
        btnAddPhoto.setOnClickListener(v -> {
            // Тут буде логіка додавання фото/відео
            Toast.makeText(this, "Додавання фото/відео", Toast.LENGTH_SHORT).show();
        });
    }
}