package com.example.maps1;  // Добавлено

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface ApiService {
    @POST("api/auth")
    Call<AuthResponse> authenticate(@Body AuthRequest request);
}