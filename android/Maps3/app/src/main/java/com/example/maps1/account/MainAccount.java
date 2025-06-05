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
    // Элементы для отзывов
    private TextView reviewPlaceName1, reviewDateTime1, reviewText1, reviewAddress1, reviewRating1;
    private TextView reviewPlaceName2, reviewDateTime2, reviewText2, reviewAddress2, reviewRating2;
    private Button goToPlaceButton1, goToPlaceButton2;

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

        // Инициализация элементов отзывов
        reviewPlaceName1 = view.findViewById(R.id.reviewPlaceName1);
        reviewDateTime1 = view.findViewById(R.id.reviewDateTime1);
        reviewText1 = view.findViewById(R.id.reviewText1);
        reviewAddress1 = view.findViewById(R.id.reviewAddress1);
        reviewRating1 = view.findViewById(R.id.reviewRating1);
        goToPlaceButton1 = view.findViewById(R.id.goToPlaceButton1);

        reviewPlaceName2 = view.findViewById(R.id.reviewPlaceName2);
        reviewDateTime2 = view.findViewById(R.id.reviewDateTime2);
        reviewText2 = view.findViewById(R.id.reviewText2);
        reviewAddress2 = view.findViewById(R.id.reviewAddress2);
        reviewRating2 = view.findViewById(R.id.reviewRating2);
        goToPlaceButton2 = view.findViewById(R.id.goToPlaceButton2);

        // Загрузка данных профиля с сервера
        loadProfileData();
        // Загрузка отзывов пользователя
        loadUserReviews();

        Button editButton = view.findViewById(R.id.editButton);
        editButton.setOnClickListener(v -> showEditProfileDialog());

        Button logoutButton = view.findViewById(R.id.logoutButton);
        logoutButton.setOnClickListener(v -> logout());

        // Обработчики кнопок "Перейти" будут обновлены после загрузки отзывов

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

    private void loadUserReviews() {
        new Thread(() -> {
            try {
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

                java.net.URL url = new java.net.URL("https://10.0.2.2:7103/api/Review/get-by-user?skip=0&take=10");
                javax.net.ssl.HttpsURLConnection conn = (javax.net.ssl.HttpsURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
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

                    com.google.gson.JsonObject root = com.google.gson.JsonParser.parseString(json).getAsJsonObject();
                    com.google.gson.JsonArray values = root.getAsJsonArray("$values");
                    java.lang.reflect.Type listType = new com.google.gson.reflect.TypeToken<java.util.ArrayList<ReviewDTO>>(){}.getType();
                    java.util.ArrayList<ReviewDTO> reviews = new com.google.gson.Gson().fromJson(values, listType);

                    requireActivity().runOnUiThread(() -> {
                        if (reviews != null && reviews.size() > 0) {
                            ReviewDTO r1 = reviews.get(0);
                            reviewDateTime1.setText(r1.reviewDateTime != null ? r1.reviewDateTime.replace("T", " ").substring(0, 16) : "");
                            reviewText1.setText(r1.text != null ? r1.text : "");
                            loadPlaceInfoAndBind(r1.gmapId, reviewPlaceName1, reviewAddress1, reviewRating1, goToPlaceButton1, r1.placeId);
                        } else {
                            reviewDateTime1.setText("");
                            reviewText1.setText("Відгуків не знайдено");
                            reviewPlaceName1.setText("");
                            reviewAddress1.setText("");
                            reviewRating1.setText("");
                        }
                        if (reviews != null && reviews.size() > 1) {
                            ReviewDTO r2 = reviews.get(1);
                            reviewDateTime2.setText(r2.reviewDateTime != null ? r2.reviewDateTime.replace("T", " ").substring(0, 16) : "");
                            reviewText2.setText(r2.text != null ? r2.text : "");
                            loadPlaceInfoAndBind(r2.gmapId, reviewPlaceName2, reviewAddress2, reviewRating2, goToPlaceButton2, r2.placeId);
                        } else {
                            reviewDateTime2.setText("");
                            reviewText2.setText("");
                            reviewPlaceName2.setText("");
                            reviewAddress2.setText("");
                            reviewRating2.setText("");
                        }
                    });
                } else {
                    requireActivity().runOnUiThread(() ->
                            Toast.makeText(getContext(), "Ошибка загрузки отзывов: " + responseCode, Toast.LENGTH_SHORT).show()
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

    // Загружает инфо о месте и заполняет поля карточки
    private void loadPlaceInfoAndBind(String gmapId, TextView nameView, TextView addressView, TextView ratingView, Button goButton, int placeId) {
        new Thread(() -> {
            try {
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

                String urlStr = "https://10.0.2.2:7103/api/Place/info/?placeId=" + gmapId;
                java.net.URL url = new java.net.URL(urlStr);
                javax.net.ssl.HttpsURLConnection conn = (javax.net.ssl.HttpsURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
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
                    com.google.gson.JsonObject root = com.google.gson.JsonParser.parseString(json).getAsJsonObject();
                    com.google.gson.JsonObject placeInfo = root.getAsJsonObject("placeInfo");
                    String name = placeInfo.has("name") ? placeInfo.get("name").getAsString() : "";
                    String address = placeInfo.has("address") ? placeInfo.get("address").getAsString() : "";
                    double stars = placeInfo.has("stars") ? placeInfo.get("stars").getAsDouble() : 0.0;
                    requireActivity().runOnUiThread(() -> {
                        nameView.setText(name);
                        addressView.setText(address);
                        ratingView.setText("Рейтинг: " + stars);
                        goButton.setOnClickListener(v -> {
                            Intent intent = new Intent(getActivity(), com.example.maps1.PlaceDetailsActivity.class);
                            intent.putExtra("place_id", placeId);
                            startActivity(intent);
                        });
                    });
                } else {
                    requireActivity().runOnUiThread(() -> {
                        nameView.setText("");
                        addressView.setText("");
                        ratingView.setText("");
                    });
                }
                conn.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
                requireActivity().runOnUiThread(() -> {
                    nameView.setText("");
                    addressView.setText("");
                    ratingView.setText("");
                });
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
    // DTO для отзыва
    public static class ReviewDTO {
        public String text;
        public int stars;
        public String reviewDateTime;
        public String gmapId;
        public int placeId;
        public int userId;
        public String userName;
        public PhotoDTO photo;
    }
    public static class PhotoDTO {
        public String path;
        public int placeId;
    }
}