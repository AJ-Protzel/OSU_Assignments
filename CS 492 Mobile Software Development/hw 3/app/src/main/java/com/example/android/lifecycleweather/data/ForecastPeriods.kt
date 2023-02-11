package com.example.android.lifecycleweather.data

import android.text.TextUtils
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.lang.Exception

class ForecastPeriods(
    private val service: ForecastService,
    private val ioDispatcher: CoroutineDispatcher = Dispatchers.IO
) {
    suspend fun loadForecastSearch(city: String, units: String, appid: String): Result<FiveDayForecast> =
        withContext(ioDispatcher) {
            try {
                val results = service.searchPeriods(city, units, appid)
                Result.success(results)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
}