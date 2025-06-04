package com.example.maps1.history;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.SearchView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.maps1.PlaceDetailsActivity;
import com.example.maps1.R;
import com.example.maps1.utils.PlaceUtils;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedWriter;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Scanner;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.TextStyle;
import java.time.temporal.ChronoField;
import java.util.Locale;

public class HistoryFragment extends Fragment {

    private static final String BASE_URL = "https://10.0.2.2:7103/api";

    private RecyclerView recyclerView;
    private HistoryAdapter historyAdapter;
    private SearchHistoryAdapter searchHistoryAdapter;
    private List<HistoryItem> historyItems = new ArrayList<>();
    private List<HistoryItem> filteredHistoryItems = new ArrayList<>();
    private List<SearchHistoryItem> searchHistoryItems = new ArrayList<>();
    private List<SearchHistoryItem> filteredSearchItems = new ArrayList<>();

    private Button btnVisitHistory;
    private Button btnSearchHistory;
    private boolean isShowingVisitHistory = true;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_history, container, false);

        // Initialize views
        recyclerView = view.findViewById(R.id.search_history_recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setHasFixedSize(true);

        btnVisitHistory = view.findViewById(R.id.btn_visit_history);
        btnSearchHistory = view.findViewById(R.id.btn_search_history);

        historyAdapter = new HistoryAdapter(filteredHistoryItems, new HistoryAdapter.OnHistoryItemClickListener() {
            @Override
            public void onItemClick(HistoryItem item) {
                android.content.SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", android.content.Context.MODE_PRIVATE);
                String token = prefs.getString("auth_token", null);
                if (token != null) {
                    PlaceUtils.addPlaceToHistory(requireContext(), token, item.getId());
                }
                PlaceUtils.fetchPlaceDetails(requireContext(), item.getId(), place -> {
                    Intent intent = new Intent(getActivity(), com.example.maps1.PlaceDetailsActivity.class);
                    intent.putExtra("place", place);
                    startActivity(intent);
                });
            }

            @Override
            public void onFavoriteClick(HistoryItem item, boolean addToFavorites) {
                toggleFavorite(item, addToFavorites);
            }

            @Override
            public void onDeleteClick(HistoryItem item) {
                new androidx.appcompat.app.AlertDialog.Builder(requireContext())
                        .setTitle("Удалить из истории")
                        .setMessage("Вы уверены, что хотите удалить это место из истории?")
                        .setPositiveButton("Удалить", (dialog, which) -> {
                            deleteHistoryItem(item);
                        })
                        .setNegativeButton("Отмена", null)
                        .show();
            }
        });
        searchHistoryAdapter = new SearchHistoryAdapter(filteredSearchItems, new SearchHistoryAdapter.OnSearchHistoryClickListener() {
            @Override
            public void onItemClick(SearchHistoryItem item) {
                performSearch(item.getQuery());
            }

            @Override
            public void onDeleteClick(SearchHistoryItem item) {
                deleteSearchHistoryItem(item);
            }
        });

        // Setup button listeners
        btnVisitHistory.setOnClickListener(v -> showVisitHistory());
        btnSearchHistory.setOnClickListener(v -> showSearchHistory());

        // Setup search view
        SearchView searchView = view.findViewById(R.id.search_view);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                if (isShowingVisitHistory) {
                    searchPlaceHistory(query);
                } else {
                    searchSearchHistory(query);
                }
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                if (newText.isEmpty()) {
                    if (isShowingVisitHistory) {
                        loadPlaceHistory();
                    } else {
                        loadSearchHistory();
                    }
                }
                return true;
            }
        });

        // Load data and show default view
        showVisitHistory();

        return view;
    }

    private void showVisitHistory() {
        isShowingVisitHistory = true;

        // Set adapter
        recyclerView.setAdapter(historyAdapter);

        // Load data
        loadPlaceHistory();

        Log.d("HistoryFragment", "Showing visit history");
    }

    private void showSearchHistory() {
        isShowingVisitHistory = false;

        // Set adapter
        recyclerView.setAdapter(searchHistoryAdapter);

        // Load data
        loadSearchHistory();

        Log.d("HistoryFragment", "Showing search history");
    }

    private void loadPlaceHistory() {
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        if (token == null) {
            Log.e("HistoryFragment", "No auth token found");
            return;
        }

        new Thread(() -> {
            try {
                URL url = new URL(BASE_URL + "/history/places/get");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                // Send request body with pagination
                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                writer.write("skip=0&take=50");
                writer.flush();
                writer.close();
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();
                    JSONObject jsonResponse = new JSONObject(response);
                    JSONArray histoires = jsonResponse.getJSONObject("histoires").getJSONArray("$values");

                    historyItems.clear();
                    for (int i = 0; i < histoires.length(); i++) {
                        JSONObject item = histoires.getJSONObject(i);
                        String visitDateTime = item.getString("visitDateTime");
                        JSONObject placeDTO = item.getJSONObject("placeDTO");

                        // Parse date and time
                        String[] dateTime = formatDateTime(visitDateTime);

                        // Get photo URL if available
                        String imageUrl = "";
                        if (placeDTO.has("photo") && !placeDTO.isNull("photo")) {
                            JSONObject photo = placeDTO.getJSONObject("photo");
                            imageUrl = photo.getString("path");
                        }

                        // Проверяем статус избранного
                        boolean isFavorite = false;
                        if (placeDTO.has("isFavorite")) {
                            isFavorite = placeDTO.getBoolean("isFavorite");
                        }

                        historyItems.add(new HistoryItem(
                                item.getString("gmapsPlaceId"),
                                placeDTO.getString("name"),
                                placeDTO.getString("address"),
                                dateTime[0], // date
                                dateTime[1], // time
                                imageUrl,
                                item.getLong("historyId"),
                                isFavorite // новый параметр
                        ));
                    }

                    requireActivity().runOnUiThread(() -> {
                        filteredHistoryItems.clear();
                        filteredHistoryItems.addAll(historyItems);
                        historyAdapter.notifyDataSetChanged();
                    });
                } else {
                    Log.e("HistoryFragment", "Failed to load place history: " + responseCode);
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("HistoryFragment", "Error loading place history", e);
            }
        }).start();
    }

    private void loadSearchHistory() {
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        if (token == null) {
            Log.e("HistoryFragment", "No auth token found");
            return;
        }

        new Thread(() -> {
            try {
                URL url = new URL(BASE_URL + "/history/requests/get");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                // Send request body with pagination
                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                writer.write("skip=0&take=50");
                writer.flush();
                writer.close();
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();
                    JSONObject jsonResponse = new JSONObject(response);
                    JSONArray searches = jsonResponse.getJSONObject("searches").getJSONArray("$values");

                    searchHistoryItems.clear();
                    for (int i = 0; i < searches.length(); i++) {
                        JSONObject item = searches.getJSONObject(i);
                        String searchDateTime = item.getString("searchDateTime");
                        String[] dateTime = formatDateTime(searchDateTime);

                        searchHistoryItems.add(new SearchHistoryItem(
                                String.valueOf(item.getLong("userId")), // Using userId as ID
                                item.getString("text"),
                                dateTime[0], // date
                                dateTime[1],  // time
                                item.getLong("historyId")
                        ));
                    }

                    requireActivity().runOnUiThread(() -> {
                        filteredSearchItems.clear();
                        filteredSearchItems.addAll(searchHistoryItems);
                        searchHistoryAdapter.notifyDataSetChanged();
                    });
                } else {
                    Log.e("HistoryFragment", "Failed to load search history: " + responseCode);
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("HistoryFragment", "Error loading search history", e);
            }
        }).start();
    }

    private void searchPlaceHistory(String keyword) {
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        if (token == null) {
            Log.e("HistoryFragment", "No auth token found");
            return;
        }

        new Thread(() -> {
            try {
                String fullUrl = BASE_URL + "/history/places/search"
                        + "?keyword=" + URLEncoder.encode(keyword, "UTF-8")
                        + "&skip=0&take=50";

                URL url = new URL(fullUrl);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.connect();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();
                    JSONObject jsonResponse = new JSONObject(response);
                    JSONArray histoires = jsonResponse.getJSONObject("histoires").getJSONArray("$values");

                    List<HistoryItem> searchResults = new ArrayList<>();
                    for (int i = 0; i < histoires.length(); i++) {
                        JSONObject item = histoires.getJSONObject(i);
                        String visitDateTime = item.getString("visitDateTime");
                        JSONObject placeDTO = item.getJSONObject("placeDTO");

                        String[] dateTime = formatDateTime(visitDateTime);

                        String imageUrl = "";
                        if (placeDTO.has("photo") && !placeDTO.isNull("photo")) {
                            JSONObject photo = placeDTO.getJSONObject("photo");
                            imageUrl = photo.getString("path");
                        }

                        // Проверяем статус избранного
                        boolean isFavorite = false;
                        if (placeDTO.has("isFavorite")) {
                            isFavorite = placeDTO.getBoolean("isFavorite");
                        }

                        searchResults.add(new HistoryItem(
                                item.getString("gmapsPlaceId"),
                                placeDTO.getString("name"),
                                placeDTO.getString("address"),
                                dateTime[0],
                                dateTime[1],
                                imageUrl,
                                item.getLong("historyId"),
                                isFavorite // новый параметр
                        ));
                    }

                    requireActivity().runOnUiThread(() -> {
                        filteredHistoryItems.clear();
                        filteredHistoryItems.addAll(searchResults);
                        historyAdapter.notifyDataSetChanged();
                    });
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("HistoryFragment", "Error searching place history", e);
            }
        }).start();
    }

    private void searchSearchHistory(String keyword) {
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        if (token == null) {
            Log.e("HistoryFragment", "No auth token found");
            return;
        }

        new Thread(() -> {
            try {
                String fullUrl = BASE_URL + "/history/requests/search"
                        + "?keyword=" + URLEncoder.encode(keyword, "UTF-8")
                        + "&skip=0&take=50";

                URL url = new URL(fullUrl);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST"); // или GET, если бэкенд допускает
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.connect();


                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();
                    JSONObject jsonResponse = new JSONObject(response);
                    JSONArray searches = jsonResponse.getJSONObject("searches").getJSONArray("$values");

                    List<SearchHistoryItem> searchResults = new ArrayList<>();
                    for (int i = 0; i < searches.length(); i++) {
                        JSONObject item = searches.getJSONObject(i);
                        String searchDateTime = item.getString("searchDateTime");
                        String[] dateTime = formatDateTime(searchDateTime);

                        searchResults.add(new SearchHistoryItem(
                                String.valueOf(item.getLong("userId")),
                                item.getString("text"),
                                dateTime[0],
                                dateTime[1],
                                item.getLong("historyId")
                        ));
                    }

                    requireActivity().runOnUiThread(() -> {
                        filteredSearchItems.clear();
                        filteredSearchItems.addAll(searchResults);
                        searchHistoryAdapter.notifyDataSetChanged();
                    });
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("HistoryFragment", "Error searching search history", e);
            }
        }).start();
    }

    private void performSearch(String query) {
        // Здесь можно добавить логику для выполнения поиска
        Log.d("HistoryFragment", "Performing search for: " + query);
    }

    private void deleteSearchHistoryItem(SearchHistoryItem item) {
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        new Thread(() -> {
            try {
                URL url = new URL(BASE_URL + "/history/requests/action?historyAction=Remove");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                JSONObject searchDto = new JSONObject();
                searchDto.put("HistoryId", item.getHistoryId());

                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                writer.write(searchDto.toString());
                writer.flush();
                writer.close();
                os.close();


                int responseCode = conn.getResponseCode();
                if (responseCode != 200) {
                    Log.e("HistoryFragment", "Request failed with code: " + responseCode);
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("HistoryFragment", "Error sending history action request", e);
            }
        }).start();

        searchHistoryItems.remove(item);
        filteredSearchItems.remove(item);
        searchHistoryAdapter.notifyDataSetChanged();

        Log.d("HistoryFragment", "Deleted search item: " + item.getQuery());
    }

    private String[] formatDateTime(String dateTimeString) {
        try {
            // Parse ISO 8601 format: 2025-05-25T12:51:12.4857489
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSSSSS", Locale.getDefault());
            Date date = inputFormat.parse(dateTimeString);

            SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMMM yyyy", new Locale("uk", "UA"));
            SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss", Locale.getDefault());

            return new String[]{dateFormat.format(date), timeFormat.format(date)};
        } catch (Exception e) {
            Log.e("HistoryFragment", "Error parsing date: " + dateTimeString, e);
            return new String[]{"", ""};
        }
    }

    // Добавьте эти методы в ваш HistoryFragment класс

    private void deleteHistoryItem(HistoryItem item) {
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        if (token == null) {
            Log.e("HistoryFragment", "No auth token found");
            return;
        }

        new Thread(() -> {
            try {
                URL url = new URL(BASE_URL + "/history/places/action?historyAction=Remove");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                // Создаем JSON объект для тела запроса
                JSONObject historyDto = new JSONObject();
                historyDto.put("HistoryId", item.getHistoryId());

                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                writer.write(historyDto.toString());
                writer.flush();
                writer.close();
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    // Удаляем элемент из списков и обновляем адаптер
                    requireActivity().runOnUiThread(() -> {
                        historyItems.remove(item);
                        filteredHistoryItems.remove(item);
                        historyAdapter.notifyDataSetChanged();
                    });
                    Log.d("HistoryFragment", "Successfully deleted history item");
                } else {
                    Log.e("HistoryFragment", "Failed to delete history item: " + responseCode);
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("HistoryFragment", "Error deleting history item", e);
            }
        }).start();

        Log.d("HistoryFragment", "Deleted history item: " + item.getName());
    }

    private void toggleFavorite(HistoryItem item, boolean addToFavorites) {
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        if (token == null) {
            Log.e("HistoryFragment", "No auth token found");
            return;
        }

        new Thread(() -> {
            try {
                String action = addToFavorites ? "Add" : "Remove";
                URL url = new URL("https://10.0.2.2:7103/api/Favorites/action?gmapsPlaceId="
                        + URLEncoder.encode(item.getId(), "UTF-8") +
                        "&action=" + action);

                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                conn.setDoOutput(true);
                conn.setDoInput(true);

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    requireActivity().runOnUiThread(() -> {
                        // Здесь можно обновить UI для показа состояния лайка
                        // Например, изменить цвет иконки сердечка
                        Log.d("HistoryFragment", "Successfully " + (addToFavorites ? "added to" : "removed from") + " favorites");
                    });
                } else {
                    Log.e("HistoryFragment", "Failed to toggle favorite: " + responseCode);
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("HistoryFragment", "Error toggling favorite", e);
            }
        }).start();
    }

    // Также добавьте trustAllCertificates метод, если его еще нет в классе
    private static void trustAllCertificates() {
        try {
            javax.net.ssl.TrustManager[] trustAllCerts = new javax.net.ssl.TrustManager[] {
                    new javax.net.ssl.X509TrustManager() {
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                            return null;
                        }
                        public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {
                        }
                        public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {
                        }
                    }
            };

            javax.net.ssl.SSLContext sc = javax.net.ssl.SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            javax.net.ssl.HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

            javax.net.ssl.HostnameVerifier allHostsValid = new javax.net.ssl.HostnameVerifier() {
                public boolean verify(String hostname, javax.net.ssl.SSLSession session) {
                    return true;
                }
            };
            javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
        } catch (Exception e) {
            Log.e("HistoryFragment", "Error setting up SSL", e);
        }
    }

}