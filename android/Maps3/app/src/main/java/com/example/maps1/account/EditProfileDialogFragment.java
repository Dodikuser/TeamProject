package com.example.maps1.account;

import android.app.Dialog;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;

import com.example.maps1.R;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

public class EditProfileDialogFragment extends DialogFragment {

    private TextInputEditText etFirstName, etLastName, etEmail, etPassword, etConfirmPassword;
    private SharedPreferences prefs;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.dialog_edit_profile, container, false);

        prefs = requireActivity().getSharedPreferences("app_prefs", requireContext().MODE_PRIVATE);

        etFirstName = view.findViewById(R.id.nameEditText);
        etLastName = view.findViewById(R.id.surnameEditText);
        etEmail = view.findViewById(R.id.emailEditText);
        etPassword = view.findViewById(R.id.passwordEditText);
        etConfirmPassword = view.findViewById(R.id.confirmPasswordEditText);

        // Заповнення полів поточними даними
        String[] nameParts = prefs.getString("user_name", "Ім'я Прізвище").split(" ");
        etFirstName.setText(nameParts.length > 0 ? nameParts[0] : "");
        etLastName.setText(nameParts.length > 1 ? nameParts[1] : "");
        etEmail.setText(prefs.getString("user_email", "example@gmail.com"));

        MaterialButton saveButton = view.findViewById(R.id.saveButton);
        MaterialButton cancelButton = view.findViewById(R.id.cancelButton);

        saveButton.setOnClickListener(v -> {
            String firstName = etFirstName.getText().toString().trim();
            String lastName = etLastName.getText().toString().trim();
            String email = etEmail.getText().toString().trim();
            String password = etPassword.getText().toString().trim();
            String confirmPassword = etConfirmPassword.getText().toString().trim();

            if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty()) {
                Toast.makeText(getContext(), "Заповніть обов'язкові поля", Toast.LENGTH_SHORT).show();
                return;
            }

            if (!password.isEmpty() && !password.equals(confirmPassword)) {
                Toast.makeText(getContext(), "Паролі не співпадають", Toast.LENGTH_SHORT).show();
                return;
            }

            // Оновлюємо дані
            String fullName = firstName + " " + lastName;
            ((MainAccount) getTargetFragment()).updateProfile(fullName, email);

            if (!password.isEmpty()) {
                // Тут можна додати логіку зміни пароля
                prefs.edit().putString("user_password", password).apply();
            }

            Toast.makeText(getContext(), "Зміни збережено", Toast.LENGTH_SHORT).show();
            dismiss();
        });

        cancelButton.setOnClickListener(v -> dismiss());

        return view;
    }

    @Override
    public void onStart() {
        super.onStart();
        Dialog dialog = getDialog();
        if (dialog != null) {
            int width = ViewGroup.LayoutParams.MATCH_PARENT;
            int height = ViewGroup.LayoutParams.MATCH_PARENT;
            dialog.getWindow().setLayout(width, height);
        }
    }
}