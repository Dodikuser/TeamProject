plugins {
    alias(libs.plugins.android.application)
    // Убираем плагин для Firebase
}

android {
    namespace = "com.example.maps1"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.maps1"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {
    // Убираем зависимости Firebase
    // implementation("com.google.firebase:firebase-auth:22.1.1")

    // Добавляем зависимости для Retrofit и Gson
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.google.code.gson:gson:2.10.1") // Обновлена версия Gson

    // Google Maps
    implementation("com.google.android.gms:play-services-maps:18.2.0")
    implementation("com.google.android.gms:play-services-location:21.0.1")

    // AndroidX & UI
    implementation("androidx.appcompat:appcompat:1.6.1") // Добавлена зависимость для AppCompat
    implementation("com.google.android.material:material:1.9.0") // Обновлена зависимость для Material Design
    implementation(libs.activity)
    implementation(libs.constraintlayout)

    // Тесты
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}
