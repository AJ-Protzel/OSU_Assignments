package com.example.honorscollegeapp.util

fun HonorsUtilsDate(startDateTime: String): String {
    val dateArray = startDateTime.split("-", "T", ":").toTypedArray()
    return dateArray[1]+"/"+dateArray[2]
}

fun HonorsUtilsTime(startDateTime: String): String {
    var dateArray = startDateTime.split("-", "T", ":").toTypedArray()
    var ampm = "AM"
    if(dateArray[3].toInt() > 11){
        dateArray[3] = (dateArray[3].toInt() - 12).toString()
        ampm = "PM"
    }
    if(dateArray[3].toInt() == 0){
        dateArray[3] = "12"
    }
    return dateArray[3] + ":" + dateArray[4] + " " + ampm
}