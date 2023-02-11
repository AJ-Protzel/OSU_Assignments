package com.example.honorscollegeapp.ui

import android.app.SearchManager
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import com.example.honorscollegeapp.R

class CalendarFragment : Fragment(R.layout.page_calendar) {
    private val calendarUrl = "https://calendar.google.com/calendar/embed?src=dlme32b3csk7fjb1dpn9nhv5g8%40group.calendar.google.com&ctz=America%2FLos_Angeles"
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        searchWeb(calendarUrl)
    }
    /* From the android docs */
    /* https://developer.android.com/guide/components/intents-common#SearchWeb */
    fun searchWeb(query: String) {
        val intent = Intent(Intent.ACTION_WEB_SEARCH).apply {
            putExtra(SearchManager.QUERY, query)
        }
        startActivity(intent)
    }
}