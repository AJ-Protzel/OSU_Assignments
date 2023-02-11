package com.example.android.connectedweather.data

import com.squareup.moshi.Json
import java.io.Serializable

data class ForecastData(
    @Json(name = "dt_txt") val Time: String,
    @Json(name = "main") val temp: ForecastWeatherTemp,
    @Json(name = "pop") val Pop: Double,
    @Json(name = "weather") val weatherDesc: List<ForecastWeatherDesc>,
    @Json(name = "clouds") val clouds: ForecastWeatherClouds,
    @Json(name = "wind") val wind: ForecastWeatherWind,
): Serializable

data class ForecastWeatherTemp(
    @Json(name = "temp_max") val TempMax: Float,
    @Json(name = "temp_min") val TempMin: Float
): Serializable

data class ForecastWeatherDesc(
    @Json(name = "main") val ShortDesc: String,
    @Json(name = "description") val LongDesc: String,
): Serializable

data class ForecastWeatherClouds(
    @Json(name = "all") val Clouds: Int
): Serializable

data class ForecastWeatherWind(
    @Json(name = "speed") val Speed: Float
): Serializable