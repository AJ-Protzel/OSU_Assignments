package com.example.honorscollegeapp.data

class EventsRepository(
    private val dao: EventsDao
) {
    suspend fun insertBookmarkedRepo(repo: CalendarEvent) = dao.insert(repo)
    suspend fun removeBookmarkedRepo(repo: CalendarEvent) = dao.delete(repo)
    fun getAllBookmarkedRepos() = dao.getAllRepos()
    fun getBookmarkedRepoByName(name: String) = dao.getRepoByName(name)
}