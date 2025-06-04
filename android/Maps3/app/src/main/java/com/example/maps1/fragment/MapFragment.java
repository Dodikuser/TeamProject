package com.example.maps1.fragment;


import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.example.maps1.MainActivity;
import com.example.maps1.PlaceDetailsActivity;
import com.example.maps1.R;
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
import com.google.android.libraries.places.api.model.PhotoMetadata;
import com.google.android.libraries.places.api.model.Place;
import com.google.android.libraries.places.api.net.FetchPlaceRequest;
import com.google.android.libraries.places.api.net.PlacesClient;
import com.example.maps1.utils.PlaceUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MapFragment extends Fragment implements OnMapReadyCallback {

    private GoogleMap mMap;
    private FusedLocationProviderClient fusedLocationClient;
    private PlacesClient placesClient;
    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
    private boolean isMapReady = false;

    public MapFragment() {
        super(R.layout.fragment_map);

    }

    @Override
    public void onViewCreated(@NonNull android.view.View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        if (!Places.isInitialized()) {
            Places.initialize(requireContext(), "AIzaSyAnE3sfsbwYmNEhxAq_XFelrA6_BznVymc");
        }
        placesClient = Places.createClient(requireContext());

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(requireContext());

        SupportMapFragment mapFragment;
        mapFragment = (SupportMapFragment)
                getChildFragmentManager().findFragmentById(R.id.map_fragment);
        if (mapFragment != null) {
            mapFragment.getMapAsync(this);
        }
    }

    @Override
    public void onMapReady(@NonNull GoogleMap googleMap) {
        mMap = googleMap;
        isMapReady = true;
        enableMyLocation();

        mMap.setOnPoiClickListener(poi -> {
            PlaceUtils.fetchPlaceDetails(requireContext(), poi.placeId, this::openPlaceDetails);
        });

        mMap.setOnMapClickListener(latLng ->
                Toast.makeText(requireContext(), "Натисніть на POI", Toast.LENGTH_SHORT).show());
    }

    private void enableMyLocation() {
        if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED) {
            mMap.setMyLocationEnabled(true);
            showUserLocation();
        } else {
            requestPermissions(
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    LOCATION_PERMISSION_REQUEST_CODE
            );
        }
    }
    @Override
    public void onResume() {
        super.onResume();
        if (getActivity() instanceof MainActivity) {
            ((MainActivity) getActivity()).showSearchField(true);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        if (getActivity() instanceof MainActivity) {
            ((MainActivity) getActivity()).showSearchField(false);
        }
    }
    @SuppressLint("MissingPermission")
    private void showUserLocation() {
        fusedLocationClient.getLastLocation().addOnSuccessListener(location -> {
            if (location != null) {
                LatLng userLocation = new LatLng(location.getLatitude(), location.getLongitude());
                mMap.addMarker(new MarkerOptions().position(userLocation).title("Ваше місцезнаходження"));
                mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(userLocation, 15));
            }
        });
    }

    private void openPlaceDetails(MyPlace place) {
        // Добавляем в историю посещений
        android.content.SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", android.content.Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);
        if (token != null) {
            PlaceUtils.addPlaceToHistory(requireContext(), token, place.getId());
        }
        Intent intent = new Intent(requireContext(), PlaceDetailsActivity.class);
        intent.putExtra("place", place);
        startActivity(intent);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE &&
                grantResults.length > 0 &&
                grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            enableMyLocation();
        } else {
            Toast.makeText(requireContext(), "Доступ до геопозиції заборонено", Toast.LENGTH_SHORT).show();
        }
    }

    // Показать маркеры для списка мест
    public void showPlacesOnMap(List<MyPlace> places) {
        if (mMap == null || places == null) return;
        mMap.clear();
        for (MyPlace place : places) {
            if (place.getLocation() != null) {
                mMap.addMarker(new MarkerOptions()
                        .position(place.getLocation())
                        .title(place.getName())
                        .snippet(place.getAddress()));
            }
        }
        // Центрируем карту на первом месте, если есть
        if (!places.isEmpty() && places.get(0).getLocation() != null) {
            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(places.get(0).getLocation(), 14));
        }
    }
}
