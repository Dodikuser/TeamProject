package com.example.maps1;

import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.button.MaterialButtonToggleGroup;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class AccountActivity extends AppCompatActivity {

    private boolean isRegisterMode = false;

    private TextInputLayout layoutFirstName, layoutLastName;
    private TextInputEditText etFirstName, etLastName, etEmail, etPassword;
    private MaterialButton btnSubmit;
    private MaterialButton btnLogin, btnRegister;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.account_activity);

        layoutFirstName = findViewById(R.id.layoutFirstName);
        layoutLastName = findViewById(R.id.layoutLastName);
        etFirstName = findViewById(R.id.etFirstName);
        etLastName = findViewById(R.id.etLastName);
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        btnSubmit = findViewById(R.id.btnSubmit);
        btnLogin = findViewById(R.id.btnLogin);
        btnRegister = findViewById(R.id.btnRegister);

        // Переключение между режимами входа и регистрации
        MaterialButtonToggleGroup toggleGroup = findViewById(R.id.toggleGroup);
        toggleGroup.addOnButtonCheckedListener((group, checkedId, isChecked) -> {
            if (isChecked) {
                if (checkedId == R.id.btnRegister) {
                    isRegisterMode = true;
                    layoutFirstName.setVisibility(View.VISIBLE);
                    layoutLastName.setVisibility(View.VISIBLE);
                    btnSubmit.setText(R.string.register);
                } else {
                    isRegisterMode = false;
                    layoutFirstName.setVisibility(View.GONE);
                    layoutLastName.setVisibility(View.GONE);
                    btnSubmit.setText(R.string.login);
                }
            }
        });

        // Обработчик нажатия кнопки входа/регистрации
        btnSubmit.setOnClickListener(v -> {
            String email = etEmail.getText().toString().trim();
            String password = etPassword.getText().toString().trim();

            if (isRegisterMode) {
                String firstName = etFirstName.getText().toString().trim();
                String lastName = etLastName.getText().toString().trim();

                if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || password.isEmpty()) {
                    Toast.makeText(this, "Будь ласка, заповніть усі поля", Toast.LENGTH_SHORT).show();
                    return;
                }

                sendRegistrationRequest(firstName, lastName, email, password);
            } else {
                // TODO: логика входа (если нужно)
                Toast.makeText(this, "Логін ще не реалізовано", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void sendRegistrationRequest(String firstName, String lastName, String email, String password) {
        new Thread(() -> {
            try {
                // ⛳ Укажи свой IP и порт
                URL url = new URL("http://10.0.2.2:7103/api/User/register");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                conn.setDoOutput(true);
                conn.setDoInput(true);

                JSONObject jsonParam = new JSONObject();
                jsonParam.put("type", "standard");
                jsonParam.put("name", firstName+" "+lastName);
                jsonParam.put("email", email);
                jsonParam.put("password", password);

                OutputStream os = conn.getOutputStream();
                os.write(jsonParam.toString().getBytes("UTF-8"));
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    runOnUiThread(() -> {
                        Toast.makeText(this, "Успішна реєстрація!", Toast.LENGTH_SHORT).show();
                    });
                } else {
                    runOnUiThread(() -> {
                        Toast.makeText(this, "Помилка при реєстрації: " + responseCode, Toast.LENGTH_SHORT).show();
                    });
                }

                conn.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(this, "Помилка підключення: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
            }
        }).start();
    }
}
