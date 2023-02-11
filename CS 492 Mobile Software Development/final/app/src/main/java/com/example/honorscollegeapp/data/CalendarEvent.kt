package com.example.honorscollegeapp.data

import androidx.room.Embedded
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.squareup.moshi.Json
import java.io.Serializable

@Entity
data class CalendarEvent(
    val id: String,
    val created: String,
    val updated: String,
    @PrimaryKey
    val summary: String,
    val description: String,
    val location: String,
    @Embedded val start: CalendarStart,
    @Embedded val end: CalendarEnd,
) : Serializable

data class CalendarStart(
    @Json(name = "dateTime") val startdateTime: String,
    @Json(name = "timeZone") val starttimeZone: String,
)
data class CalendarEnd(
    @Json(name = "dateTime") val enddateTime: String,
    @Json(name = "timeZone") val endtimeZone: String,
)
