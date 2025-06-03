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

    private TextInputEditText etFirstName, etOldPassword, etPassword, etConfirmPassword;
    private SharedPreferences prefs;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.dialog_edit_profile, container, false);

        prefs = requireActivity().getSharedPreferences("app_prefs", requireContext().MODE_PRIVATE);

        etFirstName = view.findViewById(R.id.nameEditText);
        etOldPassword = view.findViewById(R.id.oldPasswordEditText);
        etPassword = view.findViewById(R.id.passwordEditText);
        etConfirmPassword = view.findViewById(R.id.confirmPasswordEditText);

        // Заповнення полів поточними даними
        String name = prefs.getString("user_name", "Ім'я");
        etFirstName.setText(name);

        MaterialButton saveButton = view.findViewById(R.id.saveButton);
        MaterialButton cancelButton = view.findViewById(R.id.cancelButton);

        saveButton.setOnClickListener(v -> {
            String firstName = etFirstName.getText().toString().trim();
            String oldPassword = etOldPassword.getText().toString().trim();
            String password = etPassword.getText().toString().trim();
            String confirmPassword = etConfirmPassword.getText().toString().trim();

            if (firstName.isEmpty()) {
                Toast.makeText(getContext(), "Заповніть обов'язкові поля", Toast.LENGTH_SHORT).show();
                return;
            }

            if (!password.isEmpty() && !password.equals(confirmPassword)) {
                Toast.makeText(getContext(), "Паролі не співпадають", Toast.LENGTH_SHORT).show();
                return;
            }

            // PATCH-запрос на сервер
            new Thread(() -> {
                try {
                    // Доверяем все сертификаты (для 10.0.2.2 и self-signed)
                    javax.net.ssl.TrustManager[] trustAllCerts = new javax.net.ssl.TrustManager[]{
                        new javax.net.ssl.X509TrustManager() {
                            public java.security.cert.X509Certificate[] getAcceptedIssuers() { return new java.security.cert.X509Certificate[0]; }
                            public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                            public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                        }
                    };
                    javax.net.ssl.SSLContext sc = javax.net.ssl.SSLContext.getInstance("SSL");
                    sc.init(null, trustAllCerts, new java.security.SecureRandom());
                    javax.net.ssl.HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
                    javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

                    java.net.URL url = new java.net.URL("https://10.0.2.2:7103/api/User/edit");
                    javax.net.ssl.HttpsURLConnection conn = (javax.net.ssl.HttpsURLConnection) url.openConnection();
                    conn.setRequestMethod("PATCH");
                    conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                    String token = prefs.getString("auth_token", null);
                    if (token != null) {
                        conn.setRequestProperty("Authorization", "Bearer " + token);
                    }
                    conn.setDoOutput(true);

                    org.json.JSONObject jsonParam = new org.json.JSONObject();
                    jsonParam.put("name", firstName);
                    if (!password.isEmpty()) {
                        jsonParam.put("passwordNew", password);
                        jsonParam.put("passwordOld", oldPassword);
                    }

                    java.io.OutputStream os = conn.getOutputStream();
                    os.write(jsonParam.toString().getBytes("UTF-8"));
                    os.close();

                    int responseCode = conn.getResponseCode();
                    if (responseCode == 200) {
                        requireActivity().runOnUiThread(() -> {
                            Toast.makeText(getContext(), "Зміни збережено на сервері", Toast.LENGTH_SHORT).show();
                            ((MainAccount) getTargetFragment()).updateProfile(firstName);
                            dismiss();
                        });
                    } else {
                        java.io.InputStream errorStream = conn.getErrorStream();
                        String errorMsg;
                        if (errorStream != null) {
                            java.util.Scanner s = new java.util.Scanner(errorStream).useDelimiter("\\A");
                            errorMsg = s.hasNext() ? s.next() : "";
                        } else {
                            errorMsg = "";
                        }
                        requireActivity().runOnUiThread(() -> {
                            Toast.makeText(getContext(), "Помилка при збереженні: " + responseCode + " " + errorMsg, Toast.LENGTH_LONG).show();
                        });
                    }
                    conn.disconnect();
                } catch (Exception e) {
                    e.printStackTrace();
                    requireActivity().runOnUiThread(() -> {
                        Toast.makeText(getContext(), "Помилка підключення: " + e.getMessage(), Toast.LENGTH_LONG).show();
                    });
                }
            }).start();
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