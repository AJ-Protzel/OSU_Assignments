package com.example.android.roomyweather.ui

import android.os.Bundle
import android.view.View
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.preference.PreferenceManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.android.roomyweather.R
import com.example.android.roomyweather.data.CityRepo
import com.example.android.roomyweather.data.ForecastPeriod
import com.google.android.material.progressindicator.CircularProgressIndicator

class MainActivityFragment : Fragment(R.layout.main_activity) {
    private val TAG = "MainActivityFragment"

    private val viewModel: FiveDayForecastViewModel by viewModels()
    private val cityViewModel: BookmarkedCitiesViewModel by viewModels()

    private lateinit var forecastAdapter: ForecastAdapter

    private lateinit var forecastListRV: RecyclerView
    private lateinit var loadingErrorTV: TextView
    private lateinit var loadingIndicator: CircularProgressIndicator

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        loadingErrorTV = view.findViewById(R.id.tv_loading_error)
        loadingIndicator = view.findViewById(R.id.loading_indicator)
        forecastListRV = view.findViewById(R.id.rv_forecast_list)

        forecastAdapter = ForecastAdapter(::onForecastItemClick)

        forecastListRV.layoutManager = LinearLayoutManager(requireContext())
        forecastListRV.setHasFixedSize(true)
        forecastListRV.adapter = forecastAdapter

        /*
         * Observe forecast data.  Whenever forecast data changes, display it in the RecyclerView.
         */
        viewModel.forecast.observe(viewLifecycleOwner) { forecast ->
            if (forecast != null) {
                forecastAdapter.updateForecast(forecast)
                forecastListRV.visibility = View.VISIBLE
                forecastListRV.scrollToPosition(0)
                (activity as AppCompatActivity).supportActionBar?.title = forecast.city.name
            }
        }

        /*
         * Observe error message.  If an error message is present, display it.
         */
        viewModel.error.observe(viewLifecycleOwner) { error ->
            if (error != null) {
                loadingErrorTV.text = getString(R.string.loading_error, error.message)
                loadingErrorTV.visibility = View.VISIBLE
            }
        }

        /*
         * Observe loading indicator.  When loading, display progress indicator and hide other
         * UI elements.
         */
        viewModel.loading.observe(viewLifecycleOwner) { loading ->
            if (loading) {
                loadingIndicator.visibility = View.VISIBLE
                loadingErrorTV.visibility = View.INVISIBLE
                forecastListRV.visibility = View.INVISIBLE
            } else {
                loadingIndicator.visibility = View.INVISIBLE
            }
        }
    }

    override fun onResume() {
        super.onResume()

        val sharedPrefs = PreferenceManager.getDefaultSharedPreferences(requireContext())
        val city = sharedPrefs.getString(getString(R.string.pref_city_key), "Corvallis,OR,US")
        val units = sharedPrefs.getString(getString(R.string.pref_units_key), null)

        viewModel.loadFiveDayForecast(city, units, OPENWEATHER_APPID)
        cityViewModel.addBookmarkedCity(CityRepo(city!!, System.currentTimeMillis()))
    }

    private fun onForecastItemClick(forecastPeriod: ForecastPeriod) {
        val directions = MainActivityFragmentDirections.navigateToForecastDetail(forecastPeriod, forecastAdapter.forecastCity!!)
        findNavController().navigate(directions)
    }
}