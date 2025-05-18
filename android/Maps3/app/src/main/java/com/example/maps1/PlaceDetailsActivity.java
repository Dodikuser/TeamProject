package com.example.maps1;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.example.maps1.places.MyPlace;
import com.bumptech.glide.Glide;
import com.google.android.libraries.places.api.net.FetchPhotoRequest;
import com.google.android.material.bottomnavigation.BottomNavigationView;



public class PlaceDetailsActivity extends AppCompatActivity {
    private MyPlace place;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_place_details);
        BottomNavigationView bottomNav = findViewById(R.id.bottom_navigation);
        bottomNav.setOnItemSelectedListener(this::handleNavigationItemSelected);
        MyPlace place = getIntent().getParcelableExtra("place");
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

        // Заповнення даними
        placeName.setText(place.getName());
        placeAddress.setText(place.getAddress());
        placeRating.setRating((float) place.getRating());
        placePhone.setText(place.getPhone() != null ? "Телефон: " + place.getPhone() : "Телефон: не вказано");
        placeHours.setText(place.getHours());
        placeWebsite.setText(place.getEmail() != null ? "Сайт: " + place.getEmail() : "Сайт: не вказано");

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

    }
    private boolean handleNavigationItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.nav_home) {
            // Повернутися до MainActivity
            finish();
            return true;
        } else if (id == R.id.nav_favorites) {
            // Перейти до FavoritesFragment (або активності)
            // Наприклад, відкрити нову активність або фрагмент
            return true;
        } else if (id == R.id.nav_recommendations) {
            // Перейти до RecommendationsFragment
            return true;
        } else if (id == R.id.nav_history) {
            // Перейти до HistoryFragment
            return true;
        } else if (id == R.id.nav_account) {
            // Перейти до AccountFragment
            return true;
        }

        return false;
    }
}
/*
    private void loadPlacePhoto(ImageView imageView, String photoReference) {
        int width = 500; // Ширина фото
        int height = 300; // Висота фото

        PhotoMetadata photoMetadata = photoReference;
        FetchPhotoRequest photoRequest = FetchPhotoRequest.builder(photoMetadata)
                .setMaxWidth(width)
                .setMaxHeight(height)
                .build();

        placesClient.fetchPhoto(photoRequest).addOnSuccessListener(fetchPhotoResponse -> {
            Bitmap bitmap = fetchPhotoResponse.getBitmap();
            imageView.setImageBitmap(bitmap);
        }).addOnFailureListener(e -> {
            imageView.setImageResource(R.drawable.ic_placeholder);
        });
    }
    private void openPlaceDetails(Place place) {
        Intent intent = new Intent(this, PlaceDetailsActivity.class);
        intent.putExtra("place", place); // Передаємо об'єкт Place
        startActivity(intent);
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
        }}}*/