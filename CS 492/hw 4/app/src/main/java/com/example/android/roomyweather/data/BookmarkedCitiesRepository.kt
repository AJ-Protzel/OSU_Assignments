package com.example.android.roomyweather.data

class BookmarkedCitiesRepository(
    private val dao: CityRepoDao
) {
    suspend fun insertBookmarkedCity(repo: CityRepo) = dao.insert(repo)
    suspend fun removeBookmarkedCity(repo: CityRepo) = dao.delete(repo)
    fun getAllBookmarkedCities() = dao.getAllCities()
    fun getBookmarkedCityByName(name: String) = dao.getCityByName(name)
}