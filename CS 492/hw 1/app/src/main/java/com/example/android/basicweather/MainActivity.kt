package com.example.android.basicweather

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

val forecastInfo = listOf(
    Forecast(14, "Mostly Sunny", "43°F", "25% precip.", "51°F", "A little cloudy"),
    Forecast(15, "AM Showers", "39°F", "80% precip.", "55°F", "Partly cloudy"),
    Forecast(16, "AM Fog/PM Clouds", "39°F", "10% precip.", "47°F", "Cloudy and cold"),
    Forecast(17, "AM Showers", "36°F", "60% precip.", "53°F", "Cloudy and chance of light rain"),
    Forecast(18, "Partly Cloudy", "33°F", "10% precip.", "49°F", "Cloudy with light rain and wind"),
    Forecast(19, "Partly Cloudy", "36°F", "15% precip.", "49°F", "Heavy clouds with rain and heavy winds"),
    Forecast(20, "Mostly Cloudy", "38°F", "30% precip.", "48°F", "Dark clouds and heavy rain"),
    Forecast(21, "Showers", "35°F", "50% precip.", "45°F", "Increasingly dark clouds and baseball sized rain drops"),
    Forecast(22, "AM Showers", "30°F", "30% precip.", "43°F", "Complete obscurement of the sun, floods, and aerial demon portals"),
    Forecast(23, "Few Showers", "31°F", "50% precip.", "43°F", "Cloudy with a chance of meatballs"))

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val forecastListRV: RecyclerView = findViewById(R.id.rv_forecast_list)
        forecastListRV.layoutManager = LinearLayoutManager(this)
        forecastListRV.setHasFixedSize(true)

        val adapter = ForecastAdapter()
        forecastListRV.adapter = adapter

        for(i in forecastInfo.indices.reversed()){
            adapter.addForecast(forecastInfo[i])
            forecastListRV.scrollToPosition(0)
        }
    }
}