package com.example.maps1.recommendations;

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

public class RecommendationsAdapter extends RecyclerView.Adapter<RecommendationsAdapter.RecommendationsViewHolder> {

    public interface OnItemClickListener {
        void onItemClick(RecommendationsItem item);
        void onFavoriteClick(RecommendationsItem item);
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
                    .placeholder(R.drawable.placeholder)
                    .into(holder.image);
        } else {
            holder.image.setImageResource(R.drawable.placeholder);
        }

        holder.btnGo.setOnClickListener(v -> listener.onItemClick(item));
        holder.favorite.setOnClickListener(v -> listener.onFavoriteClick(item));
        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(holder.itemView.getContext(), PlaceDetailsActivity.class);
            intent.putExtra("place_name", item.getName());
            intent.putExtra("place_address", item.getAddress());
            intent.putExtra("place_description", item.getDescription());
            intent.putExtra("place_rating", item.getRating());
            intent.putExtra("place_image_url", item.getImageUrl());
            // Додаткові поля, якщо є
            holder.itemView.getContext().startActivity(intent);
        });
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
        ImageView favorite;

        public RecommendationsViewHolder(@NonNull View itemView) {
            super(itemView);
            image = itemView.findViewById(R.id.recommendations_item_image);
            name = itemView.findViewById(R.id.recommendations_item_name);
            address = itemView.findViewById(R.id.recommendations_item_address);
            distance = itemView.findViewById(R.id.recommendations_item_distance);
            ratingText = itemView.findViewById(R.id.recommendations_item_rating_text);
            btnGo = itemView.findViewById(R.id.recommendations_item_btn_go);
            favorite = itemView.findViewById(R.id.recommendations_item_favorite);
        }
    }
}
/*package com.example.maps1.recommendations;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.maps1.R;
import com.google.android.libraries.places.api.Places;
import com.google.android.libraries.places.api.model.PhotoMetadata;
import com.google.android.libraries.places.api.model.Place;
import com.google.android.libraries.places.api.net.FetchPhotoRequest;
import com.google.android.libraries.places.api.net.PlacesClient;

import java.util.List;

public class RecommendationsAdapter extends RecyclerView.Adapter<RecommendationsAdapter.ViewHolder> {
    private List<Place> places;
    private OnPlaceClickListener listener;

    public interface OnPlaceClickListener {
        void onPlaceClick(Place place);
    }

    public RecommendationsAdapter(List<Place> places, OnPlaceClickListener listener) {
        this.places = places;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_recommendation, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Place place = places.get(position);

        holder.nameTextView.setText(place.getName());
        holder.addressTextView.setText(place.getAddress());

        if (place.getRating() != null) {
            holder.ratingBar.setRating(place.getRating().floatValue());
        }

        // Завантаження зображення (якщо є)
        if (place.getPhotoMetadatas() != null && !place.getPhotoMetadatas().isEmpty()) {
            loadPlacePhoto(holder.imageView, place.getPhotoMetadatas().get(0));
        }

        holder.goButton.setOnClickListener(v -> listener.onPlaceClick(place));
    }

    private void loadPlacePhoto(ImageView imageView, PhotoMetadata photoMetadata) {
        FetchPhotoRequest photoRequest = FetchPhotoRequest.builder(photoMetadata)
                .setMaxWidth(300)
                .build();

        PlacesClient placesClient = Places.createClient(imageView.getContext());
        placesClient.fetchPhoto(photoRequest)
                .addOnSuccessListener(fetchPhotoResponse -> {
                    imageView.setImageBitmap(fetchPhotoResponse.getBitmap());
                });
    }

    @Override
    public int getItemCount() {
        return places.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        ImageView imageView;
        TextView nameTextView;
        TextView addressTextView;
        RatingBar ratingBar;
        Button goButton;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            imageView = itemView.findViewById(R.id.recommendation_image);
            nameTextView = itemView.findViewById(R.id.recommendation_name);
            addressTextView = itemView.findViewById(R.id.recommendation_address);
            ratingBar = itemView.findViewById(R.id.recommendation_rating);
            goButton = itemView.findViewById(R.id.recommendation_btn_go);
        }
    }
}*/