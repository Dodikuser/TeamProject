package com.example.maps1;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class PlaceDetailsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_place_details);

        // Initialize views
        LinearLayout photosContainer = findViewById(R.id.photos_container);
        TextView placeName = findViewById(R.id.place_name);
        TextView placeAddress = findViewById(R.id.place_address);
        TextView placeDescription = findViewById(R.id.place_description);
        RatingBar placeRating = findViewById(R.id.place_rating);
        TextView placePhone = findViewById(R.id.place_phone);
        TextView placeHours = findViewById(R.id.place_hours);
        TextView placeEmail = findViewById(R.id.place_email);
        Button btnSave = findViewById(R.id.btn_save);
        Button btnRoute = findViewById(R.id.btn_route);
        Button btnReviews = findViewById(R.id.btn_reviews);

        // TODO: Replace with actual data from server
        // For now, we'll use placeholder data
        placeName.setText("Назва місця");
        placeAddress.setText("Адреса місця");
        placeDescription.setText("Опис закладу буде тут");
        placeRating.setRating(4.2f);
        placePhone.setText("Телефон: +380123456789");
        placeHours.setText("Години роботи: 09:00 - 22:00");
        placeEmail.setText("Email: example@example.com");

        // Add placeholder photos
        addPlaceholderPhotos(photosContainer);

        // Button click listeners
        btnSave.setOnClickListener(v -> {
            Toast.makeText(this, "Місце збережено", Toast.LENGTH_SHORT).show();
            // TODO: Implement save functionality
        });

        btnRoute.setOnClickListener(v -> {
            Toast.makeText(this, "Прокладання маршруту", Toast.LENGTH_SHORT).show();
            // TODO: Implement route functionality
        });

        btnReviews.setOnClickListener(v -> {
            Toast.makeText(this, "Перегляд відгуків", Toast.LENGTH_SHORT).show();
            // TODO: Implement reviews functionality
        });

        // Setup bottom navigation
        BottomNavigationView bottomNav = findViewById(R.id.bottom_navigation);
        bottomNav.setOnItemSelectedListener(item -> {
            int id = item.getItemId();

            if (id == R.id.nav_home) {
                finish(); // Close this activity and return to main
                return true;
            } else if (id == R.id.nav_favorites || id == R.id.nav_recommendations ||
                    id == R.id.nav_history || id == R.id.nav_account) {
                // TODO: Implement navigation to other fragments
                Toast.makeText(this, item.getTitle(), Toast.LENGTH_SHORT).show();
                return true;
            }
            return false;
        });
    }

    private void addPlaceholderPhotos(LinearLayout container) {
        // Add 3 placeholder photos
        for (int i = 0; i < 3; i++) {
            ImageView imageView = new ImageView(this);
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    300, // width
                    LinearLayout.LayoutParams.MATCH_PARENT // height
            );
            if (i > 0) {
                params.leftMargin = 16;
            }
            imageView.setLayoutParams(params);
            imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);

            // Load placeholder image (replace with actual image loading from server)
            Glide.with(this)
                    .load(ContextCompat.getDrawable(this, R.drawable.ic_placeholder))
                    .into(imageView);

            // Add click listener to view full image
            imageView.setOnClickListener(v -> {
                // TODO: Implement full image view
                Toast.makeText(this, "Перегляд фото в повному розмірі", Toast.LENGTH_SHORT).show();
            });

            container.addView(imageView);
        }
    }
}