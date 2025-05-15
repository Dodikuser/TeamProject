package fragment;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import com.example.maps1.R;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.button.MaterialButtonToggleGroup;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class AccountFragment extends Fragment {

    private boolean isLoginMode = true;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_account, container, false);

        MaterialButtonToggleGroup toggleGroup = view.findViewById(R.id.toggleGroup);
        MaterialButton btnLogin = view.findViewById(R.id.btnLogin);
        MaterialButton btnRegister = view.findViewById(R.id.btnRegister);
        MaterialButton btnSubmit = view.findViewById(R.id.btnSubmit);

        TextInputLayout layoutFirstName = view.findViewById(R.id.layoutFirstName);
        TextInputLayout layoutLastName = view.findViewById(R.id.layoutLastName);
        TextInputLayout layoutCity = view.findViewById(R.id.layoutCity);

        TextInputEditText etFirstName = view.findViewById(R.id.etFirstName);
        TextInputEditText etLastName = view.findViewById(R.id.etLastName);
        TextInputEditText etCity = view.findViewById(R.id.etCity);
        TextInputEditText etEmail = view.findViewById(R.id.etEmail);
        TextInputEditText etPassword = view.findViewById(R.id.etPassword);

        // Переключатель между режимами
        toggleGroup.addOnButtonCheckedListener((group, checkedId, isChecked) -> {
            if (!isChecked) return;

            if (checkedId == R.id.btnLogin) {
                layoutFirstName.setVisibility(View.GONE);
                layoutLastName.setVisibility(View.GONE);
                layoutCity.setVisibility(View.GONE);
                btnSubmit.setText(R.string.login);
                isLoginMode = true;
            } else if (checkedId == R.id.btnRegister) {
                layoutFirstName.setVisibility(View.VISIBLE);
                layoutLastName.setVisibility(View.VISIBLE);
                layoutCity.setVisibility(View.VISIBLE);
                btnSubmit.setText(R.string.register);
                isLoginMode = false;
            }
        });

        // Обработка нажатия кнопки отправки
        btnSubmit.setOnClickListener(v -> {
            String email = etEmail.getText().toString().trim();
            String password = etPassword.getText().toString().trim();

            if (TextUtils.isEmpty(email) || TextUtils.isEmpty(password)) {
                Toast.makeText(getContext(), "Введіть email та пароль", Toast.LENGTH_SHORT).show();
                return;
            }

            if (isLoginMode) {
                // Логика входа
                Toast.makeText(getContext(), "Спроба входу...", Toast.LENGTH_SHORT).show();
                // TODO: Отправить данные на сервер
            } else {
                String firstName = etFirstName.getText().toString().trim();
                String lastName = etLastName.getText().toString().trim();
                String city = etCity.getText().toString().trim();

                if (TextUtils.isEmpty(firstName) || TextUtils.isEmpty(lastName) || TextUtils.isEmpty(city)) {
                    Toast.makeText(getContext(), "Заповніть всі поля", Toast.LENGTH_SHORT).show();
                    return;
                }

                // Логика регистрации
                // Вместо вывода данных, здесь мы отправляем их на сервер
                sendRegistrationRequest(firstName, lastName, city, email, password);
            }
        });

        return view;
    }

    private void sendRegistrationRequest(String firstName, String lastName, String city, String email, String password) {
        new Thread(() -> {
            try {
                // Укажи свой IP и порт
                URL url = new URL("http://192.168.1.100:5000/api/register");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                conn.setDoOutput(true);
                conn.setDoInput(true);

                JSONObject jsonParam = new JSONObject();
                jsonParam.put("firstName", firstName);
                jsonParam.put("lastName", lastName);
                jsonParam.put("city", city);
                jsonParam.put("email", email);
                jsonParam.put("password", password);

                OutputStream os = conn.getOutputStream();
                os.write(jsonParam.toString().getBytes("UTF-8"));
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    requireActivity().runOnUiThread(() -> {
                        Toast.makeText(getContext(), "Успішна реєстрація!", Toast.LENGTH_SHORT).show();
                    });
                } else {
                    requireActivity().runOnUiThread(() -> {
                        Toast.makeText(getContext(), "Помилка при реєстрації: " + responseCode, Toast.LENGTH_SHORT).show();
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
    }
}
