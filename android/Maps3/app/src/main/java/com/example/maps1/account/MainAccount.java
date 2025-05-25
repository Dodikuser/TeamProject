package com.example.maps1.account;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.maps1.R;
import com.example.maps1.MainActivity;

public class MainAccount extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.main_account, container, false);

        Button editButton = view.findViewById(R.id.editButton);
        editButton.setOnClickListener(v -> showEditProfileDialog());

        Button logoutButton = view.findViewById(R.id.logoutButton);
        logoutButton.setOnClickListener(v -> logout());

        return view;
    }

    private void showEditProfileDialog() {
        EditProfileDialogFragment dialog = new EditProfileDialogFragment();
        dialog.show(getParentFragmentManager(), "EditProfileDialog");
    }

    private void logout() {
        // Очищаємо SharedPreferences
        SharedPreferences prefs = requireActivity().getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        prefs.edit().clear().apply();

        // Повертаємось до MainActivity, який покаже AccountFragment
        Intent intent = new Intent(requireActivity(), MainActivity.class);
        intent.putExtra("show_account_fragment", true);
        startActivity(intent);
        requireActivity().finish();
    }
}