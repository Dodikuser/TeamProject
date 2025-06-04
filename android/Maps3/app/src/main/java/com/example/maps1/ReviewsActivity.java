package com.example.maps1;

import android.content.Intent;
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

public class ReviewsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_review);

        // Отримуємо дані про місце
        String placeName = getIntent().getStringExtra("place_name");
        double rating = getIntent().getDoubleExtra("place_rating", 3.5);
        int reviewsCount = getIntent().getIntExtra("reviews_count", 267);

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

        // Додаємо тестові відгуки
        addTestReviews(reviewsContainer);

        // Обробники кліків
        btnBack.setOnClickListener(v -> finish());
        btnAddReview.setOnClickListener(v -> {
            Intent intent = new Intent(ReviewsActivity.this, CreateReviewActivity.class);
            intent.putExtra("place_name", placeName);
            startActivity(intent);
        });
    }

    private void addTestReviews(LinearLayout container) {
        // Тестові дані відгуків
        List<Review> reviews = Arrays.asList(
                new Review("Іван Петренко", "Все чудово!", 4.5f, "2 роки тому"),
                new Review("Марія Сидоренко", "Мені подобається це місце. Як на мене, відчувається позитивна атмосфера.", 4.0f, "5 днів тому"),
                new Review("Олександр Коваленко", "Рекомендую!", 4.0f, "1 тиждень тому"),
                new Review("Анна Шевченко", "Не дуже сподобалося, занадто шумно.", 2.5f, "3 місяці тому"),
                new Review("Василь Іваненко", "Гарне місце, але дорого.", 3.5f, "1 місяць тому")
        );

        // Додаємо відгуки до контейнера
        for (Review review : reviews) {
            View reviewView = getLayoutInflater().inflate(R.layout.item_review, container, false);

            TextView tvAuthor = reviewView.findViewById(R.id.tv_author);
            TextView tvText = reviewView.findViewById(R.id.tv_text);
            RatingBar ratingBar = reviewView.findViewById(R.id.rating_bar);
            TextView tvDate = reviewView.findViewById(R.id.tv_date);

            tvAuthor.setText(review.getAuthor());
            tvText.setText(review.getText());
            ratingBar.setRating(review.getRating());
            tvDate.setText(review.getDate());

            container.addView(reviewView);
        }
    }

    // Допоміжний клас для відгуків
    private static class Review {
        private String author;
        private String text;
        private float rating;
        private String date;

        public Review(String author, String text, float rating, String date) {
            this.author = author;
            this.text = text;
            this.rating = rating;
            this.date = date;
        }

        public String getAuthor() { return author; }
        public String getText() { return text; }
        public float getRating() { return rating; }
        public String getDate() { return date; }
    }
}