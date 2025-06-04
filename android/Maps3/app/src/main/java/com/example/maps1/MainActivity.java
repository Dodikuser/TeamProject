package com.example.maps1;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Rect;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.inputmethod.EditorInfo;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.example.maps1.account.AccountFragment;
import com.example.maps1.account.MainAccount;
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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import com.bumptech.glide.Glide;

public class MainActivity extends AppCompatActivity implements OnMapReadyCallback {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
    private GoogleMap googleMap;
    private PlacesClient placesClient;
    private TextInputEditText searchEditText;
    private FusedLocationProviderClient fusedLocationClient;
    private boolean isMapActive = true;
    private MaterialCardView searchCardView;
    private SharedPreferences prefs;
    private BottomNavigationView bottomNav;
    private HorizontalScrollView searchResultsContainer;
    private LinearLayout searchResultsLayout;
    private ViewTreeObserver.OnGlobalLayoutListener keyboardLayoutListener;
    private boolean isKeyboardVisible = false;
    private final ExecutorService aiSearchExecutor = Executors.newSingleThreadExecutor();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        prefs = getSharedPreferences("app_prefs", MODE_PRIVATE);
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
        searchEditText.setOnFocusChangeListener((v, hasFocus) -> {
            if (!hasFocus) {
                String query = searchEditText.getText().toString().trim();
                if (query.isEmpty()) {
                    showSearchResults(false);
                }
            }
        });
        // Ініціалізація мапи
        // SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
        //         .findFragmentById(R.id.map);
        // if (mapFragment != null) {
        //     mapFragment.getMapAsync(this);
        // }

        // Налаштування нижньої навігації
        bottomNav = findViewById(R.id.bottomNavigation);
        bottomNav.setOnItemSelectedListener(this::handleNavigationItemSelected);
        bottomNav.setSelectedItemId(R.id.nav_home);

        // Перевірка, чи потрібно відкрити фрагмент акаунта при запуску
        if (getIntent().hasExtra("show_account_fragment")) {
            loadAccountFragment();
        }
        searchResultsContainer = findViewById(R.id.searchResultsContainer);
        searchResultsLayout = findViewById(R.id.searchResultsLayout);
        setupKeyboardListeners();

        AccountFragment.trustAllCertificates();
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

