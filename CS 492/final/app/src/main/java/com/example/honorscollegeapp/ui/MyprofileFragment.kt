package com.example.honorscollegeapp.ui

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.View
import android.widget.Button
import android.widget.ImageView
import android.widget.Toast
import androidx.core.content.FileProvider
import androidx.fragment.app.Fragment
import com.example.honorscollegeapp.BuildConfig
import com.example.honorscollegeapp.R
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*

/* Taking photo within app
* https://kotlincodes.com/kotlin/camera-intent-with-kotlin-android/
* https://stackoverflow.com/questions/56598480/couldnt-find-meta-data-for-provider-with-authority
* */
class MyprofileFragment : Fragment(R.layout.page_myprofile) {
    val REQUEST_IMAGE_CAPTURE = 1
    private val PERMISSION_REQUEST_CODE: Int = 101
    private var mCurrentPhotoPath: String? = null;
    lateinit var imageView: ImageView
    lateinit var captureButton: Button

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        super.onCreate(savedInstanceState)
        imageView = view.findViewById(R.id.image_view)
        captureButton = view.findViewById(R.id.btn_capture)
        if(mCurrentPhotoPath != null){
            var bitmap: Bitmap = BitmapFactory.decodeFile(mCurrentPhotoPath)
            imageView.setImageBitmap(bitmap)
        }
        captureButton.setOnClickListener(View.OnClickListener {
            takePicture()
        })
    }
    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        when (requestCode) {
            PERMISSION_REQUEST_CODE -> {

                if ((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)
                    && grantResults[1] == PackageManager.PERMISSION_GRANTED) {

                    takePicture()

                } else {
                    Toast.makeText(requireContext(), "Permission Denied", Toast.LENGTH_SHORT).show()
                }
                return
            }

            else -> {

            }
        }
    }

    private fun takePicture() {
        val file_prefix = "profile_photo"
        val file_suffix = ".jpg"
        val intent: Intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        val file: File = createFile(file_prefix, file_suffix)

        val uri = FileProvider.getUriForFile(
            Objects.requireNonNull(requireContext()),
            BuildConfig.APPLICATION_ID + ".provider", file);


        intent.putExtra(MediaStore.EXTRA_OUTPUT, uri)
        startActivityForResult(intent, REQUEST_IMAGE_CAPTURE)

    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == Activity.RESULT_OK) {

            //To get the File for further usage
            val auxFile = File(mCurrentPhotoPath)


            var bitmap: Bitmap = BitmapFactory.decodeFile(mCurrentPhotoPath)
            imageView.setImageBitmap(bitmap)

        }
    }

//    private fun checkPersmission(): Boolean {
//        return (ContextCompat.checkSelfPermission(this, android.Manifest.permission.CAMERA) ==
//                PackageManager.PERMISSION_GRANTED && ContextCompat.checkSelfPermission(this,
//            android.Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED)
//    }
//
//    private fun requestPermission() {
//        ActivityCompat.requestPermissions(this, arrayOf(READ_EXTERNAL_STORAGE, CAMERA), PERMISSION_REQUEST_CODE)
//    }

    @Throws(IOException::class)
    private fun createFile(filename: String, suffix: String): File {
        // Create an image file name
        val storageDir: File? = requireContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile(
            filename, /* prefix */
            suffix, /* suffix */
            storageDir /* directory */
        ).apply {
            // Save a file: path for use with ACTION_VIEW intents
            mCurrentPhotoPath = absolutePath
        }
    }

}