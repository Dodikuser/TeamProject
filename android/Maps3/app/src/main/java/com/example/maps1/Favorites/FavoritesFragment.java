package com.example.maps1.Favorites;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.fragment.app.Fragment;
import android.content.Context;
import android.content.SharedPreferences;

import android.widget.SearchView;
import android.widget.Toast;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.maps1.PlaceDetailsActivity;
import com.example.maps1.R;
import com.example.maps1.account.AccountFragment;
import com.example.maps1.utils.PlaceUtils;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class FavoritesFragment extends Fragment {

    private RecyclerView recyclerView;
    private FavoritesAdapter adapter;
    private List<FavoritesItem> favoritesItems = new ArrayList<>();
    private List<FavoritesItem> filteredItems = new ArrayList<>();
    private SearchView searchView;
    private String currentQuery = "";
    private View emptyView;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_favorites, container, false);

        recyclerView = view.findViewById(R.id.favorites_recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setHasFixedSize(true);

        emptyView = view.findViewById(R.id.empty_view);

        adapter = new FavoritesAdapter(filteredItems, new FavoritesAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(FavoritesItem item) {
                // Open place details через PlaceUtils
                android.content.SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", android.content.Context.MODE_PRIVATE);
                String token = prefs.getString("auth_token", null);
                if (token != null) {
                    PlaceUtils.addPlaceToHistory(requireContext(), token, item.getGmapsPlaceId());
                }
                PlaceUtils.fetchPlaceDetails(requireContext(), item.getGmapsPlaceId(), place -> {
                    Intent intent = new Intent(getActivity(), com.example.maps1.PlaceDetailsActivity.class);
                    intent.putExtra("place", place);
                    startActivity(intent);
                });
            }

            @Override
            public void onRemoveClick(FavoritesItem item) {
                removeFromFavorites(item);
            }
        });
        recyclerView.setAdapter(adapter);

        // Setup search view
        searchView = view.findViewById(R.id.search_view);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                currentQuery = query;
                searchFavorites(query);
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                if (newText.isEmpty()) {
                    currentQuery = "";
                    loadFavoritesItems();
                }
                return true;
            }
        });
        AccountFragment.trustAllCertificates();
        loadFavoritesItems();

        return view;
    }

    private void loadFavoritesItems() {
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        if (token == null) {
            Log.w("FavoritesFragment", "User not logged in");
            return;
        }

        new Thread(() -> {
            try {
                URL url = new URL("https://app.aroundme.pp.ua/api/Favorites/get?skip=0&take=50");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoInput(true);

                int responseCode = conn.getResponseCode();
                Log.d("FavoritesFragment", "Response code: " + responseCode);

                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();
                    Log.d("FavoritesFragment", "Response: " + response);

                    JSONObject jsonResponse = new JSONObject(response);

                    // Используем JsonHelper для безопасной обработки
                    JSONArray favoritesArray = JsonHelper.getArraySafely(jsonResponse, "favorites");

                    favoritesItems.clear();
                    for (int i = 0; i < favoritesArray.length(); i++) {
                        JSONObject favoriteObj = favoritesArray.getJSONObject(i);
                        JSONObject placeObj = JsonHelper.getObjectSafely(favoriteObj, "placeDTO");

                        if (placeObj == null) {
                            Log.w("FavoritesFragment", "Skipping item " + i + " - no placeDTO");
                            continue;
                        }

                        String imageUrl = "";
                        JSONObject photoObj = JsonHelper.getObjectSafely(placeObj, "photo");
                        if (photoObj != null) {
                            imageUrl = JsonHelper.getStringSafely(photoObj, "path", "");
                            if (imageUrl.isEmpty()) {
                                imageUrl = JsonHelper.getStringSafely(photoObj, "url", "");
                            }
                        }

                        // Calculate distance (you might want to implement actual distance calculation)
                        String distance = "н/д";

                        favoritesItems.add(new FavoritesItem(
                                JsonHelper.getStringSafely(placeObj, "gmapsPlaceId", ""),
                                JsonHelper.getStringSafely(placeObj, "name", "Без назви"),
                                JsonHelper.getStringSafely(placeObj, "address", "Адреса не вказана"),
                                "", // description не передается в новом API
                                (float) JsonHelper.getDoubleSafely(placeObj, "stars", 0.0),
                                imageUrl,
                                JsonHelper.getDoubleSafely(placeObj, "latitude", 0.0),
                                JsonHelper.getDoubleSafely(placeObj, "longitude", 0.0),
                                distance
                        ));
                    }

                    requireActivity().runOnUiThread(() -> {
                        filteredItems.clear();
                        filteredItems.addAll(favoritesItems);
                        adapter.notifyDataSetChanged();
                        updateEmptyViewVisibility();
                        Log.d("FavoritesFragment", "Loaded " + filteredItems.size() + " favorites");
                    });
                } else {
                    Log.e("FavoritesFragment", "Error response code: " + responseCode);
                    InputStream errorStream = conn.getErrorStream();
                    if (errorStream != null) {
                        String errorResponse = new Scanner(errorStream).useDelimiter("\\A").next();
                        Log.e("FavoritesFragment", "Error response: " + errorResponse);
                    }
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("FavoritesFragment", "Error loading favorites", e);
                Log.e("FavoritesFragment", "Exception details: " + e.getMessage());
                requireActivity().runOnUiThread(() ->
                        Toast.makeText(getContext(), "Помилка завантаження улюблених: " + e.getMessage(), Toast.LENGTH_LONG).show()
                );
            }
        }).start();
    }

    private void searchFavorites(String query) {
        if (query.isEmpty()) {
            loadFavoritesItems();
            return;
        }

        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        if (token == null) {
            return;
        }

        new Thread(() -> {
            try {
                URL url = new URL("https://app.aroundme.pp.ua/api/Favorites/search?" +
                        "keyWord=" + java.net.URLEncoder.encode(query, "UTF-8") +
                        "&skip=0&take=50");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                conn.setDoOutput(true);
                conn.setDoInput(true);

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();

                    JSONObject jsonResponse = new JSONObject(response);

                    // Используем JsonHelper для безопасной обработки
                    JSONArray resultsArray = JsonHelper.getArraySafely(jsonResponse, "results");

                    List<FavoritesItem> searchResults = new ArrayList<>();
                    for (int i = 0; i < resultsArray.length(); i++) {
                        JSONObject favoriteObj = resultsArray.getJSONObject(i);
                        JSONObject placeObj = JsonHelper.getObjectSafely(favoriteObj, "placeDTO");

                        if (placeObj == null) {
                            Log.w("FavoritesFragment", "Skipping search result " + i + " - no placeDTO");
                            continue;
                        }

                        String imageUrl = "";
                        JSONObject photoObj = JsonHelper.getObjectSafely(placeObj, "photo");
                        if (photoObj != null) {
                            imageUrl = JsonHelper.getStringSafely(photoObj, "path", "");
                            if (imageUrl.isEmpty()) {
                                imageUrl = JsonHelper.getStringSafely(photoObj, "url", "");
                            }
                        }

                        String distance = "н/д";

                        searchResults.add(new FavoritesItem(
                                JsonHelper.getStringSafely(placeObj, "gmapsPlaceId", ""),
                                JsonHelper.getStringSafely(placeObj, "name", "Без назви"),
                                JsonHelper.getStringSafely(placeObj, "address", "Адреса не вказана"),
                                "",
                                (float) JsonHelper.getDoubleSafely(placeObj, "stars", 0.0),
                                imageUrl,
                                JsonHelper.getDoubleSafely(placeObj, "latitude", 0.0),
                                JsonHelper.getDoubleSafely(placeObj, "longitude", 0.0),
                                distance
                        ));
                    }

                    requireActivity().runOnUiThread(() -> {
                        filteredItems.clear();
                        filteredItems.addAll(searchResults);
                        adapter.notifyDataSetChanged();
                        updateEmptyViewVisibility();
                    });
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("FavoritesFragment", "Error searching favorites", e);
                requireActivity().runOnUiThread(() ->
                        Toast.makeText(getContext(), "Помилка пошуку", Toast.LENGTH_SHORT).show()
                );
            }
        }).start();
    }

    private void removeFromFavorites(FavoritesItem item) {
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        if (token == null) {
            return;
        }

        new Thread(() -> {
            try {

                URL url = new URL("https://app.aroundme.pp.ua/api/Favorites/action?gmapsPlaceId="
                        + java.net.URLEncoder.encode(item.getGmapsPlaceId(), "UTF-8") +
                        "&action=Remove");

                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                conn.setDoOutput(true);
                conn.setDoInput(true);

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    requireActivity().runOnUiThread(() -> {
                        favoritesItems.remove(item);
                        filteredItems.remove(item);
                        adapter.notifyDataSetChanged();
                        updateEmptyViewVisibility();
                        Toast.makeText(getContext(), "Місце видалено з улюблених", Toast.LENGTH_SHORT).show();
                    });
                } else {
                    Log.e("FavoritesFragment", "Error removing favorite, response code: " + responseCode);
                    requireActivity().runOnUiThread(() ->
                            Toast.makeText(getContext(), "Помилка видалення з улюблених", Toast.LENGTH_SHORT).show()
                    );
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e("FavoritesFragment", "Error removing favorite", e);
                requireActivity().runOnUiThread(() ->
                        Toast.makeText(getContext(), "Помилка видалення з улюблених", Toast.LENGTH_SHORT).show()
                );
            }
        }).start();
    }

    private void updateEmptyViewVisibility() {
        if (filteredItems.isEmpty()) {
            emptyView.setVisibility(View.VISIBLE);
            recyclerView.setVisibility(View.GONE);
        } else {
            emptyView.setVisibility(View.GONE);
            recyclerView.setVisibility(View.VISIBLE);
        }
    }
}