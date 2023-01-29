package com.example.android.roomyweather.api

import com.example.android.roomyweather.data.FiveDayForecast
import com.example.android.roomyweather.data.OpenWeatherCityJsonAdapter
import com.example.android.roomyweather.data.OpenWeatherListJsonAdapter
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.GET
import retrofit2.http.Query

interface OpenWeatherService {
    @GET("forecast")
    suspend fun loadFiveDayForecast(
        @Query("q") city: String?,
        @Query("units") units: String?,
        @Query("appid") apiKey: String
    ) : FiveDayForecast

    companion object {
        private const val BASE_URL = "https://api.openweathermap.org/data/2.5/"
        fun create() : OpenWeatherService {
            val moshi = Moshi.Builder()
                .add(OpenWeatherListJsonAdapter())
                .add(OpenWeatherCityJsonAdapter())
                .addLast(KotlinJsonAdapterFactory())
                .build()
            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(MoshiConverterFactory.create(moshi))
                .build()
                .create(OpenWeatherService::class.java)
        }
    }
}