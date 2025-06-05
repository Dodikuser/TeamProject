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
        LinearLayout photosContainer = findViewById(R.id.photos_container);

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

        // Галерея
        photosContainer.removeAllViews();
        if (photoUrls != null && photoUrls.size() > 1) {
            for (int i = 1; i < photoUrls.size(); i++) {
                ImageView imageView = new ImageView(this);
                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                        getResources().getDimensionPixelSize(R.dimen.search_card_width) / 2,
                        getResources().getDimensionPixelSize(R.dimen.search_card_height)
                );
                params.setMargins(8, 0, 8, 0);
                imageView.setLayoutParams(params);
                imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
                Glide.with(this)
                        .load(photoUrls.get(i))
                        .placeholder(R.drawable.ic_placeholder)
                        .into(imageView);
                photosContainer.addView(imageView);
            }
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
