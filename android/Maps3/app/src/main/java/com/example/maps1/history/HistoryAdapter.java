package com.example.maps1.history;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.maps1.R;

import java.util.List;

public class HistoryAdapter extends RecyclerView.Adapter<HistoryAdapter.HistoryViewHolder> {

    public interface OnItemClickListener {
        void onItemClick(HistoryItem item);
    }

    private List<HistoryItem> items;
    private OnItemClickListener listener;

    public HistoryAdapter(List<HistoryItem> items, OnItemClickListener listener) {
        this.items = items;
        this.listener = listener;
    }

    @NonNull
    @Override
    public HistoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_history, parent, false);
        return new HistoryViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull HistoryViewHolder holder, int position) {
        Log.d("HistoryAdapter", "Binding item at position: " + position);

        HistoryItem item = items.get(position);

        holder.name.setText(item.getName());
        holder.address.setText(item.getAddress());
        holder.date.setText(item.getDate()); // Добавьте соответствующий метод в HistoryItem
        holder.time.setText(item.getTime()); // Добавьте соответствующий метод в HistoryItem

        // Load image using Glide
        if (!item.getImageUrl().isEmpty()) {
            Glide.with(holder.itemView.getContext())
                    .load(item.getImageUrl())
                    .placeholder(R.drawable.ic_placeholder)
                    .into(holder.image);
        } else {
            holder.image.setImageResource(R.drawable.ic_placeholder);
        }

        holder.btnGo.setOnClickListener(v -> listener.onItemClick(item));
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class HistoryViewHolder extends RecyclerView.ViewHolder {
        ImageView image;
        TextView name;
        TextView address;
        TextView date;
        TextView time;
        Button btnGo;

        public HistoryViewHolder(@NonNull View itemView) {
            super(itemView);
            image = itemView.findViewById(R.id.history_item_image);
            name = itemView.findViewById(R.id.history_item_name);
            address = itemView.findViewById(R.id.history_item_address);
            date = itemView.findViewById(R.id.history_item_date);
            time = itemView.findViewById(R.id.history_item_time);
            btnGo = itemView.findViewById(R.id.history_item_btn_go);
        }
    }
}