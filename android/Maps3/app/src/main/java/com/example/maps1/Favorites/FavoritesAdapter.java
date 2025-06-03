package com.example.maps1.Favorites;

import android.content.Intent;
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
import com.example.maps1.places.PlaceDetailsActivity;

import java.util.List;

public class FavoritesAdapter extends RecyclerView.Adapter<FavoritesAdapter.FavoritesViewHolder> {

    public interface OnItemClickListener {
        void onItemClick(FavoritesItem item);
        void onRemoveClick(FavoritesItem item);
    }

    private List<FavoritesItem> items;
    private OnItemClickListener listener;

    public FavoritesAdapter(List<FavoritesItem> items, OnItemClickListener listener) {
        this.items = items;
        this.listener = listener;
    }

    @NonNull
    @Override
    public FavoritesViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_favorites, parent, false);
        return new FavoritesViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FavoritesViewHolder holder, int position) {
        FavoritesItem item = items.get(position);

        holder.name.setText(item.getName());
        holder.address.setText(item.getAddress());
        holder.rating.setText(String.valueOf(item.getRating()));

        // Load image using Glide
        if (!item.getImageUrl().isEmpty()) {
            Glide.with(holder.itemView.getContext())
                    .load(item.getImageUrl())
                    .placeholder(R.drawable.placeholder)
                    .into(holder.image);
        } else {
            holder.image.setImageResource(R.drawable.placeholder);
        }

        holder.btnGo.setOnClickListener(v -> listener.onItemClick(item));
        holder.btnDelete.setOnClickListener(v -> listener.onRemoveClick(item));
        holder.btnGo.setOnClickListener(v -> {
            Intent intent = new Intent(holder.itemView.getContext(), PlaceDetailsActivity.class);
            intent.putExtra("place_name", item.getName());
            intent.putExtra("place_address", item.getAddress());
            intent.putExtra("place_description", item.getDescription());
            intent.putExtra("place_rating", item.getRating());
            intent.putExtra("place_id", item.getId());
            // Додаткові поля, якщо є
            holder.itemView.getContext().startActivity(intent);
        });
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class FavoritesViewHolder extends RecyclerView.ViewHolder {
        ImageView image;
        TextView name;
        TextView address;
        TextView rating;
        Button btnGo;
        ImageView btnDelete;

        public FavoritesViewHolder(@NonNull View itemView) {
            super(itemView);
            image = itemView.findViewById(R.id.favorites_item_image);
            name = itemView.findViewById(R.id.favorites_item_name);
            address = itemView.findViewById(R.id.favorites_item_address);
            rating = itemView.findViewById(R.id.favorites_item_rating_text);
            btnGo = itemView.findViewById(R.id.favorites_item_btn_go);
            btnDelete = itemView.findViewById(R.id.favorites_item_delete);
        }
    }
}