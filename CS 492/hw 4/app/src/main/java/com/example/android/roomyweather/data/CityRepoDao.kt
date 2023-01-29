package com.example.android.roomyweather.data

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface CityRepoDao {
    @Insert
    suspend fun insert(repo: CityRepo)

    @Delete
    suspend fun delete(repo: CityRepo)

    @Query("SELECT * FROM CityRepo")
    fun getAllCities(): Flow<List<CityRepo>>

    @Query("SELECT * FROM CityRepo WHERE city = :name LIMIT 1")
    fun getCityByName(name: String): Flow<CityRepo?>
}