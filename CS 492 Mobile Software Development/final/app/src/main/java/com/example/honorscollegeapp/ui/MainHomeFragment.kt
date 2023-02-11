package com.example.honorscollegeapp.ui

import android.app.SearchManager
import android.content.Intent
import android.os.Bundle
import android.text.Layout
import android.util.Log
import android.view.View
import android.widget.EditText
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.example.honorscollegeapp.R
import com.example.honorscollegeapp.data.Calendar
import com.example.honorscollegeapp.data.CalendarEvent
import com.google.android.material.progressindicator.CircularProgressIndicator
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

const val GOOGLE_API_KEY = "AIzaSyDjwke8tWWu_-CSsA7pev_G8OqTALsaAKs"

class MainHomeFragment : Fragment(R.layout.main_home) {
    private lateinit var requestQueue: RequestQueue
    private val apiBaseUrl = "https://www.googleapis.com/"
    private val calendarId = "dlme32b3csk7fjb1dpn9nhv5g8@group.calendar.google.com"
    private val mainAdapter = CalendarAdapter(::onEventClick)

    private lateinit var searchBoxET: EditText
    private lateinit var searchResultsListRV: RecyclerView
    private lateinit var searchErrorTV: TextView
    private lateinit var loadingIndicator: CircularProgressIndicator

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        /* Rest of onCreate body */
        searchBoxET = view.findViewById(R.id.et_search_box)
        searchResultsListRV = view.findViewById(R.id.rv_search_results)
        searchErrorTV = view.findViewById(R.id.tv_search_error)
        loadingIndicator = view.findViewById(R.id.loading_indicator)
        searchResultsListRV.layoutManager = LinearLayoutManager(requireContext())
        searchResultsListRV.setHasFixedSize(true)
        searchResultsListRV.adapter = mainAdapter



//        viewModel.searchResults.observe(viewLifecycleOwner) { searchResults ->
//            mainAdapter.updateEventList(searchResults)
//        }
//        viewModel.loadingStatus.observe(viewLifecycleOwner) { uiState ->
//            when (uiState) {
//                LoadingStatus.LOADING -> {
//                    loadingIndicator.visibility = View.VISIBLE
//                    searchResultsListRV.visibility = View.INVISIBLE
//                    searchErrorTV.visibility = View.INVISIBLE
//                }
//                LoadingStatus.ERROR -> {
//                    loadingIndicator.visibility = View.INVISIBLE
//                    searchResultsListRV.visibility = View.INVISIBLE
//                    searchErrorTV.visibility = View.VISIBLE
//                }
//                else -> {
//                    loadingIndicator.visibility = View.INVISIBLE
//                    searchResultsListRV.visibility = View.VISIBLE
//                    searchErrorTV.visibility = View.INVISIBLE
//                }
//            }
//        }

        /* Rest of onCreate body */

        requestQueue = Volley.newRequestQueue(requireContext())
        doCalendarSearch(this.calendarId)
    }
    fun searchWeb(query: String) {
        val intent = Intent(Intent.ACTION_WEB_SEARCH).apply {
            putExtra(SearchManager.QUERY, query)
        }
        startActivity(intent)
    }
    private fun doCalendarSearch(calendarId: String){
        val url =
            "${apiBaseUrl}calendar/v3/calendars/${calendarId}/events?key=$GOOGLE_API_KEY"

        val moshi = Moshi.Builder()
            .addLast(KotlinJsonAdapterFactory())
            .build()
        val jsonAdapter: JsonAdapter<Calendar> =
            moshi.adapter(Calendar::class.java)

        val req = StringRequest(
            Request.Method.GET,
            url,
            {
                Log.d("MainActivity", it)
                val results = jsonAdapter.fromJson(it)
                mainAdapter.updateEventList(results?.items)
            },
            {
                Log.d(
                    "MainActivity",
                    "Error fetching from $url: ${it.message}"
                )
            }
        )
        requestQueue.add(req);
    }

    private fun onEventClick(event: CalendarEvent) {
        val directions = MainHomeFragmentDirections.navigateToEventDetail(event)
        findNavController().navigate(directions)
    }
}