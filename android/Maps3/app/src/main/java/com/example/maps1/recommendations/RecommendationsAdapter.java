package com.example.maps1.recommendations;

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
}