        // Ховаємо результати пошуку при кліку на мапу
        googleMap.setOnMapClickListener(latLng -> {
            showSearchResults(false);
            searchEditText.clearFocus();
        });
    }

    private void performSearch() {
        String query = searchEditText.getText().toString().trim();
        if (!query.isEmpty()) {
            // Добавляем запрос в историю
            String token = prefs.getString("auth_token", null);
            if (token != null) {
                com.example.maps1.history.HistoryApiHelper.addSearchHistoryItem(token, query, new com.example.maps1.history.HistoryApiHelper.ApiCallback() {
                    @Override
                    public void onSuccess(String response) {
                        // Можно добавить логирование или обработку успеха
                    }
                    @Override
                    public void onError(String error) {
                        // Можно добавить логирование ошибки
                    }
                });
            }
            // Новый серверный поиск
            aiPlaceSearchRequest(query);
        } else {
            showSearchResults(false);
        }
    }
    private static SSLSocketFactory getTrustAllSslSocketFactory() throws Exception {
        TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {
                    public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                        return new java.security.cert.X509Certificate[0];
                    }

                    public void checkClientTrusted(
                            java.security.cert.X509Certificate[] certs, String authType) {}

                    public void checkServerTrusted(
                            java.security.cert.X509Certificate[] certs, String authType) {}
                }
        };

        SSLContext sc = SSLContext.getInstance("SSL");
        sc.init(null, trustAllCerts, new java.security.SecureRandom());
        return sc.getSocketFactory();
    }

    private void aiPlaceSearchRequest(String query) {
        // Локация и радиус — поебать, пока оставим
        int radius = 1000;
        double latitude = 47.81052;
        double longitude = 35.18286;

        String urlStr = String.format(
                "https://10.0.2.2:7103/api/AI/search?text=%s&radius=%d&latitude=%f&longitude=%f",
                urlEncode(query), radius, latitude, longitude);

        showSearchResults(true);
        searchResultsLayout.removeAllViews();

        aiSearchExecutor.execute(() -> {
            try {
                // Получаем наш кастомный socket factory
                SSLSocketFactory sslSocketFactory = getTrustAllSslSocketFactory();

                // Отключаем проверку hostname
                HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

                URL url = new URL(urlStr);
                HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
                conn.setSSLSocketFactory(sslSocketFactory); // ВОТ ТУТ НУЖНО СТАВИТЬ ТО, ЧТО МЫ СОЗДАЛИ
                conn.setRequestMethod("GET");
                conn.setDoInput(true);

                int responseCode = conn.getResponseCode();
                if (responseCode == 200) {
                    InputStream is = conn.getInputStream();
                    BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        sb.append(line);
                    }
                    reader.close();
                    is.close();
                    parseAndShowAiResults(sb.toString());
                } else {
                    runOnUiThread(() -> searchWithCurrentLocation(query));
                }
                conn.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> searchWithCurrentLocation(query));
            }
        });
    }



    private void parseAndShowAiResults(String json) {
        runOnUiThread(() -> {
            try {
                JSONObject root = new JSONObject(json);
                JSONArray values = root.optJSONArray("$values");
                if (values == null) {
                    showToast("Нічого не знайдено");
                    showSearchResults(false);
                    return;
                }
                if (values.length() == 0) {
                    showToast("Нічого не знайдено");
                    showSearchResults(false);
                    return;
                }
                searchResultsLayout.removeAllViews();
                // Удаляем старые маркеры (если нужно, можно добавить отдельный метод для этого)
                if (googleMap != null) {
                    googleMap.clear();
                }
                // Собираем список мест для карты
                java.util.List<com.example.maps1.places.MyPlace> placesForMap = new java.util.ArrayList<>();
                for (int i = 0; i < values.length(); i++) {
                    JSONObject place = values.getJSONObject(i);
                    String name = place.optString("name", "");
                    double lat = place.optDouble("latitude", 0);
                    double lng = place.optDouble("longitude", 0);
                    String address = place.optString("address", "");
                    double stars = place.optDouble("stars", 0);
                    String photoUrl = null;
                    if (place.has("photo") && !place.isNull("photo")) {
                        JSONObject photo = place.getJSONObject("photo");
                        photoUrl = photo.optString("path", null);
                    }
                    addAiSearchResultCard(name, address, lat, lng, stars, photoUrl);
                    if (lat != 0 && lng != 0) {
                        placesForMap.add(new com.example.maps1.places.MyPlace(
                            null, name, address, "Опис відсутній", stars, null, null, null,
                            photoUrl != null ? java.util.Collections.singletonList(photoUrl) : new java.util.ArrayList<>(),
                            new com.google.android.gms.maps.model.LatLng(lat, lng)
                        ));
                    }
                }
                // Передаем места во фрагмент карты
                androidx.fragment.app.Fragment currentFragment = getSupportFragmentManager().findFragmentById(R.id.fragment_container);
                if (currentFragment instanceof com.example.maps1.fragment.MapFragment) {
                    ((com.example.maps1.fragment.MapFragment) currentFragment).showPlacesOnMap(placesForMap);
                }
            } catch (JSONException e) {
                e.printStackTrace();
                showToast("Помилка обробки результату");
                showSearchResults(false);
            }
        });
    }

    private void addAiSearchResultCard(String name, String address, double lat, double lng, double stars, String photoUrl) {
        MaterialCardView card = new MaterialCardView(this);
        card.setLayoutParams(new LinearLayout.LayoutParams(
                getResources().getDimensionPixelSize(R.dimen.search_card_width),
                getResources().getDimensionPixelSize(R.dimen.search_card_height)));
        card.setCardBackgroundColor(ContextCompat.getColor(this, R.color.card_background));
        card.setStrokeColor(ContextCompat.getColor(this, R.color.card_stroke));
        card.setStrokeWidth(getResources().getDimensionPixelSize(R.dimen.card_stroke_width));
        card.setRadius(getResources().getDimension(R.dimen.card_corner_radius));
        card.setCardElevation(getResources().getDimension(R.dimen.card_elevation));

        LinearLayout cardContent = new LinearLayout(this);
        cardContent.setOrientation(LinearLayout.VERTICAL);
        cardContent.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));
        cardContent.setGravity(Gravity.CENTER);
        cardContent.setPadding(
                getResources().getDimensionPixelSize(R.dimen.card_padding),
                getResources().getDimensionPixelSize(R.dimen.card_padding),
                getResources().getDimensionPixelSize(R.dimen.card_padding),
                getResources().getDimensionPixelSize(R.dimen.card_padding));

        // Миниатюра
        ImageView thumbnail = new ImageView(this);
        int thumbSize = getResources().getDimensionPixelSize(R.dimen.search_card_thumb_size);
        LinearLayout.LayoutParams thumbParams = new LinearLayout.LayoutParams(thumbSize, thumbSize);
        thumbParams.gravity = Gravity.CENTER;
        thumbnail.setLayoutParams(thumbParams);
        thumbnail.setScaleType(ImageView.ScaleType.CENTER_CROP);
        int thumbMargin = getResources().getDimensionPixelSize(R.dimen.card_padding) / 2;
        thumbParams.setMargins(0, 0, 0, thumbMargin);
        // Загрузка изображения
        if (photoUrl != null && !photoUrl.isEmpty()) {
            Glide.with(this)
                .load(photoUrl)
                .placeholder(R.drawable.ic_placeholder)
                .into(thumbnail);
        } else {
            thumbnail.setImageResource(R.drawable.ic_placeholder);
        }
        cardContent.addView(thumbnail, 0); // Добавляем миниатюру первой

        TextView nameTextView = new TextView(this);
        nameTextView.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT));
        nameTextView.setText(name);
        nameTextView.setTextColor(ContextCompat.getColor(this, R.color.card_text));
        nameTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        nameTextView.setGravity(Gravity.CENTER);
        nameTextView.setMaxLines(2);
        nameTextView.setEllipsize(TextUtils.TruncateAt.END);
        nameTextView.setPadding(0, 0, 0, 8);

        TextView addressTextView = new TextView(this);
        addressTextView.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT));
        addressTextView.setText(address);
        addressTextView.setTextColor(ContextCompat.getColor(this, R.color.card_text));
        addressTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        addressTextView.setGravity(Gravity.CENTER);
        addressTextView.setMaxLines(2);
        addressTextView.setEllipsize(TextUtils.TruncateAt.END);
        addressTextView.setPadding(0, 0, 0, 8);

        LinearLayout ratingLayout = new LinearLayout(this);
        ratingLayout.setOrientation(LinearLayout.HORIZONTAL);
        ratingLayout.setGravity(Gravity.CENTER);

        ImageView starIcon = new ImageView(this);
        starIcon.setImageResource(R.drawable.ic_star);
        starIcon.setColorFilter(ContextCompat.getColor(this, R.color.card_rating));
        starIcon.setLayoutParams(new LinearLayout.LayoutParams(
                getResources().getDimensionPixelSize(R.dimen.star_size),
                getResources().getDimensionPixelSize(R.dimen.star_size)));

        TextView ratingTextView = new TextView(this);
        ratingTextView.setText(String.format(Locale.getDefault(), "%.1f", stars));
        ratingTextView.setTextColor(ContextCompat.getColor(this, R.color.card_rating));
        ratingTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        ratingTextView.setPadding(4, 0, 0, 0);

        ratingLayout.addView(starIcon);
        ratingLayout.addView(ratingTextView);

        cardContent.addView(nameTextView);
        cardContent.addView(addressTextView);
        cardContent.addView(ratingLayout);
        card.addView(cardContent);

        card.setOnClickListener(v -> {
            // Открываем экран деталей места
            MyPlace place = new MyPlace(
                null, // id неизвестен
                name,
                address,
                "Опис відсутній",
                stars,
                null, // phone
                null, // hours
                null, // email
                photoUrl != null ? java.util.Collections.singletonList(photoUrl) : new java.util.ArrayList<>(),
                new com.google.android.gms.maps.model.LatLng(lat, lng)
            );
            openPlaceDetails(place);
            showSearchResults(false);
            searchEditText.clearFocus();
        });
        searchResultsLayout.addView(card);
    }

    private String urlEncode(String s) {
        try {
            return java.net.URLEncoder.encode(s, "UTF-8");
        } catch (Exception e) {
            return s;
        }
    }

    private void showSearchResults(boolean show) {
        runOnUiThread(() -> {
            if (show && searchResultsContainer.getVisibility() != View.VISIBLE) {
                searchResultsContainer.setVisibility(View.VISIBLE);
                Animation anim = AnimationUtils.loadAnimation(this, R.anim.slide_in_right);
                searchResultsContainer.startAnimation(anim);
                searchResultsContainer.fullScroll(HorizontalScrollView.FOCUS_LEFT);
            } else if (!show && searchResultsContainer.getVisibility() == View.VISIBLE) {
                Animation anim = AnimationUtils.loadAnimation(this, R.anim.slide_out_right);
                anim.setAnimationListener(new Animation.AnimationListener() {
                    @Override
                    public void onAnimationStart(Animation animation) {}

                    @Override
                    public void onAnimationEnd(Animation animation) {
                        searchResultsContainer.setVisibility(View.GONE);
                        searchResultsLayout.removeAllViews();
                    }

                    @Override
                    public void onAnimationRepeat(Animation animation) {}
                });
                searchResultsContainer.startAnimation(anim);
            }
        });
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
        try {
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
                        if (response.getAutocompletePredictions().isEmpty() && !query.toLowerCase().contains("кафе")) {
                            showToast("Нічого не знайдено для '" + query + "'");
                            return;
                        }
                        processSearchResults(response, location);
                    })
                    .addOnFailureListener(e -> {
                        Log.e("PlacesAPI", "Помилка пошуку: " + e.getMessage());
                        if (query.toLowerCase().contains("кафе")) {
                            showTestCafes(location);
                        } else {
                            showToast("Помилка пошуку. Спробуйте ще раз");
                        }
                    });
        } catch (Exception e) {
            Log.e("SearchError", "Помилка при пошуку", e);
            if (query.toLowerCase().contains("кафе")) {
                showTestCafes(location);
            } else {
                showToast("Сталася помилка. Спробуйте ще раз");
            }
        }
    }

    private void processSearchResults(FindAutocompletePredictionsResponse response, LatLng userLocation) {
        List<AutocompletePrediction> predictions = response.getAutocompletePredictions();
        searchResultsLayout.removeAllViews();

        String query = searchEditText.getText().toString().toLowerCase().trim();

        if (query.contains("кафе")) {
            showTestCafes(userLocation);
            return;
        }

        if (predictions.isEmpty()) {
            showToast("Нічого не знайдено для '" + query + "'");
            return;
        }

        predictions.sort((a, b) -> {
            double distA = a.getDistanceMeters() != null ? a.getDistanceMeters() : Double.MAX_VALUE;
            double distB = b.getDistanceMeters() != null ? b.getDistanceMeters() : Double.MAX_VALUE;
            return Double.compare(distA, distB);
        });

        int maxResults = Math.min(predictions.size(), 10);
        for (int i = 0; i < maxResults; i++) {
            AutocompletePrediction prediction = predictions.get(i);
            LatLng location = new LatLng(
                    userLocation.latitude + (Math.random() * 0.02 - 0.01),
                    userLocation.longitude + (Math.random() * 0.02 - 0.01)
            );
            // Використовуємо випадковий рейтинг для демонстрації
            double rating = 3.5 + (Math.random() * 1.5); // Рейтинг від 3.5 до 5.0
        }
    }
    private void showTestCafes(LatLng userLocation) {
        // Список тестових кафе з рейтингами
        Map<String, Double> testCafes = new LinkedHashMap<>();
        testCafes.put("Кафе 'Львівські пляцки'", 4.7);
        testCafes.put("Кафе 'Смачна хата'", 4.5);
        testCafes.put("Кав'ярня 'Аромант'", 4.9);
        testCafes.put("Ресторан 'Український двір'", 4.8);
        testCafes.put("Кофейня 'Шоколадниця'", 4.6);
        testCafes.put("Кафе 'Червона рута'", 4.4);
        testCafes.put("Піцерія 'Італія'", 4.3);
        testCafes.put("Суши-бар 'Сакура'", 4.7);
        testCafes.put("Бургерна 'Гриль'", 4.5);
        testCafes.put("Пекарня 'Свіжий хліб'", 4.8);

        for (Map.Entry<String, Double> entry : testCafes.entrySet()) {
            // Генеруємо випадкові координати поблизу поточної локації
            LatLng location = new LatLng(
                    userLocation.latitude + (Math.random() * 0.02 - 0.01),
                    userLocation.longitude + (Math.random() * 0.02 - 0.01)
            );
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
                null,
                null,
                null,
                new ArrayList<>(),
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
            loadAccountFragment();
        }

        return true;
    }

    private void loadAccountFragment() {
        Fragment fragment;
        String authToken = prefs.getString("auth_token", null);

        if (authToken != null) {
            // Користувач авторизований - показуємо профіль
            fragment = new MainAccount();
        } else {
            // Користувач не авторизований - показуємо екран входу
            fragment = new AccountFragment();
        }

        showFragment(fragment);
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
    //обробка клавіатури
    private void setupKeyboardListeners() {
        final View rootView = findViewById(android.R.id.content);

        keyboardLayoutListener = new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                Rect r = new Rect();
                rootView.getWindowVisibleDisplayFrame(r);

                int screenHeight = rootView.getRootView().getHeight();
                int keypadHeight = screenHeight - r.bottom;

                boolean isKeyboardNowVisible = keypadHeight > screenHeight * 0.15; // 15% від висоти екрана

                if (isKeyboardNowVisible != isKeyboardVisible) {
                    isKeyboardVisible = isKeyboardNowVisible;

                    if (isKeyboardVisible) {
                        // Клавіатура відкрита - показуємо результати, якщо є текст
                        String query = searchEditText.getText().toString().trim();
                        if (!query.isEmpty()) {
                            showSearchResults(true);
                        }
                    } else {
                        // Клавіатура закрита - ховаємо результати
                        showSearchResults(false);
                        searchEditText.clearFocus();
                    }
                }
            }
        };

        rootView.getViewTreeObserver().addOnGlobalLayoutListener(keyboardLayoutListener);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        View rootView = findViewById(android.R.id.content);
        rootView.getViewTreeObserver().removeOnGlobalLayoutListener(keyboardLayoutListener);
    }
}