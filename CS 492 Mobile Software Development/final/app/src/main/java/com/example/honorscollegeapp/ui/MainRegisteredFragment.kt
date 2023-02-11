package com.example.honorscollegeapp.ui

import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.android.volley.Request
import com.android.volley.toolbox.StringRequest
import com.example.honorscollegeapp.R
import com.example.honorscollegeapp.data.Calendar
import com.example.honorscollegeapp.data.CalendarEvent
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

class MainRegisteredFragment : Fragment(R.layout.main_registered) {
    private val EventAdapter = CalendarAdapter(::onEventClick)
    private lateinit var RegisteredEventRV: RecyclerView

    private val viewModel: SavedEventsViewModel by viewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        RegisteredEventRV = view.findViewById(R.id.rv_main_registered)
        RegisteredEventRV.layoutManager = LinearLayoutManager(requireContext())
        RegisteredEventRV.setHasFixedSize(true)
        RegisteredEventRV.adapter = this.EventAdapter

        viewModel.bookmarkedRepos.observe(viewLifecycleOwner) { bookmarkedRepos ->
            EventAdapter.updateEventList(bookmarkedRepos)
        }
    }

    private fun onEventClick(event: CalendarEvent) {
        val directions = MainHomeFragmentDirections.navigateToEventDetail(event)
        findNavController().navigate(directions)
    }
}