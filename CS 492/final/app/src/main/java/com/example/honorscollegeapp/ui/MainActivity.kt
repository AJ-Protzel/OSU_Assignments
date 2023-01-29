package com.example.honorscollegeapp.ui

import android.Manifest.permission.CAMERA
import android.Manifest.permission.READ_EXTERNAL_STORAGE
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.View
import android.widget.Button
import android.widget.ImageView
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import com.example.honorscollegeapp.BuildConfig
import com.example.honorscollegeapp.R
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import androidx.navigation.findNavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationView
import java.util.*

/* Taking photo within app
* https://kotlincodes.com/kotlin/camera-intent-with-kotlin-android/
* https://stackoverflow.com/questions/56598480/couldnt-find-meta-data-for-provider-with-authority
* */
class MainActivity : AppCompatActivity() {
    private val PERMISSION_REQUEST_CODE: Int = 101
    lateinit var appBarConfiguration: AppBarConfiguration

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        if (!checkPersmission()) requestPermission()

        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)

        val navHostFragment: NavHostFragment =
            supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        val navController = navHostFragment.navController
        val drawerLayout: DrawerLayout = findViewById(R.id.drawer_layout)
        appBarConfiguration = AppBarConfiguration(navController.graph, drawerLayout)
        setupActionBarWithNavController(navController, appBarConfiguration)

        findViewById<NavigationView>(R.id.nav_top_view).setupWithNavController(navController)
        findViewById<BottomNavigationView>(R.id.nav_bottom_view).setupWithNavController(navController)

//        findViewById<BottomNavigationView>(R.id.nav_register_view).setupWithNavController(navController)

//        findViewById<BottomNavigationView>(R.id.nav_home_view).setupWithNavController(navController)

//        val bottomNavigationView = findViewById<BottomNavigationView>(R.id.nav_bottom_view)
//        bottomNavigationView.setupWithNavController(navController)
//
//        val registerNavigationView = findViewById<BottomNavigationView>(R.id.nav_register_view)
//        registerNavigationView.setupWithNavController(navController)
//
//        val homeNavigationView = findViewById<BottomNavigationView>(R.id.nav_home_view)
//        homeNavigationView.setupWithNavController(navController)
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()

    }
    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        when (requestCode) {
            PERMISSION_REQUEST_CODE -> {

                if ((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)
                    && grantResults[1] == PackageManager.PERMISSION_GRANTED) {


                } else {
                    Toast.makeText(this, "Permission Denied", Toast.LENGTH_SHORT).show()
                }
                return
            }
        }
    }

    private fun checkPersmission(): Boolean {
        return (ContextCompat.checkSelfPermission(this, android.Manifest.permission.CAMERA) ==
                PackageManager.PERMISSION_GRANTED && ContextCompat.checkSelfPermission(this,
            android.Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED)
    }

    private fun requestPermission() {
        ActivityCompat.requestPermissions(this, arrayOf(READ_EXTERNAL_STORAGE, CAMERA), PERMISSION_REQUEST_CODE)
    }
}