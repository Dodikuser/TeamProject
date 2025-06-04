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

        // Обробники кліків
        btnBack.setOnClickListener(v -> finish());
        btnCancel.setOnClickListener(v -> finish());
        btnSubmit.setOnClickListener(v -> {
            // Тут буде логіка збереження відгуку
            String reviewText = etReviewText.getText().toString();
            if (reviewText.isEmpty()) {
                Toast.makeText(this, "Будь ласка, напишіть відгук", Toast.LENGTH_SHORT).show();
                return;
            }

            float overallRating = ratingBar.getRating();
            float priceRating = ratingPrice.getRating();
            float qualityRating = ratingQuality.getRating();
            float distanceRating = ratingDistance.getRating();
            float crowdRating = ratingCrowd.getRating();
            float infrastructureRating = ratingInfrastructure.getRating();

            // Тут буде відправка даних на сервер
            Toast.makeText(this, "Відгук успішно додано", Toast.LENGTH_SHORT).show();
            finish();
        });
        btnAddPhoto.setOnClickListener(v -> {
            // Тут буде логіка додавання фото/відео
            Toast.makeText(this, "Додавання фото/відео", Toast.LENGTH_SHORT).show();
        });
    }
}