package com.example.maps1.Favorites;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.widget.Toast;

import java.net.HttpURLConnection;
import java.net.URL;

public class FavoritesHelper {

    public interface FavoriteActionCallback {
        void onSuccess();
        void onError(String message);
    }

    public static void addToFavorites(Context context, String gmapsPlaceId, FavoriteActionCallback callback) {
        performFavoriteAction(context, gmapsPlaceId, "Add", callback);
    }

    public static void removeFromFavorites(Context context, String gmapsPlaceId, FavoriteActionCallback callback) {
        performFavoriteAction(context, gmapsPlaceId, "Remove", callback);
    }

    private static void performFavoriteAction(Context context, String gmapsPlaceId, String action, FavoriteActionCallback callback) {
        SharedPreferences prefs = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        if (token == null) {
            if (callback != null) {
                callback.onError("Користувач не авторизований");
            }
            return;
        }

        new Thread(() -> {
            try {
                URL url = new URL("https://api.aroundme.pp.ua/api/Favorites/action");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                conn.setDoOutput(true);
                conn.setDoInput(true);

                // Send form data
                String postData = "gmapsPlaceId=" + java.net.URLEncoder.encode(gmapsPlaceId, "UTF-8") +
                        "&action=" + action;
                conn.getOutputStream().write(postData.getBytes("UTF-8"));

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    if (callback != null) {
                        callback.onSuccess();
                    }
                } else {
                    Log.e("FavoritesHelper", "Error performing favorite action, response code: " + responseCode);
                    if (callback != null) {
                        callback.onError("Помилка сервера: " + responseCode);
                    }
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("FavoritesHelper", "Error performing favorite action", e);
                if (callback != null) {
                    callback.onError("Помилка мережі: " + e.getMessage());
                }
            }
        }).start();
    }

    // Метод для использования в других активностях/фрагментах
    public static void toggleFavorite(Context context, String gmapsPlaceId, boolean isCurrentlyFavorite) {
        if (isCurrentlyFavorite) {
            removeFromFavorites(context, gmapsPlaceId, new FavoriteActionCallback() {
                @Override
                public void onSuccess() {
                    // Можно обновить UI или показать сообщение
                    if (context instanceof android.app.Activity) {
                        ((android.app.Activity) context).runOnUiThread(() ->
                                Toast.makeText(context, "Видалено з улюблених", Toast.LENGTH_SHORT).show()
                        );
                    }
                }

                @Override
                public void onError(String message) {
                    if (context instanceof android.app.Activity) {
                        ((android.app.Activity) context).runOnUiThread(() ->
                                Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
                        );
                    }
                }
            });
        } else {
            addToFavorites(context, gmapsPlaceId, new FavoriteActionCallback() {
                @Override
                public void onSuccess() {
                    if (context instanceof android.app.Activity) {
                        ((android.app.Activity) context).runOnUiThread(() ->
                                Toast.makeText(context, "Додано до улюблених", Toast.LENGTH_SHORT).show()
                        );
                    }
                }

                @Override
                public void onError(String message) {
                    if (context instanceof android.app.Activity) {
                        ((android.app.Activity) context).runOnUiThread(() ->
                                Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
                        );
                    }
                }
            });
        }
    }
}