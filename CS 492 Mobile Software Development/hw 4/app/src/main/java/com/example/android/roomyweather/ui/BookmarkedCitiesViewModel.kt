package com.example.android.roomyweather.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.viewModelScope
import com.example.android.roomyweather.data.AppDatabase
import com.example.android.roomyweather.data.BookmarkedCitiesRepository
import com.example.android.roomyweather.data.CityRepo
import kotlinx.coroutines.launch

class BookmarkedCitiesViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = BookmarkedCitiesRepository(
        AppDatabase.getInstance(application).cityRepoDao()
    )

    val bookmarkedCities = repository.getAllBookmarkedCities().asLiveData()

    fun addBookmarkedCity(repo: CityRepo) {
        viewModelScope.launch {
            repository.insertBookmarkedCity(repo)
        }
    }

    fun removeBookmarkedCity(repo: CityRepo) {
        viewModelScope.launch {
            repository.removeBookmarkedCity(repo)
        }
    }

    fun getBookmarkedCityByName(name: String) =
        repository.getBookmarkedCityByName(name).asLiveData()
}