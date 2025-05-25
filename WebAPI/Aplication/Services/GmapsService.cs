using Application.DTOs.GmapDTOs;
using Entities;
using Entities.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Globalization;
using System.Net.Http;
using System.Text;

namespace Application.Services
{
    public class GmapsService
    {
        private readonly string _apiKey;
        private readonly HttpClient _httpClient;
        private readonly Config _config;

        public GmapsService(HttpClient httpClient, Config config)
        {
            _httpClient = httpClient;
            _config = config;

            _apiKey = _config.GoogleMapsKey;

        }

        public async Task<List<string>> SearchTextAsync(string textQuery, double radius = 0, double latitude = 0, double longitude = 0, int maxResults = 1)
        {
            Console.WriteLine($"[SearchTextAsync] Запрос: {textQuery}, Radius: {radius}, Lat: {latitude}, Lng: {longitude}");

            var url = "https://places.googleapis.com/v1/places:searchText";

            var requestData = new Dictionary<string, object>
            {
                ["textQuery"] = textQuery,
                ["maxResultCount"] = maxResults
            };

            if (radius > 0)
            {
                // Используем прямоугольник
                var (northWestLat, northWestLon, southEastLat, southEastLon) = GetSquareBounds(latitude, longitude, radius / 1000.0);


                var minLat = Math.Min(southEastLat, northWestLat);
                var maxLat = Math.Max(southEastLat, northWestLat);
                var minLon = Math.Min(northWestLon, southEastLon);
                var maxLon = Math.Max(northWestLon, southEastLon);

                requestData["locationRestriction"] = new
                {
                    rectangle = new
                    {
                        low = new
                        {
                            latitude = minLat,
                            longitude = minLon
                        },
                        high = new
                        {
                            latitude = maxLat,
                            longitude = maxLon
                        }
                    }
                };

                Console.WriteLine($"[SearchTextAsync] Rectangle bounds: LOW(lat: {southEastLat}, lon: {northWestLon}), HIGH(lat: {northWestLat}, lon: {southEastLon})");
            }

            var jsonRequest = JsonConvert.SerializeObject(requestData);
            Console.WriteLine($"[SearchTextAsync] JSON запроса: {jsonRequest}");

            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(jsonRequest, Encoding.UTF8, "application/json")
            };

            AddHeaders(request, "places.id");

            var response = await _httpClient.SendAsync(request);
            Console.WriteLine($"[SearchTextAsync] HTTP статус: {response.StatusCode}");

            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"[SearchTextAsync] Ответ JSON: {json}");

            var parsed = JObject.Parse(json);
            var ids = parsed["places"]?.Select(p => (string?)p["id"])
                                      .Where(id => !string.IsNullOrEmpty(id))
                                      .ToList();

            Console.WriteLine($"[SearchTextAsync] Найдено ID: {(ids != null ? string.Join(", ", ids) : "0")}");

            return ids ?? new List<string>();
        }

        public async Task<List<GSearchNearbyResult>> SearchNearbyAsync(
            double latitude,
            double longitude,
            double radius,
            List<string> includedTypes,
            List<string> excludedTypes,
            int maxResults = 10)
        {
            Console.WriteLine($"[SearchNearbyAsync] Lat: {latitude}, Lng: {longitude}, Radius: {radius}, Included: {string.Join(",", includedTypes)}, Excluded: {string.Join(",", excludedTypes)}");

            var url = "https://places.googleapis.com/v1/places:searchNearby";
            var requestBody = new
            {
                rankPreference = "POPULARITY",
                includedTypes,
                excludedTypes,
                maxResultCount = maxResults,
                locationRestriction = new
                {
                    circle = new
                    {
                        center = new { latitude, longitude },
                        radius
                    }
                }
            };

            var jsonRequest = JsonConvert.SerializeObject(requestBody);
            Console.WriteLine($"[SearchNearbyAsync] JSON запроса: {jsonRequest}");

            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(jsonRequest, Encoding.UTF8, "application/json")
            };

            AddHeaders(request, "places.displayName,places.rating,places.types");

            var response = await _httpClient.SendAsync(request);
            Console.WriteLine($"[SearchNearbyAsync] HTTP статус: {response.StatusCode}");

            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"[SearchNearbyAsync] Ответ JSON: {json}");

            var parsed = JObject.Parse(json);
            var places = parsed["places"]?
                .Select(p => new GSearchNearbyResult
                {
                    Name = p["displayName"]?["text"]?.ToString() ?? "Unknown",
                    Rating = p["rating"]?.Value<double?>(),
                    Type = p["types"]?.FirstOrDefault()?.ToString() ?? "unknown"
                })
                .Where(p => !string.IsNullOrWhiteSpace(p.Name) && !string.IsNullOrWhiteSpace(p.Type))
                .ToList();

            Console.WriteLine($"[SearchNearbyAsync] Найдено мест: {places?.Count ?? 0}");

            return places ?? new List<GSearchNearbyResult>();
        }




        /// <exception cref="HttpRequestException">If status code from map API is not Success code</exception>
        /// <exception cref="Exception">If status code != OK</exception>
        public async Task<GPlaceDetailsResult> GetPlaceDetailsAsync(string placeId)
        {
            var fields = "name,formatted_address,geometry,formatted_phone_number,opening_hours,rating,editorial_summary,website,photos,price_level";
            var url = $"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&fields={fields}&key={_apiKey}";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            GPlaceDetailsResponse? result = JsonConvert.DeserializeObject<GPlaceDetailsResponse>(json);

            if (result != null)
            {
                if (result.Status != "OK")
                    throw new Exception($"Error from Google Places API: {result.Status}");

                return result.Result;
            }
            throw new Exception($"http response is not valid");
        }


        //тут может быть 
        public async Task<string> ReverseGeocodingAsync(double latitude, double longitude)
        {
            var url = $"https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude.ToString(CultureInfo.InvariantCulture)},{longitude.ToString(CultureInfo.InvariantCulture)}&location_type=RANGE_INTERPOLATED&result_type=street_address&key={_apiKey}";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            var jsonObj = JObject.Parse(json);

            var compoundCode = jsonObj["plus_code"]?["compound_code"]?.ToString();

            if (string.IsNullOrEmpty(compoundCode))
                throw new Exception("compound_code not found");

            return compoundCode;
        }



        private void AddHeaders(HttpRequestMessage request, string fieldMask)
        {
            request.Headers.Add("X-Goog-Api-Key", _apiKey);
            request.Headers.Add("X-Goog-FieldMask", fieldMask);
        }



        private static (double northWestLat, double northWestLon, double southEastLat, double southEastLon)
        GetSquareBounds(double latitude, double longitude, double halfSideKm)
        {
            // 1° широты ≈ 111 км (постоянно)
            double deltaLat = halfSideKm / 111.0;

            // 1° долготы ≈ 111 км * cos(широта)
            double deltaLon = halfSideKm / (111.0 * Math.Cos(DegreesToRadians(latitude)));

            // Северо-западный угол (верхний левый)
            double northWestLat = Math.Round(latitude + deltaLat, 6);
            double northWestLon = Math.Round(longitude - deltaLon, 6);

            // Юго-восточный угол (нижний правый)
            double southEastLat = Math.Round(latitude - deltaLat, 6);
            double southEastLon = Math.Round(longitude + deltaLon, 6);

            return (northWestLat, northWestLon, southEastLat, southEastLon);
        }

        private static double DegreesToRadians(double degrees)
        {
            return degrees * Math.PI / 180.0;
        }
    }
}