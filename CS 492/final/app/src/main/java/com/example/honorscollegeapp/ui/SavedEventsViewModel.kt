package com.example.honorscollegeapp.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.viewModelScope
import com.example.honorscollegeapp.data.*
import kotlinx.coroutines.launch

class SavedEventsViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = EventsRepository(
        EventsDatabase.getInstance(application).eventsDao()
    )

    val bookmarkedRepos = repository.getAllBookmarkedRepos().asLiveData()

    fun addBookmarkedRepo(repo: CalendarEvent) {
        viewModelScope.launch {
            repository.insertBookmarkedRepo(repo)
        }
    }

    fun removeBookmarkedRepo(repo: CalendarEvent) {
        viewModelScope.launch {
            repository.removeBookmarkedRepo(repo)
        }
    }

    fun getBookmarkedRepoByName(name: String) =
        repository.getBookmarkedRepoByName(name).asLiveData()
}