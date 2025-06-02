package com.example.maps1.history;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.maps1.R;

import java.util.List;

public class SearchHistoryAdapter extends RecyclerView.Adapter<SearchHistoryAdapter.SearchHistoryViewHolder> {

    public interface OnSearchHistoryClickListener {
        void onItemClick(SearchHistoryItem item);
        void onDeleteClick(SearchHistoryItem item);
    }

    private List<SearchHistoryItem> items;
    private OnSearchHistoryClickListener listener;

    public SearchHistoryAdapter(List<SearchHistoryItem> items, OnSearchHistoryClickListener listener) {
        this.items = items;
        this.listener = listener;
    }

    @NonNull
    @Override
    public SearchHistoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_search_history, parent, false);
        return new SearchHistoryViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull SearchHistoryViewHolder holder, int position) {
        Log.d("SearchHistoryAdapter", "Binding item at position: " + position);

        SearchHistoryItem item = items.get(position);

        holder.searchQuery.setText(item.getQuery());
        holder.searchDateTime.setText(item.getDateTime());

        // Click listeners
        holder.itemView.setOnClickListener(v -> listener.onItemClick(item));
        holder.goButton.setOnClickListener(v -> listener.onItemClick(item));
        holder.deleteSearch.setOnClickListener(v -> listener.onDeleteClick(item));
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class SearchHistoryViewHolder extends RecyclerView.ViewHolder {
        TextView searchQuery;
        TextView searchDateTime;
        TextView goButton;
        ImageView deleteSearch;

        public SearchHistoryViewHolder(@NonNull View itemView) {
            super(itemView);
            searchQuery = itemView.findViewById(R.id.search_query);
            searchDateTime = itemView.findViewById(R.id.search_date_time);
            goButton = itemView.findViewById(R.id.go_button);
            deleteSearch = itemView.findViewById(R.id.delete_search);
        }
    }
}