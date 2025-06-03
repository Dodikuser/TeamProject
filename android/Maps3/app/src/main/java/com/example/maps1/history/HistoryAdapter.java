package com.example.maps1.history;

import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.maps1.R;
import com.example.maps1.places.PlaceDetailsActivity;

import java.util.List;

public class HistoryAdapter extends RecyclerView.Adapter<HistoryAdapter.HistoryViewHolder> {

    public interface OnItemClickListener {
        void onItemClick(HistoryItem item);
        void onDeleteClick(HistoryItem item);
        void onFavoriteClick(HistoryItem item);
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
        holder.date.setText(item.getDate());
        holder.time.setText(item.getTime());

        if (!item.getImageUrl().isEmpty()) {
            Glide.with(holder.itemView.getContext())
                    .load(item.getImageUrl())
                    .placeholder(R.drawable.placeholder)
                    .into(holder.image);
        } else {
            holder.image.setImageResource(R.drawable.placeholder);
        }

        holder.btnGo.setOnClickListener(v -> listener.onItemClick(item));
        holder.delete.setOnClickListener(v -> listener.onDeleteClick(item));
        holder.favorite.setOnClickListener(v -> listener.onFavoriteClick(item));
        holder.btnGo.setOnClickListener(v -> {
            Intent intent = new Intent(holder.itemView.getContext(), PlaceDetailsActivity.class);
            intent.putExtra("place_name", item.getName());
            intent.putExtra("place_address", item.getAddress());
            intent.putExtra("place_id", item.getId());
            // Додаткові поля, якщо є
            holder.itemView.getContext().startActivity(intent);
        });
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
        ImageView delete;
        ImageView favorite;

        public HistoryViewHolder(@NonNull View itemView) {
            super(itemView);
            image = itemView.findViewById(R.id.history_item_image);
            name = itemView.findViewById(R.id.history_item_name);
            address = itemView.findViewById(R.id.history_item_address);
            date = itemView.findViewById(R.id.history_item_date);
            time = itemView.findViewById(R.id.history_item_time);
            btnGo = itemView.findViewById(R.id.history_item_btn_go);
            delete = itemView.findViewById(R.id.history_item_delete);
            favorite = itemView.findViewById(R.id.history_item_favorite);
        }
    }
}