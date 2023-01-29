package com.example.honorscollegeapp.data

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface EventsDao {
    @Insert
    suspend fun insert(repo: CalendarEvent)

    @Delete
    suspend fun delete(repo: CalendarEvent)

    @Query("SELECT * FROM CalendarEvent")
    fun getAllRepos(): Flow<List<CalendarEvent>>

    @Query("SELECT * FROM CalendarEvent WHERE summary = :name LIMIT 1")
    fun getRepoByName(name: String): Flow<CalendarEvent?>
}