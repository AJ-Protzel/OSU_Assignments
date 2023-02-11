package com.example.android.roomyweather.data

import com.example.android.roomyweather.api.OpenWeatherService
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.lang.Exception

class FiveDayForecastRepository(
    private val service: OpenWeatherService,
    private val ioDispatcher: CoroutineDispatcher = Dispatchers.IO
) {
    private var currentCity: String? = null
    private var currentUnits: String? = null
    private var cachedForecast: FiveDayForecast? = null

    suspend fun loadFiveDayForecast(
        city: String?,
        units: String?,
        apiKey: String
    ) : Result<FiveDayForecast> {
        /*
         * If we have a cached forecast for the same city and units, return the cached forecast
         * without making a network call.  Otherwise, make an API call (in a background thread) to
         * fetch new forecast data and cache it before returning it.
         */
        return if (city == currentCity && units == currentUnits && cachedForecast!= null) {
            Result.success(cachedForecast!!)
        } else {
            currentCity = city
            currentUnits = units
            withContext(ioDispatcher) {
                try {
                    val forecast = service.loadFiveDayForecast(city, units, apiKey)
                    cachedForecast = forecast
                    Result.success(forecast)
                } catch (e: Exception) {
                    Result.failure(e)
                }
            }
        }
    }
}