package com.example.android.basicweather

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.snackbar.Snackbar

class ForecastAdapter : RecyclerView.Adapter<ForecastAdapter.ViewHolder>() {
    private val forecasts: MutableList<Forecast> = mutableListOf()

    override fun getItemCount() = this.forecasts.size

    fun addForecast(forecast: Forecast, position: Int = 0) {
        this.forecasts.add(position, forecast)
        this.notifyItemInserted(position)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.forecast_list_item, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(this.forecasts[position])
    }

    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        private val date: TextView = view.findViewById(R.id.tv_forecast_date)
        private val desc: TextView = view.findViewById(R.id.tv_forecast_desc)
        private val low: TextView = view.findViewById(R.id.tv_forecast_low)
        private val precip: TextView = view.findViewById(R.id.tv_forecast_precip)
        private val high: TextView = view.findViewById(R.id.tv_forecast_high)
        private val summ: TextView = view.findViewById(R.id.tv_forecast_summ)

        fun bind(forecast: Forecast) {
            this.date.text = forecast.date.toString()
            this.desc.text = forecast.desc
            this.low.text = forecast.low
            this.precip.text = forecast.precip
            this.high.text = forecast.high
            this.summ.text = forecast.summ
        }

        init{
            view.setOnClickListener{
                val snackbar = Snackbar.make(view, summ.getText(), Snackbar.LENGTH_LONG)
                snackbar.show()
            }
        }
    }
}