package com.example.maps1.account;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.maps1.R;
import com.example.maps1.MainActivity;
import com.example.maps1.PlaceDetailsActivity;
import com.google.gson.Gson;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import java.io.IOException;

public class MainAccount extends Fragment {

    private SharedPreferences prefs;
    private TextView nameText, emailText, registrationDate;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.main_account, container, false);

        prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);

        // Ініціалізація елементів
        nameText = view.findViewById(R.id.nameText);
        emailText = view.findViewById(R.id.emailText);
        registrationDate = view.findViewById(R.id.registrationDate);
        ImageView profileIcon = view.findViewById(R.id.profileIcon);

        // Загрузка данных профиля с сервера
        loadProfileData();

        Button editButton = view.findViewById(R.id.editButton);
        editButton.setOnClickListener(v -> showEditProfileDialog());

        Button logoutButton = view.findViewById(R.id.logoutButton);
        logoutButton.setOnClickListener(v -> logout());

        // Обробник кнопки "Перейти" для відгуків
        view.findViewById(R.id.goButton1).setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), PlaceDetailsActivity.class);
            intent.putExtra("place_name", getString(R.string.place_name_example_1));
            startActivity(intent);
        });

        view.findViewById(R.id.goButton2).setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), PlaceDetailsActivity.class);
            intent.putExtra("place_name", getString(R.string.place_name_example_2));
            startActivity(intent);
        });

        return view;
    }

    private void loadProfileData() {
        new Thread(() -> {
            try {
                // Доверяем все сертификаты
                javax.net.ssl.TrustManager[] trustAllCerts = new javax.net.ssl.TrustManager[]{
                        new javax.net.ssl.X509TrustManager() {
                            public java.security.cert.X509Certificate[] getAcceptedIssuers() { return new java.security.cert.X509Certificate[0]; }
                            public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                            public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                        }
                };

                javax.net.ssl.SSLContext sc = javax.net.ssl.SSLContext.getInstance("SSL");
                sc.init(null, trustAllCerts, new java.security.SecureRandom());
                javax.net.ssl.HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
                javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

                // Настраиваем подключение
                java.net.URL url = new java.net.URL("https://10.0.2.2:7103/api/User/get");
                javax.net.ssl.HttpsURLConnection conn = (javax.net.ssl.HttpsURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");

                String token = prefs.getString("auth_token", null);
                if (token != null) {
                    conn.setRequestProperty("Authorization", "Bearer " + token);
                }

                int responseCode = conn.getResponseCode();
                if (responseCode == 200) {
                    java.io.InputStream is = conn.getInputStream();
                    java.util.Scanner s = new java.util.Scanner(is).useDelimiter("\\A");
                    String json = s.hasNext() ? s.next() : "";

                    Gson gson = new Gson();
                    UserDTO user = gson.fromJson(json, UserDTO.class);

                    requireActivity().runOnUiThread(() -> {
                        nameText.setText(user.name);
                        emailText.setText(user.email);
                        registrationDate.setText(user.createdAt != null ? user.createdAt.substring(0, 10) : "");
                    });
                } else {
                    requireActivity().runOnUiThread(() ->
                            Toast.makeText(getContext(), "Ошибка загрузки профиля: " + responseCode, Toast.LENGTH_SHORT).show()
                    );
                }

                conn.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
                requireActivity().runOnUiThread(() ->
                        Toast.makeText(getContext(), "Ошибка подключения: " + e.getMessage(), Toast.LENGTH_LONG).show()
                );
            }
        }).start();
    }


    private void showEditProfileDialog() {
        EditProfileDialogFragment dialog = new EditProfileDialogFragment();
        dialog.setTargetFragment(this, 1);
        dialog.show(getParentFragmentManager(), "EditProfileDialog");
    }

    private void logout() {
        // Очищаємо SharedPreferences
        prefs.edit().clear().apply();

        // Повертаємось до MainActivity
        Intent intent = new Intent(requireActivity(), MainActivity.class);
        intent.putExtra("show_account_fragment", true);
        startActivity(intent);
        requireActivity().finish();
    }

    // Метод для оновлення профілю після редагування
    public void updateProfile(String name) {
        prefs.edit()
                .putString("user_name", name)
                .apply();

        loadProfileData(); // Оновлюємо дані на екрані
    }

    // DTO для пользователя
    public static class UserDTO {
        public String name;
        public String email;
        public String createdAt;
        public boolean searchHistoryOn;
        public boolean visitHistoryOn;
    }
}