package com.example.honorscollegeapp.ui

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.honorscollegeapp.R
import com.example.honorscollegeapp.data.*
import com.example.honorscollegeapp.util.HonorsUtilsDate
import com.example.honorscollegeapp.util.HonorsUtilsTime

class CalendarAdapter(private val onClick: (CalendarEvent) -> Unit)
    : RecyclerView.Adapter<CalendarAdapter.ViewHolder>() {
    var calendarEvents: List<CalendarEvent> = listOf()

    fun updateEventList(events: List<CalendarEvent>?) {
        calendarEvents = events?: listOf()
        notifyDataSetChanged()
    }

    override fun getItemCount() = this.calendarEvents.size

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.main_event_card, parent, false) //event_list_item xml needs to be created
        return ViewHolder(view, onClick)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(this.calendarEvents[position])
    }


    class ViewHolder(itemView: View, val onClick: (CalendarEvent) -> Unit)
        : RecyclerView.ViewHolder(itemView) {

        private val nameTV: TextView = itemView.findViewById(R.id.tv_name)
        private val dateTV: TextView = itemView.findViewById(R.id.tv_date)
        private val descTV: TextView = itemView.findViewById(R.id.tv_desc)

        private var currentEvent: CalendarEvent? = null

        init {
            itemView.setOnClickListener {
                currentEvent?.let(onClick)
            }
        }

        fun bind(calendarEvent: CalendarEvent) {
            currentEvent = calendarEvent

            val ctx = itemView.context
            val date = HonorsUtilsDate(calendarEvent.start.startdateTime)
            val time = HonorsUtilsTime(calendarEvent.start.startdateTime)

            nameTV.text = calendarEvent.summary
            dateTV.text = date
            descTV.text = calendarEvent.description
        }
    }
}