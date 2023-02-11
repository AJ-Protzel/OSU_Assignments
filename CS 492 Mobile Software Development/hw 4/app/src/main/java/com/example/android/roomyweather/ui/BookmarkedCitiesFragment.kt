package com.example.android.roomyweather.ui

import android.os.Bundle
import android.view.Menu
import android.view.MenuInflater
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.Navigation.findNavController
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.android.roomyweather.R
import com.example.android.roomyweather.data.CityRepo
import com.example.android.roomyweather.data.FiveDayForecast
import com.example.android.roomyweather.util.openWeatherEpochToDate

class BookmarkedCitiesFragment : Fragment(R.layout.bookmarked_cities) {
    private val bookmarkedAdapter = BookmarkedAdapter(::onCityRepoClick)
    private lateinit var bookmarkedCitiesRV: RecyclerView

    private val viewModel: BookmarkedCitiesViewModel by viewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        bookmarkedCitiesRV = view.findViewById(R.id.rv_bookmarked_cities)
        bookmarkedCitiesRV.layoutManager = LinearLayoutManager(requireContext())
        bookmarkedCitiesRV.setHasFixedSize(true)
        bookmarkedCitiesRV.adapter = this.bookmarkedAdapter

        viewModel.bookmarkedCities.observe(viewLifecycleOwner) { bookmarkedCities ->
            bookmarkedAdapter.updateRepoList(bookmarkedCities)
        }
    }

    private fun onCityRepoClick(repo: CityRepo) {
        val directions = BookmarkedCitiesFragmentDirections.navigateToMainActivity()
        findNavController().navigate(directions)
    }
}