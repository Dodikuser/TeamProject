package com.example.maps1.history;

public class SearchHistoryItem {
    private String id;
    private String query;
    private String date;
    private String time;
    private long historyId;

    public SearchHistoryItem(String id, String query, String date, String time, long historyId) {
        this.id = id;
        this.query = query;
        this.date = date;
        this.time = time;
        this.historyId = historyId;
    }

    // Getters
    public long getHistoryId() { return historyId; }
    public String getId() { return id; }
    public String getQuery() { return query; }
    public String getDate() { return date; }
    public String getTime() { return time; }

    // Комбинированная дата и время для отображения
    public String getDateTime() {
        return date + " • " + time;
    }

    // Setters (optional)
    public void setId(String id) { this.id = id; }
    public void setQuery(String query) { this.query = query; }
    public void setDate(String date) { this.date = date; }
    public void setTime(String time) { this.time = time; }
}