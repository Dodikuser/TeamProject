package com.example.maps1.recommendations;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.chip.Chip;
import com.example.maps1.R;
import java.util.List;

public class CategoryAdapter extends RecyclerView.Adapter<CategoryAdapter.CategoryViewHolder> {

    public interface OnCategoryClickListener {
        void onCategoryClick(String category);
    }

    private List<String> categories;
    private OnCategoryClickListener listener;
    private int selectedPosition = 0; // First category selected by default

    public CategoryAdapter(List<String> categories, OnCategoryClickListener listener) {
        this.categories = categories;
        this.listener = listener;
    }

    @NonNull
    @Override
    public CategoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_category, parent, false);
        return new CategoryViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CategoryViewHolder holder, int position) {
        String category = categories.get(position);
        holder.chip.setText(category);

        // Устанавливаем состояние выбранности
        holder.chip.setChecked(position == selectedPosition);

        // Можно также изменить стиль в зависимости от выбранности
        if (position == selectedPosition) {
            holder.chip.setChipBackgroundColorResource(R.color.chip_selected_color);
        } else {
            holder.chip.setChipBackgroundColorResource(R.color.chip_default_color);
        }

        holder.chip.setOnClickListener(v -> {
            int currentPosition = holder.getAdapterPosition();
            if (currentPosition == RecyclerView.NO_POSITION) return;

            int oldPosition = selectedPosition;
            selectedPosition = currentPosition;

            // Обновляем только затронутые элементы
            notifyItemChanged(oldPosition);
            notifyItemChanged(selectedPosition);

            // Вызываем колбэк
            if (listener != null) {
                listener.onCategoryClick(categories.get(currentPosition));
            }
        });
    }

    @Override
    public int getItemCount() {
        return categories != null ? categories.size() : 0;
    }

    public void setSelectedCategory(String category) {
        if (categories == null) return;

        int index = categories.indexOf(category);
        if (index != -1 && index != selectedPosition) {
            int oldPosition = selectedPosition;
            selectedPosition = index;
            notifyItemChanged(oldPosition);
            notifyItemChanged(selectedPosition);
        }
    }

    static class CategoryViewHolder extends RecyclerView.ViewHolder {
        Chip chip;

        public CategoryViewHolder(@NonNull View itemView) {
            super(itemView);
            // Ищем Chip внутри макета, а не приводим весь itemView к Chip
            chip = itemView.findViewById(R.id.chip_category);

            // Если chip не найден, проверяем, может быть itemView сам является Chip
            if (chip == null && itemView instanceof Chip) {
                chip = (Chip) itemView;
            }
        }
    }
}