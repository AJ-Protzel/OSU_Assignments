# Assignment 2
**Due by 11:59pm on Monday, 2/7/2022** <br />
**Demo due by 11:59pm on Monday, 2/21/2022**

In this assignment, we'll continue working on our weather app, hooking it up to an HTTP API to fetch forecast data over the internet and using Intents to start new activities.  The parts of the assignment are outlined below.  Below is a screen capture roughly depicting some of the behavior you'll implement for this assignment.  Your solution doesn't have to match all of the styling, icons, layout, etc. depicted in the screen capture below, but the basic functionality of your app should be the same (i.e. displaying a list of forecast data fetched from an HTTP API, opening a new activity to display the details when a forecast in the list is clicked, and adding support for sharing and mapping actions via implicit intents).

![Screen capture of working assignment 2 solution](screencap.gif)

## 1. Hook your app up to the OpenWeather API

This repository provides you with some starter code that displays hard-coded dummy forecast data in a `RecyclerView`-based list (i.e. a solution to assignment 1).  Your first task for this assignment is to use Volley to fetch forecast data from the OpenWeather API and to display that data in the `RecyclerView` instead of the dummy data.  You can find more info about the OpenWeather API here: https://openweathermap.org/api.  Here are some steps you can follow to get everything working for this part of the assignment:

  1. To be able to use the OpenWeather API, you'll first need to sign up for an OpenWeather API key here: http://openweathermap.org/appid.  Without this API key, you won't be able to make calls to the API.

  2. Construct the URL you'll use to query OpenWeather's [5-day forecast API](https://openweathermap.org/forecast5).  For this assignment, you'll query [by city name](https://openweathermap.org/forecast5#name5).  You can either hard-code your URL to contain a city (e.g. "Corvallis,OR,US"), or you can set things up so that the city can be stored in a parameter value that's plugged into the URL.  Don't forget include your API key as a query string parameter in the URL you construct.  The URL should also be set up to request JSON data from the API.  You may also want to set other API query parameters in your URL, as well, such as `units`, which controls the units of temperature, etc. returned by the API.  The documentation for the 5-day forecast API describes all the API query parameters you can set in the URL.

  3. Set up a Volley request that fetches forecast data from the OpenWeather API using a URL generated above.  You should set up success and error callbacks for your request that do the following things:
      * Display a `ProgressBar` while data is being fetched and hide the progress bar when fetching is complete.
      * Display an error message if you were unable to successfully fetch data for some reason.
      * If data is successfully fetched, display it in the main activity's `RecyclerView`-based list (more on this in the next couple items).

  4. Use [Moshi](https://github.com/square/moshi/) to parse the JSON data returned by the OpenWeather API.  At a minimum, your app should extract (at a minimum) the following data for each entry in the returned JSON data:
      * The date/time.
      * The low temperature.
      * The high temperature.
      * The probability of precipitation.
      * The short textual description of the weather.

      The documentation for the 5-day forecast API [describes all the fields and the structure of the JSON response](https://openweathermap.org/forecast5#JSON).  Note that the structure of the JSON response is somewhat complex, and the fields containing the data listed above are at different levels and in different locations in the JSON response.  To be able to successfully parse out those fields, you'll likely need to set up a hierarchy of nested Kotlin classes to use in conjunction with Moshi.  It may be helpful to implement a [custom Moshi type adapter](https://github.com/square/moshi/#custom-type-adapters) to give you a class that's a little easier to work with.

  5. Send your parsed forecast data into the `ForecastAdapter`, so it is displayed in the main activity's `RecyclerView`-based list.  Depending on how you set up your parsing, you may need to make modifications to the `RecyclerView` framework to correctly display the new data.  For example, you may need to modify the layout representing one item in the `RecyclerView` list.  Other changes may be needed as well.

  6. Trigger an API request to fetch forecast data from your main activity class's `onCreate()` method, so forecast data is fetched the app starts.  Don't forget to set up the correct permissions to be able to make network calls from your app.

## 2. Use an Intent to start a new activity

Once you have your app hooked up to the OpenWeather API, change the app's behavior so that clicks on items in the `RecyclerView` list no longer display a Snackbar but instead navigate to a new activity that allows the user to view a "detailed" view of that forecast item.  To do this, you'll have to accomplish the following things:

  1. Create a new activity to represent the detailed view of the forecast item.  The layout for this activity should have elements to display all of the data fields associated with the forecast item.  The new activity should be an "empty" activity, i.e. a subclass of `AppCompatActivity` like our main activity.  Don't forget to make sure the new activity is correctly listed in `AndroidManifest.xml`.

  2. Once your new activity is created modify the click listener for the individual items in the `RecyclerView`-based list to create a new explicit `Intent` that launches the new activity you just created.  Add the data object representing the clicked forecast item into the `Intent` as an extra so the new activity will have access to the data it needs to display the "detailed" view of that forecast item.

  3. Make sure your new activity is set up to grab the forecast data out of the `Intent` that launched it and to display that data.

## 3. Add some implicit intents

Finally, add the following features using implicit intents:

  1. Add an action to the action bar of the main activity that allows the user to see in a map the location for which the forecast is displayed.

  2. Add an action to the action bar of the "detailed" forecast activity that allows the user to share the "detailed" forecast text.  Your action should launch the Android Sharesheet to allow the user to select an app with which to share the forecast text.

## Submission

As usual, we'll be using GitHub Classroom for this assignment, and you will submit your assignment via GitHub.  Make sure your completed files are committed and pushed by the assignment's deadline to the master branch of the GitHub repo that was created for you by GitHub Classroom.  A good way to check whether your files are safely submitted is to look at the master branch your assignment repo on the github.com website (i.e. https://github.com/osu-cs492-w22/assignment-2-YourGitHubUsername/). If your changes show up there, you can consider your files submitted.

## Grading criteria

This assignment is worth 100 total points, broken down as follows:

  * 50 points: The app fetches and displays data from the OpenWeather API in the main activity's `RecyclerView`-based list

  * 30 points: The app uses an explicit intent to start a "detailed" forecast activity whenever the user clicks on an item in the forecast list

  * 20 points: The app uses implicit intents to launch other activities:
      * 10 points: The app includes an action in the main activity's action bar to allow the user to see the forecast location in a map
      * 10 points: The app includes an action in the "detailed" forecast activity's action bar to allow the user to share the text of the "detailed" forecast
