package com.example.android.connectedweather

import android.annotation.SuppressLint
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.android.connectedweather.data.ForecastData
import java.util.*

class ForecastAdapter(private val onForecastClick: (ForecastData) -> Unit):
    RecyclerView.Adapter<ForecastAdapter.ViewHolder>() {
    private var forecastWeatherList = listOf<ForecastData>()

    @SuppressLint("NotifyDataSetChanged")
    fun updateWeatherList(newWeatherList: List<ForecastData>?) {
        forecastWeatherList = newWeatherList ?: listOf()
        notifyDataSetChanged()
    }

    override fun getItemCount() = forecastWeatherList.size

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.forecast_list_item, parent, false)
        return ViewHolder(view, onForecastClick)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(forecastWeatherList[position])
    }

    class ViewHolder(view: View, private val onClick: (ForecastData) -> Unit)
        : RecyclerView.ViewHolder(view) {

        private val monthTV: TextView = view.findViewById(R.id.tv_month)
        private val dayTV: TextView = view.findViewById(R.id.tv_day)
        private val timeTV: TextView = view.findViewById(R.id.tv_time)
        private val highTempTV: TextView = view.findViewById(R.id.tv_high_temp)
        private val popTV: TextView = view.findViewById(R.id.tv_pop)
        private val lowTempTV: TextView = view.findViewById(R.id.tv_low_temp)
        private val shortDescTV: TextView = view.findViewById(R.id.tv_short_description)

        private var currentForecastPeriod: ForecastData? = null

        init {
            view.setOnClickListener {
                currentForecastPeriod?.let(onClick)
            }
        }

        @SuppressLint("SetTextI18n")
        fun bind(forecastPeriod: ForecastData) {
            currentForecastPeriod = forecastPeriod

            val date = forecastPeriod.Time.split("-"," ",":")

            val cal = Calendar.getInstance()
            cal.set(date[0].toInt(), date[1].toInt(), date[2].toInt())

            val time: String = if(date[3].toInt() > 12){
                val hour = date[3].toInt() - 12
                hour.toString() + ":" + date[4] + " pm"
            } else{
                val hour: Int = if(date[3].toInt() == 0){
                    date[3].toInt() + 12
                } else{
                    date[3].toInt()
                }
                hour.toString() + ":" + date[4] + " am"
            }

            monthTV.text = cal.getDisplayName(Calendar.MONTH, Calendar.SHORT, Locale.getDefault())
            dayTV.text = cal.get(Calendar.DAY_OF_MONTH).toString()
            timeTV.text = time
            highTempTV.text = forecastPeriod.temp.TempMax.toInt().toString() + "°F"
            popTV.text = (forecastPeriod.Pop * 100.0).toInt().toString() + "%"
            lowTempTV.text = forecastPeriod.temp.TempMin.toInt().toString() + "°F"
            shortDescTV.text = forecastPeriod.weatherDesc[0].ShortDesc
        }
    }
}