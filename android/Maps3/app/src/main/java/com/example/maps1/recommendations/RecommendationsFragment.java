package com.example.maps1.recommendations;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;

import com.example.maps1.PlaceDetailsActivity;
import com.example.maps1.R;
import com.example.maps1.places.MyPlace;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.libraries.places.api.Places;
import com.google.android.libraries.places.api.model.AutocompletePrediction;
import com.google.android.libraries.places.api.model.Place;
import com.google.android.libraries.places.api.model.RectangularBounds;
import com.google.android.libraries.places.api.net.FetchPlaceRequest;
import com.google.android.libraries.places.api.net.FindAutocompletePredictionsRequest;
import com.google.android.libraries.places.api.net.PlacesClient;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class RecommendationsFragment extends Fragment {
    private RecyclerView recyclerView;
    private ProgressBar progressBar;
    private PlacesClient placesClient;
    private FusedLocationProviderClient fusedLocationClient;
    private List<Place> recommendedPlaces = new ArrayList<>();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_recommendations, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        recyclerView = view.findViewById(R.id.recommendationsRecyclerView);
        progressBar = view.findViewById(R.id.progressBar);

        // Ініціалізація Places API
        if (!Places.isInitialized()) {
            Places.initialize(requireContext(), "AIzaSyAnE3sfsbwYmNEhxAq_XFelrA6_BznVymc");
        }
        placesClient = Places.createClient(requireContext());
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(requireContext());

        loadRecommendedPlaces();
    }

    private void loadRecommendedPlaces() {
        progressBar.setVisibility(View.VISIBLE);

        if (ActivityCompat.checkSelfPermission(requireContext(),
                Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
            return;
        }

        fusedLocationClient.getLastLocation().addOnSuccessListener(location -> {
            if (location != null) {
                fetchNearbyPlaces(new LatLng(location.getLatitude(), location.getLongitude()));
            } else {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(requireContext(), "Не вдалося отримати локацію", Toast.LENGTH_SHORT).show();
            }
        });
    }

    // RecommendationsFragment.java
    private void fetchNearbyPlaces(LatLng userLocation) {
        // Радіус 5 км у градусах (приблизно 0.045)
        double radius = 0.045;

        // Типи місць для рекомендацій
        List<Place.Type> placeTypes = Arrays.asList(
                Place.Type.RESTAURANT,
                Place.Type.CAFE,
                Place.Type.BAR
        );

        // Поля, які потрібно отримати
        List<Place.Field> fields = Arrays.asList(
                Place.Field.NAME,
                Place.Field.ADDRESS,
                Place.Field.LAT_LNG,
                Place.Field.RATING,
                Place.Field.PHOTO_METADATAS
        );

        // Межі пошуку
        RectangularBounds bounds = RectangularBounds.newInstance(
                new LatLng(userLocation.latitude - radius, userLocation.longitude - radius),
                new LatLng(userLocation.latitude + radius, userLocation.longitude + radius)
        );

        // Запит для пошуку місць
        List<String> placeTypeStrings = placeTypes.stream()
                .map(Enum::name)
                .collect(Collectors.toList());

        FindAutocompletePredictionsRequest request = FindAutocompletePredictionsRequest.builder()
                .setLocationRestriction(bounds)
                .setTypesFilter(placeTypeStrings)
                .build();

        placesClient.findAutocompletePredictions(request).addOnSuccessListener(response -> {
            List<AutocompletePrediction> predictions = response.getAutocompletePredictions();
            processPredictions(predictions, fields);
        }).addOnFailureListener(e -> {
            progressBar.setVisibility(View.GONE);
            Toast.makeText(requireContext(), "Помилка завантаження рекомендацій", Toast.LENGTH_SHORT).show();
        });
    }

    private void processPredictions(List<AutocompletePrediction> predictions, List<Place.Field> fields) {
        recommendedPlaces.clear();

        // Обмежуємо кількість результатів для оптимізації
        int maxResults = Math.min(predictions.size(), 20);

        for (int i = 0; i < maxResults; i++) {
            String placeId = predictions.get(i).getPlaceId();

            FetchPlaceRequest request = FetchPlaceRequest.builder(placeId, fields).build();

            placesClient.fetchPlace(request).addOnSuccessListener(response -> {
                Place place = response.getPlace();

                // Додаємо тільки місця з рейтингом >= 3
                if (place.getRating() != null && place.getRating() >= 3) {
                    recommendedPlaces.add(place);

                    // Коли всі запити завершено - сортуємо та відображаємо
                    if (recommendedPlaces.size() == maxResults) {
                        sortAndDisplayPlaces();
                    }
                }
            });
        }
    }

    private void sortAndDisplayPlaces() {
        // Сортуємо за рейтингом (від найвищого до найнижчого)
        recommendedPlaces.sort((p1, p2) -> {
            float rating1 = p1.getRating() != null ? p1.getRating().floatValue() : 0f;
            float rating2 = p2.getRating() != null ? p2.getRating().floatValue() : 0f;
            return Float.compare(rating2, rating1);
        });

        // Обмежуємо до 10 найкращих результатів
        if (recommendedPlaces.size() > 10) {
            recommendedPlaces = recommendedPlaces.subList(0, 10);
        }

        // Налаштовуємо RecyclerView
        RecommendationsAdapter adapter = new RecommendationsAdapter(recommendedPlaces, place -> {
            // Обробка кліку - відкриття деталей місця
            openPlaceDetails(place);
        });

        recyclerView.setAdapter(adapter);
        progressBar.setVisibility(View.GONE);
    }
    private void openPlaceDetails(Place place) {
        // Конвертуємо Place в MyPlace
        MyPlace myPlace = new MyPlace(
                place.getId(),
                place.getName(),
                place.getAddress(),
                "Рекомендоване місце",
                place.getRating() != null ? place.getRating() : 0,
                null, // phone
                null, // hours
                null, // website
                new ArrayList<>(), // photos
                place.getLatLng()
        );

        // Створюємо Intent для відкриття PlaceDetailsActivity
        Intent intent = new Intent(getActivity(), PlaceDetailsActivity.class);
        intent.putExtra("place", myPlace);
        startActivity(intent);
    }
    private void processPredictions2(List<AutocompletePrediction> predictions, List<Place.Field> fields) {
        recommendedPlaces.clear();

        // Обмежуємо кількість результатів для оптимізації
        int maxResults = Math.min(predictions.size(), 20);

        for (int i = 0; i < maxResults; i++) {
            String placeId = predictions.get(i).getPlaceId();

            FetchPlaceRequest request = FetchPlaceRequest.builder(placeId, fields).build();

            placesClient.fetchPlace(request).addOnSuccessListener(response -> {
                Place place = response.getPlace();

                // Додаємо тільки місця з рейтингом >= 3
                if (place.getRating() != null && place.getRating() >= 3) {
                    recommendedPlaces.add(place);

                    // Коли всі запити завершено - сортуємо та відображаємо
                    if (recommendedPlaces.size() == maxResults) {
                        sortAndDisplayPlaces();
                    }
                }
            });
        }
    }
/*
    private void sortAndDisplayPlaces() {
        // Сортуємо за рейтингом (від найвищого до найнижчого)
        recommendedPlaces.sort((p1, p2) -> {
            float rating1 = p1.getRating() != null ? p1.getRating().floatValue() : 0f;
            float rating2 = p2.getRating() != null ? p2.getRating().floatValue() : 0f;
            return Float.compare(rating2, rating1);
        });


        // Обмежуємо до 10 найкращих результатів
        if (recommendedPlaces.size() > 10) {
            recommendedPlaces = recommendedPlaces.subList(0, 10);
        }

        // Налаштовуємо RecyclerView
        RecommendationsAdapter adapter = new RecommendationsAdapter(recommendedPlaces, place -> {
            // Обробка кліку - відкриття деталей місця
            openPlaceDetails(place);
        });

        recyclerView.setAdapter(adapter);
        progressBar.setVisibility(View.GONE);
    }

    private void openPlaceDetails(Place place) {
        MyPlace myPlace = convertToMyPlace(place);
        Intent intent = new Intent(requireActivity(), PlaceDetailsActivity.class);
        intent.putExtra("place", myPlace);
        startActivity(intent);
    }
*/
    private MyPlace convertToMyPlace(Place place) {
        return new MyPlace(
                place.getId(),
                place.getName(),
                place.getAddress(),
                "Рекомендоване місце",
                place.getRating() != null ? place.getRating() : 0,
                null, // phone
                null, // hours
                null, // website
                new ArrayList<>(), // photos
                place.getLatLng()
        );
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        if (requestCode == 1) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                loadRecommendedPlaces();
            } else {
                Toast.makeText(requireContext(), "Дозвіл на локацію не надано", Toast.LENGTH_SHORT).show();
                progressBar.setVisibility(View.GONE);
            }
        }
    }
}