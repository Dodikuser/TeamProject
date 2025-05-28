package com.example.maps1.recommendations;

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

import java.util.List;

public class RecommendationsAdapter extends RecyclerView.Adapter<RecommendationsAdapter.RecommendationsViewHolder> {

    public interface OnItemClickListener {
        void onItemClick(RecommendationsItem item);
        void onLikeClick(RecommendationsItem item);
    }

    private List<RecommendationsItem> items;
    private OnItemClickListener listener;

    public RecommendationsAdapter(List<RecommendationsItem> items, OnItemClickListener listener) {
        this.items = items;
        this.listener = listener;
    }

    @NonNull
    @Override
    public RecommendationsViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_recommendation, parent, false);
        return new RecommendationsViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecommendationsViewHolder holder, int position) {
        RecommendationsItem item = items.get(position);

        holder.name.setText(item.getName());
        holder.address.setText(item.getAddress());
        holder.distance.setText(item.getDistance());
        holder.ratingText.setText(String.valueOf(item.getRating()));

        // Load image
        if (item.getImageUrl() != null && !item.getImageUrl().isEmpty()) {
            Glide.with(holder.itemView.getContext())
                    .load(item.getImageUrl())
                    .placeholder(R.drawable.ic_placeholder)
                    .into(holder.image);
        } else {
            holder.image.setImageResource(R.drawable.ic_placeholder);
        }

        // Update like button state
        updateLikeButton(holder.favoriteIcon, item.isLiked());

        holder.btnGo.setOnClickListener(v -> listener.onItemClick(item));
        holder.favoriteIcon.setOnClickListener(v -> {
            if (listener != null) {
                listener.onLikeClick(item);
            }
        });
    }

    private void updateLikeButton(ImageView favoriteIcon, boolean isLiked) {
        favoriteIcon.setImageResource(R.drawable.ic_favorite);
        favoriteIcon.setColorFilter(isLiked ? 
            favoriteIcon.getContext().getColor(R.color.liked_color) : 
            favoriteIcon.getContext().getColor(R.color.unliked_color));
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class RecommendationsViewHolder extends RecyclerView.ViewHolder {
        ImageView image;
        TextView name;
        TextView address;
        TextView distance;
        TextView ratingText;
        Button btnGo;
        ImageView favoriteIcon;

        public RecommendationsViewHolder(@NonNull View itemView) {
            super(itemView);
            image = itemView.findViewById(R.id.recommendations_item_image);
            name = itemView.findViewById(R.id.recommendations_item_name);
            address = itemView.findViewById(R.id.recommendations_item_address);
            distance = itemView.findViewById(R.id.recommendations_item_distance);
            ratingText = itemView.findViewById(R.id.recommendations_item_rating_text);
            btnGo = itemView.findViewById(R.id.recommendations_item_btn_go);
            favoriteIcon = itemView.findViewById(R.id.recommendations_item_favorite);
        }
    }
}