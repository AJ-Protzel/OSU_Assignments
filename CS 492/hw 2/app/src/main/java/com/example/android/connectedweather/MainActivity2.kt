package com.example.android.connectedweather

import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView
import com.example.android.connectedweather.data.ForecastData
import java.util.*

const val EXTRA_FORECAST = "ForecastData"

class MainActivity2 : AppCompatActivity() {
    private var forecast: ForecastData? = null

    @SuppressLint("SetTextI18n")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main2)

        if (intent != null && intent.hasExtra(EXTRA_FORECAST)) {
            forecast = intent.getSerializableExtra(EXTRA_FORECAST) as ForecastData

            val date = forecast!!.Time.split("-", " ", ":")
            val cal = Calendar.getInstance()
            cal.set(date[0].toInt(), date[1].toInt(), date[2].toInt())

            val time: String = if (date[3].toInt() > 12) {
                val hour = date[3].toInt() - 12
                hour.toString() + ":" + date[4] + " pm"
            } else {
                val hour: Int = if (date[3].toInt() == 0) {
                    date[3].toInt() + 12
                } else {
                    date[3].toInt()
                }
                hour.toString() + ":" + date[4] + " am"
            }

            findViewById<TextView>(R.id.tv_long_description).text = forecast!!.weatherDesc[0].LongDesc
            findViewById<TextView>(R.id.tv_city).text = "Corvallis"
            findViewById<TextView>(R.id.tv_month).text = cal.getDisplayName(Calendar.MONTH, Calendar.SHORT, Locale.getDefault())
            findViewById<TextView>(R.id.tv_day).text = cal.get(Calendar.DAY_OF_MONTH).toString() + ", "
            findViewById<TextView>(R.id.tv_time).text = time
            findViewById<TextView>(R.id.tv_low_temp).text = forecast!!.temp.TempMin.toInt().toString() + "°F"
            findViewById<TextView>(R.id.tv_high_temp).text = forecast!!.temp.TempMax.toInt().toString() + "°F"
            findViewById<TextView>(R.id.tv_pop).text = (forecast!!.Pop * 100.0).toInt().toString() + "%"
            findViewById<TextView>(R.id.tv_clouds).text = forecast!!.clouds.Clouds.toString() + "%"
            findViewById<TextView>(R.id.tv_wind).text = forecast!!.wind.Speed.toString() + "mph"
            findViewById<TextView>(R.id.tv_short_description).text = forecast!!.weatherDesc[0].ShortDesc

        }
    }
}