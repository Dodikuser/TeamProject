package com.example.maps1.history;

import android.util.Log;

import org.json.JSONObject;

import java.io.BufferedWriter;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class HistoryApiHelper {

    private static final String BASE_URL = "https://api.aroundme.pp.ua/api";

    public interface ApiCallback {
        void onSuccess(String response);
        void onError(String error);
    }

    public static void getPlaceHistory(String token, int skip, int take, ApiCallback callback) {
        new Thread(() -> {
            try {
                URL url = new URL(BASE_URL + "/history/places/get");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                conn.setDoOutput(true);

                // Send request body
                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                writer.write("skip=" + skip + "&take=" + take);
                writer.flush();
                writer.close();
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();
                    callback.onSuccess(response);
                } else {
                    callback.onError("HTTP Error: " + responseCode);
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("HistoryApiHelper", "Error getting place history", e);
                callback.onError(e.getMessage());
            }
        }).start();
    }

    public static void getSearchHistory(String token, int skip, int take, ApiCallback callback) {
        new Thread(() -> {
            try {
                URL url = new URL(BASE_URL + "/history/requests/get");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                conn.setDoOutput(true);

                // Send request body
                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                writer.write("skip=" + skip + "&take=" + take);
                writer.flush();
                writer.close();
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();
                    callback.onSuccess(response);
                } else {
                    callback.onError("HTTP Error: " + responseCode);
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("HistoryApiHelper", "Error getting search history", e);
                callback.onError(e.getMessage());
            }
        }).start();
    }

    public static void searchPlaceHistory(String token, String keyword, int skip, int take, ApiCallback callback) {
        new Thread(() -> {
            try {
                URL url = new URL(BASE_URL + "/history/places/search");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                conn.setDoOutput(true);

                // Send request body
                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                writer.write("keyword=" + java.net.URLEncoder.encode(keyword, "UTF-8") +
                        "&skip=" + skip + "&take=" + take);
                writer.flush();
                writer.close();
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();
                    callback.onSuccess(response);
                } else {
                    callback.onError("HTTP Error: " + responseCode);
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("HistoryApiHelper", "Error searching place history", e);
                callback.onError(e.getMessage());
            }
        }).start();
    }

    public static void searchSearchHistory(String token, String keyword, int skip, int take, ApiCallback callback) {
        new Thread(() -> {
            try {
                URL url = new URL(BASE_URL + "/history/requests/search");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                conn.setDoOutput(true);

                // Send request body
                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                writer.write("keyword=" + java.net.URLEncoder.encode(keyword, "UTF-8") +
                        "&skip=" + skip + "&take=" + take);
                writer.flush();
                writer.close();
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();
                    callback.onSuccess(response);
                } else {
                    callback.onError("HTTP Error: " + responseCode);
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("HistoryApiHelper", "Error searching search history", e);
                callback.onError(e.getMessage());
            }
        }).start();
    }

    public static void deleteSearchHistoryItem(String token, String searchText, ApiCallback callback) {
        new Thread(() -> {
            try {
                URL url = new URL(BASE_URL + "/history/requests/action");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                // Create JSON body
                JSONObject jsonBody = new JSONObject();
                jsonBody.put("historyAction", "Delete"); // Предполагаем, что есть такое действие

                JSONObject searchDTO = new JSONObject();
                searchDTO.put("text", searchText);
                jsonBody.put("searchDTO", searchDTO);

                // Send request body
                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                writer.write(jsonBody.toString());
                writer.flush();
                writer.close();
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();
                    callback.onSuccess(response);
                } else {
                    callback.onError("HTTP Error: " + responseCode);
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("HistoryApiHelper", "Error deleting search history item", e);
                callback.onError(e.getMessage());
            }
        }).start();
    }

    public static void addSearchHistoryItem(String token, String searchText, ApiCallback callback) {
        new Thread(() -> {
            try {
                URL url = new URL(BASE_URL + "/history/requests/action");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                // Create JSON body - теперь все поля на верхнем уровне
                JSONObject jsonBody = new JSONObject();
                jsonBody.put("historyAction", "Add");
                jsonBody.put("historyId", JSONObject.NULL); // ulong? -> null
                jsonBody.put("text", searchText != null ? searchText : JSONObject.NULL);
                jsonBody.put("searchDateTime", JSONObject.NULL); // DateTime? -> null
                jsonBody.put("userId", JSONObject.NULL); // ulong? -> null

                // Send request body
                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, StandardCharsets.UTF_8));
                writer.write(jsonBody.toString());
                writer.flush();
                writer.close();
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();
                    callback.onSuccess(response);
                } else {
                    callback.onError("HTTP Error: " + responseCode);
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("HistoryApiHelper", "Error adding search history item", e);
                callback.onError(e.getMessage());
            }
        }).start();
    }

}