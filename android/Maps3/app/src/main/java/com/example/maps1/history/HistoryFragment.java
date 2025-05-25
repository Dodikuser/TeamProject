package com.example.maps1.history;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SearchView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
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

public class HistoryFragment extends Fragment {

    private RecyclerView recyclerView;
    private HistoryAdapter adapter;
    private List<HistoryItem> historyItems = new ArrayList<>();
    private List<HistoryItem> filteredItems = new ArrayList<>();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_history, container, false);

        // Initialize RecyclerView
        recyclerView = view.findViewById(R.id.history_recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setHasFixedSize(true);

        // Create adapter
        adapter = new HistoryAdapter(filteredItems, item -> {
            Intent intent = new Intent(getActivity(), PlaceDetailsActivity.class);
            intent.putExtra("place_id", item.getId());
            startActivity(intent);
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
                filterHistoryItems(newText);
                return true;
            }
        });

        // Load history items
        testloadHistoryItems();

        return view;
    }

    private void loadHistoryItems() {
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);

        if (token == null) {
            return;
        }

        new Thread(() -> {
            try {
                URL url = new URL("http://10.0.2.2:7103/api/History");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setDoInput(true);

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    InputStream is = conn.getInputStream();
                    String response = new Scanner(is).useDelimiter("\\A").next();
                    JSONArray jsonArray = new JSONArray(response);

                    historyItems.clear();
                    for (int i = 0; i < jsonArray.length(); i++) {
                        JSONObject item = jsonArray.getJSONObject(i);
                        historyItems.add(new HistoryItem(
                                item.getString("id"),
                                item.getString("name"),
                                item.getString("address"),
                                item.getString("date"),  // Используем новое поле даты
                                item.getString("time"),  // Используем новое поле времени
                                item.getString("imageUrl")
                        ));
                    }

                    requireActivity().runOnUiThread(() -> {
                        filteredItems.clear();
                        filteredItems.addAll(historyItems);
                        adapter.notifyDataSetChanged();
                    });
                }
                conn.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void testloadHistoryItems() {
        historyItems.clear();
        // Тестовые данные с датой и временем вместо описания и рейтинга
        historyItems.add(new HistoryItem("1", "Ресторан 'Український'",
                "вул. Хрещатик, 15", "15 травня 2023", "12:30", ""));
        historyItems.add(new HistoryItem("2", "Кафе 'Цукерня'",
                "вул. Б. Хмельницького, 37", "16 травня 2023", "14:45", ""));
        historyItems.add(new HistoryItem("3", "Парк 'Перемоги'",
                "просп. Перемоги, 82", "17 травня 2023", "10:15", ""));

        filteredItems.clear();
        filteredItems.addAll(historyItems);
        adapter.notifyDataSetChanged();

        Log.d("HistoryFragment", "Loaded items: " + filteredItems.size());
    }

    private void filterHistoryItems(String query) {
        filteredItems.clear();

        if (query.isEmpty()) {
            filteredItems.addAll(historyItems);
        } else {
            String lowerCaseQuery = query.toLowerCase();
            for (HistoryItem item : historyItems) {
                if (item.getName().toLowerCase().contains(lowerCaseQuery) ||
                        item.getAddress().toLowerCase().contains(lowerCaseQuery) ||
                        item.getDate().toLowerCase().contains(lowerCaseQuery) ||  // Поиск по дате
                        item.getTime().toLowerCase().contains(lowerCaseQuery)) {  // Поиск по времени
                    filteredItems.add(item);
                }
            }
        }

        adapter.notifyDataSetChanged();
    }
}