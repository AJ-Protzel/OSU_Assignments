package com.example.android.connectedweather

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.example.android.connectedweather.data.ForecastData
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

const val ID = "ee609f84521a67abf65de96dd0d1a8da"
const val Count = "9"
const val City = "Corvallis,CA,US"

//https://api.openweathermap.org/data/2.5/forecast?APPID=ee609f84521a67abf65de96dd0d1a8da&cnt=9&q=Corvallis,CA,US&units=imperial

class MainActivity : AppCompatActivity() {
    private val apiBaseUrl = "https://api.openweathermap.org/data/2.5/forecast?APPID=$ID&cnt=$Count&q=$City&units=imperial"
    private val tag = "MainActivity"
    private lateinit var requestQueue: RequestQueue
    private val forecastListAdapter = ForecastAdapter(::onForecastClick)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        requestQueue = Volley.newRequestQueue(this)
        doForecastSearch()

        val forecastListRV = findViewById<RecyclerView>(R.id.rv_forecast_list)
        forecastListRV.layoutManager = LinearLayoutManager(this)
        forecastListRV.setHasFixedSize(true)

        forecastListRV.adapter = forecastListAdapter
    }

    private fun doForecastSearch() {
        val moshi = Moshi.Builder()
            .addLast(KotlinJsonAdapterFactory())
            .build()
        val jsonAdapter: JsonAdapter<ForecastResults> =
            moshi.adapter(ForecastResults::class.java)

        val req = StringRequest(
            Request.Method.GET,
            apiBaseUrl,
            {
                val results = jsonAdapter.fromJson(it)
                forecastListAdapter.updateWeatherList(results?.list)
            },
            {
                Log.d(tag, "Error fetching from $apiBaseUrl: ${it.message}")
            }
        )
        requestQueue.add(req)
    }

    private fun onForecastClick(forecast: ForecastData){
        val intent = Intent(this, MainActivity2::class.java).apply {
            putExtra(EXTRA_FORECAST, forecast)
        }
        startActivity(intent)
    }

    private data class ForecastResults(
        val list: List<ForecastData>
    )
}