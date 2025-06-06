package com.example.maps1;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.example.maps1.places.MyPlace;
import com.example.maps1.utils.PlaceUtils;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.example.maps1.Favorites.FavoritesHelper;

public class PlaceDetailsActivity extends AppCompatActivity {
    private MyPlace place;
    private TextView placeHours;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_place_details);

        BottomNavigationView bottomNav = findViewById(R.id.bottom_navigation);
        bottomNav.setOnItemSelectedListener(this::handleNavigationItemSelected);

        placeHours = findViewById(R.id.place_hours);

        place = getIntent().getParcelableExtra("place");
        if (place == null) {
            finish();
            return;
        }

        // Ініціалізація View
        ImageView mainPhoto = findViewById(R.id.main_photo);
        TextView placeName = findViewById(R.id.place_name);
        TextView placeAddress = findViewById(R.id.place_address);
        RatingBar placeRating = findViewById(R.id.place_rating);
        TextView placePhone = findViewById(R.id.place_phone);
        TextView placeHours = findViewById(R.id.place_hours);
        TextView placeWebsite = findViewById(R.id.place_email);
        Button btnSave = findViewById(R.id.btn_save);

        // Track favorite state locally (assume not favorite by default)
        final boolean[] isFavorite = {false};

        // Set initial button text
        btnSave.setText(isFavorite[0] ? "Видалити з улюблених" : "Зберегти");

        btnSave.setOnClickListener(v -> {
            // Получаем токен
            android.content.SharedPreferences prefs = getSharedPreferences("app_prefs", MODE_PRIVATE);
            String token = prefs.getString("auth_token", null);
            if (token == null) {
                Toast.makeText(this, "Необхідна авторизація", Toast.LENGTH_SHORT).show();
                return;
            }
            String placeId = place.getId();
            boolean like = !isFavorite[0];
            String action = like ? "Add" : "Remove";
            new Thread(() -> {
                try {
                    java.net.URL url = new java.net.URL("https://api.aroundme.pp.ua/api/Favorites/action?gmapsPlaceId="
                            + java.net.URLEncoder.encode(placeId, "UTF-8") +
                            "&action=" + action);
                    java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("Authorization", "Bearer " + token);
                    conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                    conn.setDoOutput(true);
                    conn.setDoInput(true);
                    int responseCode = conn.getResponseCode();
                    conn.disconnect();
                    runOnUiThread(() -> {
                        if (responseCode == java.net.HttpURLConnection.HTTP_OK) {
                            isFavorite[0] = like;
                            btnSave.setText(isFavorite[0] ? "Видалити з улюблених" : "Зберегти");
                            Toast.makeText(this, isFavorite[0] ? "Додано до улюблених" : "Видалено з улюблених", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(this, "Помилка: " + responseCode, Toast.LENGTH_SHORT).show();
                        }
                    });
                } catch (Exception e) {
                    runOnUiThread(() -> Toast.makeText(this, "Помилка мережі: " + e.getMessage(), Toast.LENGTH_SHORT).show());
                }
            }).start();
        });

        // Заповнення даними
        placeName.setText(place.getName());
        placeAddress.setText(place.getAddress());
        placeRating.setRating((float) place.getRating());
        placePhone.setText(place.getPhone() != null ? "Телефон: " + place.getPhone() : "Телефон: не вказано");
        placeHours.setText(place.getHours());
        placeWebsite.setText(place.getEmail() != null ? "Сайт: " + place.getEmail() : "Сайт: не вказано");

        // Фото
        java.util.List<String> photoUrls = place.getPhotoUrls();
        if (photoUrls != null && !photoUrls.isEmpty()) {
            Glide.with(this)
                    .load(photoUrls.get(0))
                    .placeholder(R.drawable.ic_placeholder)
                    .into(mainPhoto);
        } else {
            mainPhoto.setImageResource(R.drawable.ic_placeholder);
        }

        // Завантаження часу
        if (place.getId() != null) {
            PlaceUtils.fetchPlaceHoursFromGoogle(this, place.getId(), hours -> {
                placeHours.setText(hours);
                // Оновлюємо об'єкт place, якщо потрібно
                place.setHours(hours.replace("Години роботи:\n", "").replace("Години роботи: ", ""));
            });
        } else {
            placeHours.setText("Години роботи: не вказано");
        }

        // Кнопка маршруту
        Button btnRoute = findViewById(R.id.btn_route);
        btnRoute.setOnClickListener(v -> {
            Uri gmmIntentUri = Uri.parse("google.navigation:q=" +
                    place.getLocation().latitude + "," + place.getLocation().longitude);
            Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
            mapIntent.setPackage("com.google.android.apps.maps");

            if (mapIntent.resolveActivity(getPackageManager()) != null) {
                startActivity(mapIntent);
            } else {
                Toast.makeText(this, "Google Maps не встановлено", Toast.LENGTH_SHORT).show();
            }
        });

        // Кнопка відгуків
        Button btnReviews = findViewById(R.id.btn_reviews);
        btnReviews.setOnClickListener(v -> {
            Intent intent = new Intent(PlaceDetailsActivity.this, ReviewsActivity.class);
            intent.putExtra("place_name", place.getName());
            intent.putExtra("place_rating", place.getRating());
            intent.putExtra("reviews_count", 267); // можеш замінити на динамічне значення
            intent.putExtra("place_id", place.getId()); // place_id для PlaceId (ulong)
            intent.putExtra("gmap_id", place.getId()); // gmap_id для GmapId (string)
            startActivity(intent);
        });

        // Кнопка "Назад"
        ImageButton btnBack = findViewById(R.id.btn_back);
        btnBack.setOnClickListener(v -> finish());
    }

    private boolean handleNavigationItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();
        Intent intent = new Intent(this, MainActivity.class);
        intent.putExtra("selected_nav_item", id);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        startActivity(intent);
        finish();
        return true;
    }
}
