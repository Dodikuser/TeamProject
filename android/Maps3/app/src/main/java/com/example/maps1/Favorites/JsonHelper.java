package com.example.maps1.Favorites;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JsonHelper {

    /**
     * Безопасно получает JSONArray из объекта, учитывая .NET сериализацию с $values
     */
    public static JSONArray getArraySafely(JSONObject jsonObject, String key) throws JSONException {
        if (!jsonObject.has(key)) {
            throw new JSONException("Key '" + key + "' not found in JSON");
        }

        Object value = jsonObject.get(key);

        // Если это уже массив
        if (value instanceof JSONArray) {
            return (JSONArray) value;
        }

        // Если это объект с $values (структура .NET)
        if (value instanceof JSONObject) {
            JSONObject obj = (JSONObject) value;
            if (obj.has("$values")) {
                return obj.getJSONArray("$values");
            }
        }

        throw new JSONException("Value for key '" + key + "' is not an array or object with $values");
    }

    /**
     * Безопасно получает строку из JSON объекта
     */
    public static String getStringSafely(JSONObject jsonObject, String key, String defaultValue) {
        try {
            if (jsonObject.has(key) && !jsonObject.isNull(key)) {
                return jsonObject.getString(key);
            }
        } catch (JSONException e) {
            // Ignore and return default
        }
        return defaultValue;
    }

    /**
     * Безопасно получает double из JSON объекта
     */
    public static double getDoubleSafely(JSONObject jsonObject, String key, double defaultValue) {
        try {
            if (jsonObject.has(key) && !jsonObject.isNull(key)) {
                return jsonObject.getDouble(key);
            }
        } catch (JSONException e) {
            // Ignore and return default
        }
        return defaultValue;
    }

    /**
     * Безопасно получает JSONObject из JSON объекта
     */
    public static JSONObject getObjectSafely(JSONObject jsonObject, String key) {
        try {
            if (jsonObject.has(key) && !jsonObject.isNull(key)) {
                return jsonObject.getJSONObject(key);
            }
        } catch (JSONException e) {
            // Ignore and return null
        }
        return null;
    }
}