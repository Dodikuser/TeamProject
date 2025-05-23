package com.example.maps1;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.example.maps1.fragment.AccountFragment;
import com.example.maps1.Favorites.FavoritesFragment;
import com.example.maps1.history.HistoryFragment;
import com.example.maps1.fragment.MapFragment;
import com.example.maps1.recommendations.RecommendationsFragment;
import com.example.maps1.places.MyPlace;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.libraries.places.api.Places;
import com.google.android.libraries.places.api.model.AutocompletePrediction;
import com.google.android.libraries.places.api.model.Place;
import com.google.android.libraries.places.api.model.RectangularBounds;
import com.google.android.libraries.places.api.net.FetchPlaceRequest;
import com.google.android.libraries.places.api.net.FindAutocompletePredictionsRequest;
import com.google.android.libraries.places.api.net.FindAutocompletePredictionsResponse;
import com.google.android.libraries.places.api.net.PlacesClient;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.textfield.TextInputEditText;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MainActivity extends AppCompatActivity implements OnMapReadyCallback {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
    private GoogleMap googleMap;
    private PlacesClient placesClient;
    private TextInputEditText searchEditText;
    private FusedLocationProviderClient fusedLocationClient;
    private boolean isMapActive = true;
    private MaterialCardView searchCardView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        searchCardView = findViewById(R.id.searchCardView);

        // Ініціалізація Places API
        if (!Places.isInitialized()) {
            Places.initialize(getApplicationContext(), "AIzaSyAnE3sfsbwYmNEhxAq_XFelrA6_BznVymc");
        }
        placesClient = Places.createClient(this);

        // Ініціалізація клієнта локації
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        // Налаштування пошукового поля
        searchEditText = findViewById(R.id.searchEditText);
        searchEditText.setOnEditorActionListener((v, actionId, event) -> {
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                performSearch();
                return true;
            }
            return false;
        });

        // Ініціалізація мапи
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        if (mapFragment != null) {
            mapFragment.getMapAsync(this);
        }

        // Налаштування нижньої навігації
        BottomNavigationView bottomNav = findViewById(R.id.bottomNavigation);
        bottomNav.setOnItemSelectedListener(this::handleNavigationItemSelected);
        bottomNav.setSelectedItemId(R.id.nav_home);
    }
    public void showSearchField(boolean show) {
        runOnUiThread(() -> {
            if (searchCardView != null) {
                searchCardView.setVisibility(show ? View.VISIBLE : View.GONE);
            }
        });
    }
    @Override
    public void onMapReady(@NonNull GoogleMap googleMap) {
        this.googleMap = googleMap;
        googleMap.getUiSettings().setZoomControlsEnabled(true);
    }

    private void performSearch() {
        String query = searchEditText.getText().toString().trim();
        if (!query.isEmpty()) {
            searchWithCurrentLocation(query);
        }
    }

    @SuppressLint("MissingPermission")
    private void searchWithCurrentLocation(String query) {
        if (checkLocationPermission()) {
            fusedLocationClient.getLastLocation()
                    .addOnSuccessListener(location -> {
                        if (location != null) {
                            LatLng currentLatLng = new LatLng(location.getLatitude(), location.getLongitude());
                            performTextSearch(query, currentLatLng);
                        } else {
                            showToast("Не вдалося отримати поточну локацію");
                        }
                    });
        }
    }

    private void performTextSearch(String query, LatLng location) {
        List<Place.Field> fields = Arrays.asList(
                Place.Field.NAME,
                Place.Field.ADDRESS,
                Place.Field.LAT_LNG,
                Place.Field.RATING
        );

        FindAutocompletePredictionsRequest request = FindAutocompletePredictionsRequest.builder()
                .setQuery(query)
                .setLocationRestriction(
                        RectangularBounds.newInstance(
                                new LatLng(location.latitude - 0.05, location.longitude - 0.05),
                                new LatLng(location.latitude + 0.05, location.longitude + 0.05)
                        )
                )
                .build();

        placesClient.findAutocompletePredictions(request)
                .addOnSuccessListener(response -> {
                    if (response.getAutocompletePredictions().isEmpty()) {
                        showToast("Нічого не знайдено для '" + query + "'");
                        return;
                    }
                    processSearchResults(response, location);
                })
                .addOnFailureListener(e -> {
                    Log.e("PlacesAPI", "Помилка пошуку: " + e.getMessage());
                    showToast("Помилка пошуку. Спробуйте ще раз");
                });
    }

    private void processSearchResults(FindAutocompletePredictionsResponse response, LatLng userLocation) {
        List<AutocompletePrediction> predictions = response.getAutocompletePredictions();

        // Сортуємо за відстанню (якщо доступно)
        predictions.sort((a, b) -> {
            double distA = a.getDistanceMeters() != null ? a.getDistanceMeters() : Double.MAX_VALUE;
            double distB = b.getDistanceMeters() != null ? b.getDistanceMeters() : Double.MAX_VALUE;
            return Double.compare(distA, distB);
        });

        // Обмежуємо кількість результатів
        int maxResults = Math.min(predictions.size(), 3);
        for (int i = 0; i < maxResults; i++) {
            fetchAndDisplayPlace(predictions.get(i), i == 0);
        }
    }

    private void fetchAndDisplayPlace(AutocompletePrediction prediction, boolean openDetails) {
        List<Place.Field> fields = Arrays.asList(
                Place.Field.NAME,
                Place.Field.ADDRESS,
                Place.Field.LAT_LNG,
                Place.Field.RATING
        );

        FetchPlaceRequest request = FetchPlaceRequest.builder(prediction.getPlaceId(), fields)
                .build();

        placesClient.fetchPlace(request)
                .addOnSuccessListener(response -> {
                    Place place = response.getPlace();
                    addPlaceMarker(place);
                    if (openDetails) {
                        openPlaceDetails(convertToMyPlace(place));
                    }
                })
                .addOnFailureListener(e ->
                        Log.e("PlacesAPI", "Помилка завантаження місця: " + e.getMessage()));
    }

    private void addPlaceMarker(Place place) {
        if (googleMap != null && place.getLatLng() != null) {
            runOnUiThread(() -> {
                googleMap.addMarker(new MarkerOptions()
                        .position(place.getLatLng())
                        .title(place.getName())
                        .snippet(place.getAddress()));

                googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(place.getLatLng(), 14));
            });
        }
    }

    private MyPlace convertToMyPlace(Place place) {
        return new MyPlace(
                place.getId(),
                place.getName(),
                place.getAddress(),
                "Опис відсутній",
                place.getRating(),
                null, // phone
                null, // hours
                null, // website
                new ArrayList<>(), // photos
                place.getLatLng()
        );
    }

    private boolean checkLocationPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED) {
            return true;
        } else {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    LOCATION_PERMISSION_REQUEST_CODE);
            return false;
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                performSearch();
            } else {
                showToast("Дозвіл на локацію не надано");
            }
        }
    }

    private void showToast(String message) {
        runOnUiThread(() -> Toast.makeText(this, message, Toast.LENGTH_SHORT).show());
    }

    private boolean handleNavigationItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.nav_home) {
            isMapActive = true;
            showFragment(new MapFragment());
            return true;
        }

        isMapActive = false;

        if (id == R.id.nav_favorites) {
            showFragment(new FavoritesFragment());
        } else if (id == R.id.nav_recommendations) {
            showFragment(new RecommendationsFragment());
        } else if (id == R.id.nav_history) {
            showFragment(new HistoryFragment());
        } else if (id == R.id.nav_account) {
            showFragment(new AccountFragment());
        }

        return true;
    }

    private void showFragment(Fragment fragment) {
        getSupportFragmentManager().beginTransaction()
                .replace(R.id.fragment_container, fragment)
                .commit();
    }

    private void openPlaceDetails(MyPlace place) {
        Intent intent = new Intent(this, PlaceDetailsActivity.class);
        intent.putExtra("place", place);
        startActivity(intent);
    }
}