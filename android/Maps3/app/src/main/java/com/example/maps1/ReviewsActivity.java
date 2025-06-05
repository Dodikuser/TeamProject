package com.example.maps1;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageButton; // Додано імпорт
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.Spinner;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.util.Arrays;
import java.util.List;
import okhttp3.*;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import android.widget.Toast;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

public class ReviewsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_review);

        // Отримуємо дані про місце
        String placeName = getIntent().getStringExtra("place_name");
        double rating = getIntent().getDoubleExtra("place_rating", 3.5);
        int reviewsCount = getIntent().getIntExtra("reviews_count", 267);
        String placeId = getIntent().getStringExtra("place_id");
        String gmapId = getIntent().getStringExtra("gmap_id");

        // Ініціалізуємо елементи UI (змінений тип для btnBack)
        ImageButton btnBack = findViewById(R.id.btn_back); // Тепер ImageButton
        Button btnAddReview = findViewById(R.id.btn_add_review);
        TextView tvRating = findViewById(R.id.tv_rating);
        RatingBar ratingBar = findViewById(R.id.rating_bar);
        TextView tvReviewsCount = findViewById(R.id.tv_reviews_count);
        Spinner spinnerSort = findViewById(R.id.spinner_sort);
        LinearLayout reviewsContainer = findViewById(R.id.reviews_container);

        // Встановлюємо значення
        tvRating.setText(String.format("%.1f", rating));
        ratingBar.setRating((float) rating);
        tvReviewsCount.setText(String.format("Відгуків: %d", reviewsCount));

        // Налаштовуємо спінер для сортування
        List<String> sortOptions = Arrays.asList(
                "Найновіші",
                "Найстаріші",
                "Найвища оцінка",
                "Найнижча оцінка"
        );
        ArrayAdapter<String> adapter = new ArrayAdapter<>(
                this,
                android.R.layout.simple_spinner_item,
                sortOptions
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerSort.setAdapter(adapter);

        // Загружаем отзывы с сервера
        if (placeId != null && !placeId.isEmpty()) {
            loadReviewsFromServer(placeId, reviewsContainer);
        }

        // Обробники кліків
        btnBack.setOnClickListener(v -> finish());
        btnAddReview.setOnClickListener(v -> {
            Intent intent = new Intent(ReviewsActivity.this, CreateReviewActivity.class);
            intent.putExtra("place_name", placeName);
            intent.putExtra("place_id", placeId);
            intent.putExtra("gmap_id", gmapId);
            startActivity(intent);
        });
    }
    private OkHttpClient getUnsafeOkHttpClient() {
        try {
            // Создаём доверенный менеджер, который ничего не проверяет
            final TrustManager[] trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {
                        @Override
                        public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) {}

                        @Override
                        public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) {}

                        @Override
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                            return new java.security.cert.X509Certificate[]{};
                        }
                    }
            };

            final SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

            final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

            OkHttpClient.Builder builder = new OkHttpClient.Builder();
            builder.sslSocketFactory(sslSocketFactory, (X509TrustManager) trustAllCerts[0]);
            builder.hostnameVerifier((hostname, session) -> true); // х*й на имя хоста

            return builder.build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void loadReviewsFromServer(String placeId, LinearLayout container) {

        SharedPreferences prefs = getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);
        if (token == null) {
            runOnUiThread(() -> Toast.makeText(ReviewsActivity.this, "Необходима авторизация", Toast.LENGTH_SHORT).show());
            return;
        }
        OkHttpClient client = getUnsafeOkHttpClient();
        String url = "https://10.0.2.2:7103/api/Review/get?placeId=" + placeId + "&skip=0&take=10";

        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + token)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                runOnUiThread(() -> Toast.makeText(ReviewsActivity.this, "Помилка завантаження відгуків", Toast.LENGTH_SHORT).show());
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    String json = response.body().string();
                    JsonObject root = JsonParser.parseString(json).getAsJsonObject();
                    JsonArray values = root.getAsJsonArray("$values");
                    Type listType = new TypeToken<ArrayList<ReviewDTO>>(){}.getType();
                    ArrayList<ReviewDTO> reviews = new Gson().fromJson(values, listType);

                    runOnUiThread(() -> {
                        container.removeAllViews();
                        for (ReviewDTO review : reviews) {
                            View reviewView = getLayoutInflater().inflate(R.layout.item_review, container, false);
                            TextView tvAuthor = reviewView.findViewById(R.id.tv_author);
                            TextView tvText = reviewView.findViewById(R.id.tv_text);
                            RatingBar ratingBar = reviewView.findViewById(R.id.rating_bar);
                            TextView tvDate = reviewView.findViewById(R.id.tv_date);

                            tvAuthor.setText(review.userName);
                            tvText.setText(review.text);
                            ratingBar.setRating(review.stars);
                            tvDate.setText(review.reviewDateTime);

                            container.addView(reviewView);
                        }
                    });
                } else {
                    runOnUiThread(() -> Toast.makeText(ReviewsActivity.this, "Помилка сервера: " + response.code(), Toast.LENGTH_SHORT).show());
                }
            }
        });
    }

    // Модель для ReviewDTO
    public static class ReviewDTO {
        public String text;
        public int price;
        public int quality;
        public int congestion;
        public int location;
        public int infrastructure;
        public int stars;
        public String reviewDateTime;
        public String gmapId;
        public long placeId;
        public long userId;
        public String userName;
        public PhotoDTO photo;
    }
    public static class PhotoDTO {
        public String path;
        public long placeId;
    }
}