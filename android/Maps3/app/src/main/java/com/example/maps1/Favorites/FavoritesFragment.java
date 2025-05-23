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

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_favorites, container, false);

        recyclerView = view.findViewById(R.id.favorites_recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setHasFixedSize(true);

        adapter = new FavoritesAdapter(filteredItems, new FavoritesAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(FavoritesItem item) {
                // Open place details
                Intent intent = new Intent(getActivity(), PlaceDetailsActivity.class);
                intent.putExtra("place_id", item.getId());
                startActivity(intent);
            }

            @Override
            public void onRemoveClick(FavoritesItem item) {
                removeFromFavorites(item);
            }
        });
        recyclerView.setAdapter(adapter);

        // Setup search view
        SearchView searchView = view.findViewById(R.id.search_view);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                filterFavoritesItems(newText);
                return true;
            }
        });

        loadFavoritesItems();

        return view;
    }
    private void loadFavoritesItems() {
        favoritesItems.clear();
        favoritesItems.add(new FavoritesItem("1", "ТЦ Портал'", "вул. Шевченка, 3", "Торговий центр", 4.5f, "", 50.3038, 34.8980));
        favoritesItems.add(new FavoritesItem("2", "Ресторан 'Український'",
                "вул. Хрещатик, 15", "Традиційна українська кухня", 4.5f, "",
                50.4501, 30.5234));
        favoritesItems.add(new FavoritesItem("3", "Кафе 'Цукерня'",
                "вул. Б. Хмельницького, 37", "Кава та десерти", 4.2f, "",
                50.4478, 30.5132));
        favoritesItems.add(new FavoritesItem("4", "Парк 'Перемоги'",
                "просп. Перемоги, 82", "Великий парк для відпочинку", 4.7f, "",
                50.4556, 30.3658));

        filteredItems.clear();
        filteredItems.addAll(favoritesItems);
        adapter.notifyDataSetChanged();

        // Додайте логування для перевірки
        Log.d("FavoritesFragment", "Loaded test favorites items: " + filteredItems.size());
    }
    private void loadFavoritesItems2() {
        // Get auth token from shared preferences
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        if (token == null) {
            // User not logged in
            return;
        }

        new Thread(() -> {
            try {
                URL url = new URL("http://10.0.2.2:7103/api/Favorites");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setDoInput(true);

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();
                    JSONArray jsonArray = new JSONArray(response);

                    favoritesItems.clear();
                    for (int i = 0; i < jsonArray.length(); i++) {
                        JSONObject item = jsonArray.getJSONObject(i);
                        favoritesItems.add(new FavoritesItem(
                                item.getString("id"),
                                item.getString("name"),
                                item.getString("address"),
                                item.getString("description"),
                                (float) item.getDouble("rating"),
                                item.getString("imageUrl"),
                                item.getDouble("latitude"),
                                item.getDouble("longitude")
                        ));
                    }

                    requireActivity().runOnUiThread(() -> {
                        filteredItems.clear();
                        filteredItems.addAll(favoritesItems);
                        adapter.notifyDataSetChanged();
                    });
                }
                conn.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
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
                URL url = new URL("http://10.0.2.2:7103/api/Favorites/" + item.getId());
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("DELETE");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setDoInput(true);

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    requireActivity().runOnUiThread(() -> {
                        favoritesItems.remove(item);
                        filterFavoritesItems("");
                        Toast.makeText(getContext(), "Місце видалено з улюблених", Toast.LENGTH_SHORT).show();
                    });
                }
                conn.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void filterFavoritesItems(String query) {
        filteredItems.clear();

        if (query.isEmpty()) {
            filteredItems.addAll(favoritesItems);
        } else {
            String lowerCaseQuery = query.toLowerCase();
            for (FavoritesItem item : favoritesItems) {
                if (item.getName().toLowerCase().contains(lowerCaseQuery) ||
                        item.getAddress().toLowerCase().contains(lowerCaseQuery) ||
                        item.getDescription().toLowerCase().contains(lowerCaseQuery)) {
                    filteredItems.add(item);
                }
            }
        }

        adapter.notifyDataSetChanged();
    }
}