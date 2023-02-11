package com.example.honorscollegeapp.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

const val DATABASE_NAME = "registered-events-db"

@Database(entities = [CalendarEvent::class], version = 1)
abstract class EventsDatabase : RoomDatabase() {
    abstract fun eventsDao(): EventsDao

    companion object {
        @Volatile private var instance: EventsDatabase? = null

        fun getInstance(context: Context): EventsDatabase {
            return instance ?: synchronized(this) {
                instance ?: buildDatabase(context).also {
                    instance = it
                }
            }
        }

        private fun buildDatabase(context: Context) =
            Room.databaseBuilder(context, EventsDatabase::class.java, DATABASE_NAME)
                .build()
    }
}