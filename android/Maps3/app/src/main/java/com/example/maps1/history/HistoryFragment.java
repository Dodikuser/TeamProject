package com.example.maps1.history;

import android.content.Intent;
import android.os.Bundle;
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
import com.example.maps1.history.HistoryItem;


import java.util.ArrayList;
import java.util.List;

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

        // Create adapter with empty list for now
        adapter = new HistoryAdapter(filteredItems, item -> {
            // Handle item click - open PlaceDetailsActivity
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

        // Load history items (in real app this would come from cache/database)
        loadHistoryItems();

        return view;
    }

    private void loadHistoryItems() {
        // TODO: Replace with actual data loading from cache/database
        // For now we'll add some dummy data
        historyItems.clear();
        historyItems.add(new HistoryItem("1", "Ресторан 'Український'",
                "вул. Хрещатик, 15", "Традиційна українська кухня", 4.5f, ""));
        historyItems.add(new HistoryItem("2", "Кафе 'Цукерня'",
                "вул. Б. Хмельницького, 37", "Кава та десерти", 4.2f, ""));
        historyItems.add(new HistoryItem("3", "Парк 'Перемоги'",
                "просп. Перемоги, 82", "Великий парк для відпочинку", 4.7f, ""));

        filteredItems.clear();
        filteredItems.addAll(historyItems);
        adapter.notifyDataSetChanged();
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
                        item.getDescription().toLowerCase().contains(lowerCaseQuery)) {
                    filteredItems.add(item);
                }
            }
        }

        adapter.notifyDataSetChanged();
    }
}