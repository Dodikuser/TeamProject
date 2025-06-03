package com.example.maps1.recommendations;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SearchView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.maps1.places.PlaceDetailsActivity;
import com.example.maps1.R;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class RecommendationsFragment extends Fragment {
    private RecyclerView recyclerView;
    private RecommendationsAdapter adapter;
    private List<RecommendationsItem> recommendationsItems = new ArrayList<>();
    private List<RecommendationsItem> filteredItems = new ArrayList<>();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_recommendations, container, false);

        recyclerView = view.findViewById(R.id.recommendationsRecyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setHasFixedSize(true);

        adapter = new RecommendationsAdapter(filteredItems, new RecommendationsAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(RecommendationsItem item) {
                Intent intent = new Intent(getActivity(), PlaceDetailsActivity.class);
                intent.putExtra("place_name", item.getName());
                intent.putExtra("place_address", item.getAddress());
                intent.putExtra("place_rating", item.getRating());
                intent.putExtra("place_image_url", item.getImageUrl());
                startActivity(intent);
            }

            @Override
            public void onFavoriteClick(RecommendationsItem item) {
                addToFavorites(item);
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
                filterRecommendationsItems(newText);
                return true;
            }
        });

        loadRecommendationsItems();

        return view;
    }

    private void addToFavorites(RecommendationsItem item) {
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        if (token == null) {
            Toast.makeText(getContext(), "Будь ласка, увійдіть в систему", Toast.LENGTH_SHORT).show();
            return;
        }

        new Thread(() -> {
            try {
                URL url = new URL("http://10.0.2.2:7103/api/Favorites");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                JSONObject jsonParam = new JSONObject();
                jsonParam.put("name", item.getName());
                jsonParam.put("address", item.getAddress());
                jsonParam.put("description", item.getDescription());
                jsonParam.put("rating", item.getRating());
                jsonParam.put("imageUrl", item.getImageUrl());
                // Додайте інші необхідні поля

                OutputStream os = conn.getOutputStream();
                os.write(jsonParam.toString().getBytes("UTF-8"));
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    requireActivity().runOnUiThread(() -> {
                        Toast.makeText(getContext(), "Місце додано до улюблених", Toast.LENGTH_SHORT).show();
                    });
                }
                conn.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
                requireActivity().runOnUiThread(() -> {
                    Toast.makeText(getContext(), "Помилка при додаванні до улюблених", Toast.LENGTH_SHORT).show();
                });
            }
        }).start();
    }
    private void loadRecommendationsItems() {
        recommendationsItems.clear();

        // Add test recommendations data
        recommendationsItems.add(new RecommendationsItem(
                "Ресторан 'Смачний'",
                "вул. Головна, 10",
                "Європейська кухня",
                4.7f,
                "https://example.com/image1.jpg",
                "1.2 км"
        ));

        recommendationsItems.add(new RecommendationsItem(
                "Кафе 'Аромат'",
                "вул. Лісова, 5",
                "Кава та десерти",
                4.5f,
                "https://example.com/image2.jpg",
                "0.8 км"
        ));

        recommendationsItems.add(new RecommendationsItem(
                "Піцерія 'Італія'",
                "вул. Італійська, 15",
                "Справжня італійська піца",
                4.3f,
                "https://example.com/image3.jpg",
                "2.1 км"
        ));

        recommendationsItems.add(new RecommendationsItem(
                "Бар 'Ретро'",
                "вул. Стародавня, 22",
                "Коктейлі та музика",
                4.8f,
                "https://example.com/image4.jpg",
                "1.5 км"
        ));

        filteredItems.clear();
        filteredItems.addAll(recommendationsItems);
        adapter.notifyDataSetChanged();
    }

    private void filterRecommendationsItems(String query) {
        filteredItems.clear();

        if (query.isEmpty()) {
            filteredItems.addAll(recommendationsItems);
        } else {
            String lowerCaseQuery = query.toLowerCase();
            for (RecommendationsItem item : recommendationsItems) {
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