package com.example.maps1;

import android.os.Bundle;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.example.maps1.fragment.AccountFragment;
import com.example.maps1.fragment.FavoritesFragment;
import com.example.maps1.fragment.HistoryFragment;
import com.example.maps1.fragment.MapFragment;
import com.example.maps1.fragment.RecommendationsFragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainActivity extends AppCompatActivity {

    private boolean isMapActive = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        BottomNavigationView bottomNav = findViewById(R.id.bottomNavigation);
        bottomNav.setOnItemSelectedListener(this::handleNavigationItemSelected);
        bottomNav.setSelectedItemId(R.id.nav_home);
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
}
