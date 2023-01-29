package com.example.android.roomyweather.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.RecyclerView
import com.example.android.roomyweather.R
import com.example.android.roomyweather.data.CityRepo

class BookmarkedAdapter(private val onCityRepoClick: (CityRepo) -> Unit)
    : RecyclerView.Adapter<BookmarkedAdapter.CityRepoViewHolder>() {

    var cityRepoList = listOf<CityRepo>()

    fun updateRepoList(newRepoList: List<CityRepo>?) {
        cityRepoList = newRepoList ?: listOf()
        notifyDataSetChanged()
    }

    override fun getItemCount() = cityRepoList.size

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CityRepoViewHolder {
        val itemView = LayoutInflater.from(parent.context)
            .inflate(R.layout.bookmarked_list_item, parent, false)
        return CityRepoViewHolder(itemView, onCityRepoClick)
    }

    override fun onBindViewHolder(holder: CityRepoViewHolder, position: Int) {
        holder.bind(cityRepoList[position])
    }

    class CityRepoViewHolder(itemView: View, val onClick: (CityRepo) -> Unit)
        : RecyclerView.ViewHolder(itemView) {
        private val nameTV: TextView = itemView.findViewById(R.id.tv_name)
        private var currentCityRepo: CityRepo? = null

        init {
            itemView.setOnClickListener {
                currentCityRepo?.let(onClick)
            }
        }

        fun bind(city: CityRepo) {
            currentCityRepo = city
            nameTV.text = "City-Name"
        }
    }
}