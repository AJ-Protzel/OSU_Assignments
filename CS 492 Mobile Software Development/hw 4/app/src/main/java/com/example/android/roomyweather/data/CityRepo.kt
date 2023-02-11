package com.example.android.roomyweather.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity
data class CityRepo(
    val city: String,
    @PrimaryKey val time: Long
)
