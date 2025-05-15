package com.example.maps1;

import android.content.Intent;
import android.os.Bundle;
import android.util.Patterns;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private EditText nameEditText, lastNameEditText, cityEditText, emailEditText, passwordEditText;
    private Button loginButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        // Инициализация View
        nameEditText = findViewById(R.id.nameEditText);
        lastNameEditText = findViewById(R.id.lastNameEditText);
        cityEditText = findViewById(R.id.cityEditText);
        emailEditText = findViewById(R.id.emailEditText);
        passwordEditText = findViewById(R.id.passwordEditText);
        loginButton = findViewById(R.id.loginButton);

        loginButton.setOnClickListener(v -> {
            String name = nameEditText.getText().toString().trim();
            String lastName = lastNameEditText.getText().toString().trim();
            String city = cityEditText.getText().toString().trim();
            String email = emailEditText.getText().toString().trim();
            String password = passwordEditText.getText().toString().trim();

            if (validateInput(name, lastName, city, email, password)) {
                sendAuthRequest(name, lastName, city, email, password);
            }
        });
    }

    private boolean validateInput(String name, String lastName, String city, String email, String password) {
        if (name.isEmpty() || lastName.isEmpty() || city.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Усі поля обов'язкові", Toast.LENGTH_SHORT).show();
            return false;
        }
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            Toast.makeText(this, "Некоректний email", Toast.LENGTH_SHORT).show();
            return false;
        }
        return true;
    }

    private void sendAuthRequest(String name, String lastName, String city, String email, String password) {
        AuthRequest request = new AuthRequest("standard", name, lastName, email, password, city);
        ApiService apiService = ApiClient.getApiService();

        apiService.authenticate(request).enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    AuthResponse authResponse = response.body();
                    if (authResponse.success) {
                        startActivity(new Intent(LoginActivity.this, MainActivity.class));
                        finish();
                    } else {
                        showError(authResponse.message);
                    }
                } else {
                    showError("Помилка сервера: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                showError("Помилка мережі: " + t.getMessage());
            }

            private void showError(String message) {
                Toast.makeText(LoginActivity.this, message, Toast.LENGTH_SHORT).show();
            }
        });
    }
}
