package com.example.maps1.recommendations;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.SearchView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.maps1.PlaceDetailsActivity;
import com.example.maps1.R;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class RecommendationsFragment extends Fragment {
    private static final String TAG = "RecommendationsFragment";

    // Categories
    private static final List<String> CATEGORIES = Arrays.asList(
            "Цікаві місця", "Туризм", "Їжа", "Природа", "Шопінг", "Історія", "Спорт",
            "Для дітей", "Тихі місця", "Романтика", "Екзотика", "Екстрим", "Розваги",
            "Банк", "Місця поруч", "Архітектура"
    );

    // UI Components
    private RecyclerView recommendationsRecyclerView;
    private RecyclerView categoriesRecyclerView;
    private RecommendationsAdapter recommendationsAdapter;
    private CategoryAdapter categoryAdapter;
    private ProgressBar progressBar;
    private SearchView searchView;

    // Data
    private List<RecommendationsItem> allRecommendations = new ArrayList<>();
    private List<RecommendationsItem> filteredRecommendations = new ArrayList<>();
    private String selectedCategory = CATEGORIES.get(0);
    private String currentSearchQuery = "";

    // Threading
    private ExecutorService executorService = Executors.newSingleThreadExecutor();
    private Handler mainHandler = new Handler(Looper.getMainLooper());

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_recommendations, container, false);

        initViews(view);
        setupRecyclerViews();
        setupSearchView();

        // Load initial recommendations
        loadRecommendations();

        return view;
    }

    private void initViews(View view) {
        recommendationsRecyclerView = view.findViewById(R.id.recommendationsRecyclerView);
        categoriesRecyclerView = view.findViewById(R.id.categoriesRecyclerView);
        progressBar = view.findViewById(R.id.progressBar);
        searchView = view.findViewById(R.id.search_view);
    }

    private void setupRecyclerViews() {
        categoriesRecyclerView.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        categoryAdapter = new CategoryAdapter(CATEGORIES, this::onCategorySelected);
        categoriesRecyclerView.setAdapter(categoryAdapter);

        recommendationsRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recommendationsRecyclerView.setHasFixedSize(true);
        recommendationsAdapter = new RecommendationsAdapter(filteredRecommendations, new RecommendationsAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(RecommendationsItem item) {
                onRecommendationItemClick(item);
            }

            @Override
            public void onLikeClick(RecommendationsItem item) {
                handleLikeClick(item);
            }
        });
        recommendationsRecyclerView.setAdapter(recommendationsAdapter);
    }

    private void setupSearchView() {
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                currentSearchQuery = newText;
                filterRecommendations();
                return true;
            }
        });
    }

    private void onCategorySelected(String category) {
        selectedCategory = category;
        loadRecommendations();
    }

    private void onRecommendationItemClick(RecommendationsItem item) {
        Intent intent = new Intent(getActivity(), PlaceDetailsActivity.class);
        intent.putExtra("place_name", item.getName());
        intent.putExtra("place_address", item.getAddress());
        intent.putExtra("place_rating", item.getRating());
        intent.putExtra("place_image_url", item.getImageUrl());
        startActivity(intent);
    }

    private void handleLikeClick(RecommendationsItem item) {
        executorService.execute(() -> {
            try {
                SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
                String token = prefs.getString("auth_token", null);

                boolean newLikeState = !item.isLiked();
                RecommendationService.toggleLike(item.getPlaceId(), newLikeState, token);
                
                mainHandler.post(() -> {
                    item.setLiked(newLikeState);
                    recommendationsAdapter.notifyDataSetChanged();
                    String message = newLikeState ? "Додано до обраного" : "Видалено з обраного";
                    Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                });
            } catch (Exception e) {
                mainHandler.post(() -> {
                    Toast.makeText(getContext(), "Помилка: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                });
            }
        });
    }

    private void loadRecommendations() {
        showLoading(true);

        executorService.execute(() -> {
            try {
                // Call AccountFragment.trustAllCertificates() if needed
                // AccountFragment.trustAllCertificates();

                RecommendationService.RecommendationRequest request =
                        new RecommendationService.RecommendationRequest(
                                8,           // hashTagId
                                1,           // radius
                                47.81052,    // latitude
                                35.18286,    // longitude
                                selectedCategory
                        );

                List<RecommendationsItem> recommendations = RecommendationService.getRecommendations(request);

                mainHandler.post(() -> {
                    allRecommendations.clear();
                    allRecommendations.addAll(recommendations);
                    filterRecommendations();
                    showLoading(false);
                });

            } catch (Exception e) {
                Log.e(TAG, "Error loading recommendations", e);
                mainHandler.post(() -> {
                    showLoading(false);
                    showError("Помилка завантаження рекомендацій: " + e.getMessage());
                });
            }
        });
    }

    private void filterRecommendations() {
        filteredRecommendations.clear();

        if (currentSearchQuery.isEmpty()) {
            filteredRecommendations.addAll(allRecommendations);
        } else {
            String lowerCaseQuery = currentSearchQuery.toLowerCase();
            for (RecommendationsItem item : allRecommendations) {
                if (item.getName().toLowerCase().contains(lowerCaseQuery) ||
                        item.getAddress().toLowerCase().contains(lowerCaseQuery) ||
                        item.getDescription().toLowerCase().contains(lowerCaseQuery)) {
                    filteredRecommendations.add(item);
                }
            }
        }

        if (recommendationsAdapter != null) {
            recommendationsAdapter.notifyDataSetChanged();
        }
    }

    private void showLoading(boolean show) {
        if (progressBar != null) {
            progressBar.setVisibility(show ? View.VISIBLE : View.GONE);
        }
        if (recommendationsRecyclerView != null) {
            recommendationsRecyclerView.setVisibility(show ? View.GONE : View.VISIBLE);
        }
    }

    private void showError(String message) {
        if (getContext() != null) {
            Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (executorService != null) {
            executorService.shutdown();
        }
    }
}