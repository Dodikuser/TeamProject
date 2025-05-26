package com.example.maps1.account;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.maps1.R;
import com.example.maps1.MainActivity;
import com.example.maps1.PlaceDetailsActivity;

public class MainAccount extends Fragment {

    private SharedPreferences prefs;
    private TextView nameText, emailText, registrationDate;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.main_account, container, false);

        prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);

        // Ініціалізація елементів
        nameText = view.findViewById(R.id.nameText);
        emailText = view.findViewById(R.id.emailText);
        registrationDate = view.findViewById(R.id.registrationDate);
        ImageView profileIcon = view.findViewById(R.id.profileIcon);

        // Завантаження даних профілю
        loadProfileData();

        Button editButton = view.findViewById(R.id.editButton);
        editButton.setOnClickListener(v -> showEditProfileDialog());

        Button logoutButton = view.findViewById(R.id.logoutButton);
        logoutButton.setOnClickListener(v -> logout());

        // Обробник кнопки "Перейти" для відгуків
        view.findViewById(R.id.goButton1).setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), PlaceDetailsActivity.class);
            intent.putExtra("place_name", getString(R.string.place_name_example_1));
            startActivity(intent);
        });

        view.findViewById(R.id.goButton2).setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), PlaceDetailsActivity.class);
            intent.putExtra("place_name", getString(R.string.place_name_example_2));
            startActivity(intent);
        });

        return view;
    }

    private void loadProfileData() {
        String name = prefs.getString("user_name", "Ім'я Прізвище");
        String email = prefs.getString("user_email", "example@gmail.com");
        String regDate = prefs.getString("reg_date", "25.04.2025");

        nameText.setText(name);
        emailText.setText(email);
        registrationDate.setText(regDate);
    }

    private void showEditProfileDialog() {
        EditProfileDialogFragment dialog = new EditProfileDialogFragment();
        dialog.setTargetFragment(this, 1);
        dialog.show(getParentFragmentManager(), "EditProfileDialog");
    }

    private void logout() {
        // Очищаємо SharedPreferences
        prefs.edit().clear().apply();

        // Повертаємось до MainActivity
        Intent intent = new Intent(requireActivity(), MainActivity.class);
        intent.putExtra("show_account_fragment", true);
        startActivity(intent);
        requireActivity().finish();
    }

    // Метод для оновлення профілю після редагування
    public void updateProfile(String name, String email) {
        prefs.edit()
                .putString("user_name", name)
                .putString("user_email", email)
                .apply();

        loadProfileData(); // Оновлюємо дані на екрані
    }
}