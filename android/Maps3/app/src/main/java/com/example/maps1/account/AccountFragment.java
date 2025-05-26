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
                URL url = new URL("http://10.0.2.2:7103/api/User/register");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                conn.setDoOutput(true);

                JSONObject json = new JSONObject();
                json.put("type", "standard");
                json.put("name", firstName + " " + lastName);
                json.put("email", email);
                json.put("password", password);

                try (OutputStream os = conn.getOutputStream()) {
                    os.write(json.toString().getBytes("UTF-8"));
                }

                int code = conn.getResponseCode();
                requireActivity().runOnUiThread(() ->
                        Toast.makeText(getContext(),
                                code == HttpURLConnection.HTTP_OK
                                        ? "Успішна реєстрація!"
                                        : "Помилка при реєстрації: " + code,
                                Toast.LENGTH_SHORT).show()
                );

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

    // В методі sendLoginRequest замініть імітацію на такий код:
    private void sendLoginRequest(String email, String password) {
        // Зберігаємо дані користувача
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        prefs.edit()
                .putString("auth_token", "fake_token")
                .putString("user_email", email)
                .putString("user_name", "Ім'я Прізвище") // Тимчасове значення
                .putString("reg_date", "25.04.2025") // Тимчасове значення
                .apply();

        Toast.makeText(getContext(), "Успішний вхід!", Toast.LENGTH_SHORT).show();
        getParentFragmentManager().beginTransaction()
                .replace(R.id.fragment_container, new MainAccount())
                .commit();
    }
        /*new Thread(() -> {

            try {
                URL url = new URL("http://10.0.2.2:7103/api/User/login");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                conn.setDoOutput(true);

                JSONObject jsonReq = new JSONObject();
                jsonReq.put("type", "standard");
                jsonReq.put("name", "");
                jsonReq.put("email", email);
                jsonReq.put("password", password);

                try (OutputStream os = conn.getOutputStream()) {
                    os.write(jsonReq.toString().getBytes("UTF-8"));
                }

                int code = conn.getResponseCode();
                InputStream is = (code == HttpURLConnection.HTTP_OK)
                        ? conn.getInputStream()
                        : conn.getErrorStream();
                String response = new Scanner(is).useDelimiter("\\A").next();
                conn.disconnect();

                if (code == HttpURLConnection.HTTP_OK) {
                    JSONObject jsonResp = new JSONObject(response);
                    String token = jsonResp.getString("token");

                    // Сохраняем токен
                    SharedPreferences prefs = requireActivity()
                            .getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
                    prefs.edit()
                            .putString("auth_token", token)
                            .apply();
                    String token1 = prefs.getString("auth_token", null);

                    requireActivity().runOnUiThread(() -> {
                        Toast.makeText(getContext(), "Успішний вхід!", Toast.LENGTH_SHORT).show();
                        // Замінюємо поточний фрагмент на MainAccountFragment
                        getParentFragmentManager().beginTransaction()
                                .replace(R.id.fragment_container, new MainAccount())
                                .commit();
                    });
                } else {
                    getParentFragmentManager().beginTransaction()
                            .replace(R.id.fragment_container, new MainAccount())
                            .commit();
                    /*
                    requireActivity().runOnUiThread(() ->
                            Toast.makeText(getContext(), "Помилка входу: " + response,
                                    Toast.LENGTH_LONG).show()

                    );
                }
            } catch (Exception e) {
                e.printStackTrace();
                requireActivity().runOnUiThread(() ->
                        Toast.makeText(getContext(),
                                "Помилка підключення: " + e.getMessage(),
                                Toast.LENGTH_LONG).show()
                );
            }
        }).start();*/
    }

