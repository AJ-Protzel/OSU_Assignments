package com.example.honorscollegeapp.ui

import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.TextView
import androidx.appcompat.content.res.AppCompatResources
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.navArgs
import com.example.honorscollegeapp.R
import com.example.honorscollegeapp.util.HonorsUtilsDate
import com.example.honorscollegeapp.util.HonorsUtilsTime

import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import android.view.MenuInflater
import androidx.appcompat.app.AppCompatActivity
import androidx.activity.viewModels
import com.google.android.material.snackbar.Snackbar



class EventDetailsFragment : Fragment(R.layout.page_event_detail) {
    private val args: EventDetailsFragmentArgs by navArgs()
    private val cityViewModel: SavedEventsViewModel by viewModels()
    private var isBookmarked = false

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val date = HonorsUtilsDate(args.event.start.startdateTime)
        val time = HonorsUtilsTime(args.event.end.enddateTime)

//        view.findViewById<TextView>(R.id.tv_event_title).text = args.event.summary
        view.findViewById<TextView>(R.id.tv_desc).text = args.event.description
        view.findViewById<TextView>(R.id.tv_event_location).text = args.event.location
        view.findViewById<TextView>(R.id.tv_date).text = date
        view.findViewById<TextView>(R.id.tv_time).text = time

        setHasOptionsMenu(true)

    }

    override fun onCreateOptionsMenu(menu: Menu, menuInflater: MenuInflater) {
        menuInflater.inflate(R.menu.activity_event_detail, menu)
        val bookmarkItem = menu.findItem(R.id.action_bookmark)
        cityViewModel.getBookmarkedRepoByName(args.event!!.summary).observe(this) { bookmarkedRepo ->
            when (bookmarkedRepo) {
                null -> {
                    isBookmarked = false
                    bookmarkItem.icon = AppCompatResources.getDrawable(
                        requireContext(),
                        R.drawable.ic_action_bookmark_off
                    )
                }
                else -> {
                    isBookmarked = true
                    bookmarkItem.icon = AppCompatResources.getDrawable(
                        requireContext(),
                        R.drawable.ic_action_bookmark_on
                    )
                }
            }
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when(item.itemId) {
            R.id.action_bookmark -> {
                toggleEventBookmark(item)
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun toggleEventBookmark(menuItem: MenuItem) {
        if (args.event != null) {
            isBookmarked = !isBookmarked
            menuItem.isChecked = isBookmarked
            when (isBookmarked) {
                true -> {
                    cityViewModel.addBookmarkedRepo(args.event!!)
                }
                false -> {
                    cityViewModel.removeBookmarkedRepo(args.event!!)
                }
            }
        }
    }
}