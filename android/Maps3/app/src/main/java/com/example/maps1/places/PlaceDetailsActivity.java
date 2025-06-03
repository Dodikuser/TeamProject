package com.example.maps1.places;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.example.maps1.R;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class PlaceDetailsActivity extends AppCompatActivity {
    private MyPlace place;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_place_details);

        BottomNavigationView bottomNav = findViewById(R.id.bottom_navigation);
        bottomNav.setOnItemSelectedListener(this::handleNavigationItemSelected);

        // Отримуємо дані з інтенту
        Intent intent = getIntent();
        if (intent.hasExtra("place")) {
            place = intent.getParcelableExtra("place");
        } else {
            // Якщо передано окремі поля (для рекомендацій/історії/улюблених)
            place = new MyPlace();
            place.setId(intent.getStringExtra("place_id"));
            place.setName(intent.getStringExtra("place_name"));
            place.setAddress(intent.getStringExtra("place_address"));
            place.setDescription(intent.getStringExtra("place_description"));
            place.setRating(intent.getDoubleExtra("place_rating", 0));
            place.setPhone(intent.getStringExtra("place_phone"));
            place.setHours(intent.getStringExtra("place_hours"));
            place.setEmail(intent.getStringExtra("place_email"));

            // Для координат (якщо є)
            if (intent.hasExtra("place_lat") && intent.hasExtra("place_lng")) {
                double lat = intent.getDoubleExtra("place_lat", 0);
                double lng = intent.getDoubleExtra("place_lng", 0);
                place.setLocation(new LatLng(lat, lng));
            }
        }

        if (place == null) {
            Toast.makeText(this, "Помилка: дані про місце не знайдено", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        // Initialize Views
        LinearLayout photosContainer = findViewById(R.id.photos_container);
        TextView placeName = findViewById(R.id.place_name);
        TextView placeAddress = findViewById(R.id.place_address);
        TextView placeDescription = findViewById(R.id.place_description);
        RatingBar placeRating = findViewById(R.id.place_rating);
        TextView placePhone = findViewById(R.id.place_phone);
        TextView placeHours = findViewById(R.id.place_hours);
        TextView placeWebsite = findViewById(R.id.place_email);
        Button btnSave = findViewById(R.id.btn_save);

        // Set place data
        placeName.setText(place.getName());
        placeAddress.setText(place.getAddress());
        placeDescription.setText(place.getDescription() != null ? place.getDescription() : "Опис відсутній");
        placeRating.setRating((float) place.getRating());
        placePhone.setText(place.getPhone() != null ? "Телефон: " + place.getPhone() : "Телефон: не вказано");
        placeHours.setText(place.getHours() != null ? "Години: " + place.getHours() : "Години: не вказано");
        placeWebsite.setText(place.getEmail() != null ? "Email: " + place.getEmail() : "Email: не вказано");

        // Обробник кнопки "Зберегти"
        btnSave.setOnClickListener(v -> {
            // Тут логіка для збереження місця до улюблених
            Toast.makeText(this, "Місце збережено до улюблених", Toast.LENGTH_SHORT).show();
        });

        // Route button
        Button btnRoute = findViewById(R.id.btn_route);
        if (place.getLocation() != null) {
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
        } else {
            btnRoute.setEnabled(false);
            btnRoute.setText("Маршрут недоступний");
        }

        // Load photos if available
        if (place.getPhotoUrls() != null && !place.getPhotoUrls().isEmpty()) {
            for (String photoUrl : place.getPhotoUrls()) {
                ImageView imageView = new ImageView(this);
                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                        getResources().getDimensionPixelSize(R.dimen.photo_width),
                        ViewGroup.LayoutParams.MATCH_PARENT);
                params.setMargins(0, 0, 16, 0);
                imageView.setLayoutParams(params);
                imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);

                Glide.with(this)
                        .load(photoUrl)
                        .placeholder(R.drawable.placeholder)
                        .into(imageView);

                photosContainer.addView(imageView);
            }
        } else {
            // Add placeholder if no photos
            ImageView placeholder = new ImageView(this);
            placeholder.setLayoutParams(new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT));
            placeholder.setScaleType(ImageView.ScaleType.CENTER_CROP);
            placeholder.setImageResource(R.drawable.placeholder);
            photosContainer.addView(placeholder);
        }
    }

    private boolean handleNavigationItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.nav_home) {
            finish();
            return true;
        } else if (id == R.id.nav_favorites) {
            // Перейти до FavoritesFragment
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