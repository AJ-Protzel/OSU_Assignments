package com.example.android.roomyweather.ui

import android.os.Bundle
import android.view.Menu
import android.view.MenuInflater
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import com.bumptech.glide.Glide
import com.example.android.roomyweather.R
import com.example.android.roomyweather.util.openWeatherEpochToDate

class ForecastDetailFragment : Fragment(R.layout.forecast_detail) {
    private val args: ForecastDetailFragmentArgs by navArgs()
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val time = getString(R.string.forecast_date_time, openWeatherEpochToDate(
            args.forecastPeriod.epoch, args.forecastCity.tzOffsetSec))

        setHasOptionsMenu(true)
        Glide.with(requireContext()).load(args.forecastPeriod.iconUrl).into(view.findViewById(R.id.iv_forecast_icon))
        view.findViewById<TextView>(R.id.tv_forecast_city).text = args.forecastCity.name
        view.findViewById<TextView>(R.id.tv_forecast_date).text = time
        view.findViewById<TextView>(R.id.tv_low_temp).text = args.forecastPeriod.lowTemp.toString()
        view.findViewById<TextView>(R.id.tv_high_temp).text = args.forecastPeriod.highTemp.toString()
        view.findViewById<TextView>(R.id.tv_pop).text = args.forecastPeriod.pop.toString()
        view.findViewById<TextView>(R.id.tv_clouds).text = args.forecastPeriod.cloudCover.toString()
        view.findViewById<TextView>(R.id.tv_wind).text = args.forecastPeriod.windSpeed.toString()
        view.findViewById<ImageView>(R.id.iv_wind_dir).rotation = args.forecastPeriod.windDirDeg.toFloat()
        view.findViewById<TextView>(R.id.tv_forecast_description).text = args.forecastPeriod.description
    }

    override fun onCreateOptionsMenu(menu: Menu, menuInflater: MenuInflater) {
        menuInflater.inflate(R.menu.activity_forecast_detail, menu)
    }
}