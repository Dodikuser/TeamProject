package com.example.maps1.account;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import com.example.maps1.R;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.button.MaterialButtonToggleGroup;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

import org.json.JSONObject;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;

public class AccountFragment extends Fragment {

    private boolean isLoginMode = true;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.account_activity, container, false);

        MaterialButtonToggleGroup toggleGroup = view.findViewById(R.id.toggleGroup);
        MaterialButton btnSubmit = view.findViewById(R.id.btnSubmit);

        TextInputLayout layoutFirstName = view.findViewById(R.id.layoutFirstName);
        TextInputLayout layoutLastName  = view.findViewById(R.id.layoutLastName);

        TextInputEditText etFirstName = view.findViewById(R.id.etFirstName);
        TextInputEditText etLastName  = view.findViewById(R.id.etLastName);
        TextInputEditText etEmail     = view.findViewById(R.id.etEmail);
        TextInputEditText etPassword  = view.findViewById(R.id.etPassword);

        // Переключатель между режимами
        toggleGroup.addOnButtonCheckedListener((group, checkedId, isChecked) -> {
            if (!isChecked) return;
            if (checkedId == R.id.btnLogin) {
                layoutFirstName.setVisibility(View.GONE);
                layoutLastName.setVisibility(View.GONE);
                btnSubmit.setText(R.string.login);
                isLoginMode = true;
            } else {
                layoutFirstName.setVisibility(View.VISIBLE);
                layoutLastName.setVisibility(View.VISIBLE);
                btnSubmit.setText(R.string.register);
                isLoginMode = false;
            }
        });

        btnSubmit.setOnClickListener(v -> {
            String email    = etEmail.getText().toString().trim();
            String password = etPassword.getText().toString().trim();

            if (TextUtils.isEmpty(email) || TextUtils.isEmpty(password)) {
                Toast.makeText(getContext(), "Введіть email та пароль", Toast.LENGTH_SHORT).show();
                return;
            }

            if (isLoginMode) {
                sendLoginRequest(email, password);
            } else {
                String firstName = etFirstName.getText().toString().trim();
                String lastName  = etLastName.getText().toString().trim();
                if (TextUtils.isEmpty(firstName) || TextUtils.isEmpty(lastName)) {
                    Toast.makeText(getContext(), "Заповніть всі поля", Toast.LENGTH_SHORT).show();
                    return;
                }
                sendRegistrationRequest(firstName, lastName, email, password);
            }
        });

        return view;
    }

    private void sendRegistrationRequest(String firstName, String lastName,
                                         String email, String password) {
        new Thread(() -> {
            try {
                // Отключаем проверку SSL сертификатов для localhost (только для разработки!)
                // disableSSLVerification();
                trustAllCertificates();
                URL url = new URL("https://10.0.2.2:7103/api/User/register");
                HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                conn.setDoOutput(true);

                // Формат данных под UserRegisterDTO
                JSONObject json = new JSONObject();
                json.put("name", firstName + " " + lastName);
                json.put("email", email);
                json.put("password", password);
                // googleJwtToken и FacebookId не отправляем (null по умолчанию)

                try (OutputStream os = conn.getOutputStream()) {
                    os.write(json.toString().getBytes("UTF-8"));
                }

                int code = conn.getResponseCode();

                // Читаем ответ
                String response = "";
                if (code == HttpURLConnection.HTTP_OK) {
                    try (Scanner scanner = new Scanner(conn.getInputStream())) {
                        response = scanner.useDelimiter("\\A").next();
                    }
                } else {
                    try (Scanner scanner = new Scanner(conn.getErrorStream())) {
                        response = scanner.useDelimiter("\\A").next();
                    }
                }

                final String finalResponse = response;
                requireActivity().runOnUiThread(() -> {
                    if (code == HttpURLConnection.HTTP_OK) {
                        Toast.makeText(getContext(), "Успішна реєстрація: " + finalResponse, Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(getContext(), "Помилка реєстрації: " + finalResponse, Toast.LENGTH_LONG).show();
                    }
                });

                conn.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
                requireActivity().runOnUiThread(() ->
                        Toast.makeText(getContext(),
                                "Помилка підключення: " + e.getMessage(),
                                Toast.LENGTH_LONG).show()
                );
            }
        }).start();
    }

    public static void trustAllCertificates() {
        try {
            TrustManager[] trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
                        public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) { }
                        public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) { }
                    }
            };

            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

            HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendLoginRequest(String email, String password) {
        new Thread(() -> {
            try {
                trustAllCertificates();
                URL url = new URL("https://10.0.2.2:7103/api/User/login");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                conn.setDoOutput(true);

                // Формат данных под UserLoginDTO
                JSONObject json = new JSONObject();
                json.put("email", email);
                json.put("password", password);
                // googleJwtToken и FacebookId не отправляем (null по умолчанию)

                try (OutputStream os = conn.getOutputStream()) {
                    os.write(json.toString().getBytes("UTF-8"));
                }

                int code = conn.getResponseCode();

                if (code == HttpURLConnection.HTTP_OK) {
                    // Читаем ответ с токеном
                    String response = "";
                    try (Scanner scanner = new Scanner(conn.getInputStream())) {
                        response = scanner.useDelimiter("\\A").next();
                    }

                    // Парсим JSON ответ для получения токена
                    JSONObject responseJson = new JSONObject(response);
                    String token = responseJson.getString("token");

                    // Сохраняем токен и данные пользователя
                    SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
                    prefs.edit()
                            .putString("auth_token", token)
                            .putString("user_email", email)
                            .putString("user_name", "Ім'я Прізвище") // Временное значение
                            .putString("reg_date", "25.04.2025") // Временное значение
                            .apply();

                    requireActivity().runOnUiThread(() -> {
                        Toast.makeText(getContext(), "Успішний вхід!", Toast.LENGTH_SHORT).show();
                        getParentFragmentManager().beginTransaction()
                                .replace(R.id.fragment_container, new MainAccount())
                                .commit();
                    });
                } else {
                    // Обрабатываем ошибку
                    String errorResponse = "";
                    try (Scanner scanner = new Scanner(conn.getErrorStream())) {
                        errorResponse = scanner.useDelimiter("\\A").next();
                    }

                    final String finalErrorResponse = errorResponse;
                    requireActivity().runOnUiThread(() ->
                            Toast.makeText(getContext(),
                                    "Помилка входу: " + finalErrorResponse,
                                    Toast.LENGTH_LONG).show()
                    );
                }

                conn.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
                requireActivity().runOnUiThread(() ->
                        Toast.makeText(getContext(),
                                "Помилка підключення: " + e.getMessage(),
                                Toast.LENGTH_LONG).show()
                );
            }
        }).start();
    }
}