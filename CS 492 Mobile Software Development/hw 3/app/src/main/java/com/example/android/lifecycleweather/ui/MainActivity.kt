@file:Suppress("WHEN_ENUM_CAN_BE_NULL_IN_JAVA")
package com.example.android.lifecycleweather.ui

import android.content.Intent
import android.os.Bundle
import android.text.TextUtils
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.TextView
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.preference.PreferenceManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.android.lifecycleweather.BuildConfig
import com.example.android.lifecycleweather.R
import com.example.android.lifecycleweather.data.ForecastPeriod
import com.example.android.lifecycleweather.data.LoadingStatus
import com.google.android.material.progressindicator.CircularProgressIndicator

//const val OPENWEATHER_APPID = "ee609f84521a67abf65de96dd0d1a8da"
const val OPENWEATHER_APPID = BuildConfig.OPENWEATHER_API_KEY
const val inputCity = "Corvallis,OR,US"
const val inputUnits = "imperial"

class MainActivity : AppCompatActivity() {
    private lateinit var forecastAdapter: ForecastAdapter
    private val viewModel: ForecastViewModel by viewModels()

    private lateinit var forecastListRV: RecyclerView
    private lateinit var loadingErrorTV: TextView
    private lateinit var loadingIndicator: CircularProgressIndicator

    var unit = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        forecastAdapter = ForecastAdapter(::onForecastItemClick)
        loadingErrorTV = findViewById(R.id.tv_loading_error)
        loadingIndicator = findViewById(R.id.loading_indicator)
        forecastListRV = findViewById(R.id.rv_forecast_list)
        forecastListRV.layoutManager = LinearLayoutManager(this)
        forecastListRV.setHasFixedSize(true)
        forecastListRV.adapter = forecastAdapter

        viewModel.loadingStatus.observe(this){ loadingStatus ->
            when (loadingStatus){
                LoadingStatus.LOADING -> {
                    loadingIndicator.visibility = View.VISIBLE
                    forecastListRV.visibility = View.INVISIBLE
                    loadingErrorTV.visibility = View.INVISIBLE
                }
                LoadingStatus.ERROR -> {
                    loadingIndicator.visibility = View.INVISIBLE
                    forecastListRV.visibility = View.INVISIBLE
                    loadingErrorTV.visibility = View.VISIBLE
                }
                LoadingStatus.SUCCESS -> {
                    loadingIndicator.visibility = View.INVISIBLE
                    forecastListRV.visibility = View.VISIBLE
                    loadingErrorTV.visibility = View.INVISIBLE
                }
            }
        }

        viewModel.searchResults.observe(this){ searchResults ->
            forecastAdapter.updateForecast(searchResults)
        }

        val sharedPrefs = PreferenceManager.getDefaultSharedPreferences(this)
        val city = sharedPrefs.getString(getString(R.string.pref_query_key), null).toString()
        val units = sharedPrefs.getString(getString(R.string.pref_units_key), null).toString()
        unit = units

        viewModel.loadSearchResults(city, units, OPENWEATHER_APPID)
    }

    override fun onResume() {
        super.onResume()

        val sharedPrefs = PreferenceManager.getDefaultSharedPreferences(this)
        val city = sharedPrefs.getString(getString(R.string.pref_query_key), null).toString()
        val units = sharedPrefs.getString(getString(R.string.pref_units_key), null).toString()
        unit = units

        viewModel.loadSearchResults(city, units, OPENWEATHER_APPID)
    }

    private fun onForecastItemClick(forecastPeriod: ForecastPeriod) {
        val intent = Intent(this, ForecastDetailActivity::class.java).apply {
            putExtra(EXTRA_FORECAST_PERIOD, forecastPeriod)
            putExtra(EXTRA_FORECAST_CITY, forecastAdapter.forecastCity)
        }
        startActivity(intent)
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.activity_main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_settings -> {
                val intent = Intent(this, SettingsActivity::class.java)
                startActivity(intent)
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}