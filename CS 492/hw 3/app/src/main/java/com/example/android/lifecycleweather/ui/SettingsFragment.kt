package com.example.android.lifecycleweather.ui

import android.os.Bundle
import androidx.preference.PreferenceFragmentCompat
import com.example.android.lifecycleweather.R

class SettingsFragment : PreferenceFragmentCompat() {
    override fun onCreatePreferences(savedInstanceState: Bundle?, rootKey: String?) {
        setPreferencesFromResource(R.xml.settings, rootKey)
    }
}