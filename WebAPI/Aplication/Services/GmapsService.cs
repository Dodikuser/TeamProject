using Entities;
using Entities.Models;
using Newtonsoft.Json;

namespace Application.Services
{
    public class GmapsService
    {
        private readonly string _googleMapsKey;
        private readonly HttpClient _httpClient;
        public GmapsService(Config config)
        {
            //_googleMapsKey = config.GoogleMapsKey;
            _googleMapsKey = "AIzaSyCUsLj0t6zzykl9q2CgjBCU-sXxyJnuv5s";
            _httpClient = new HttpClient();
        }

        public int tralalelotralala()
        {
            throw new NotImplementedException();
        }
        public int crocodildopenisini()
        {
            throw new NotImplementedException();
        }


        public async Task<PlaceDetailsResult> GetPlaceDetailsAsync(string placeId)
        {
            var fields = "name,formatted_address,geometry,formatted_phone_number,opening_hours,rating,editorial_summary,website,photos,price_level";
            var url = $"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&fields={fields}&key={_googleMapsKey}";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PlaceDetailsResponse>(json);

            if (result.Status == "OK")
            {
                return result.Result;
            }

            throw new Exception($"Error from Google Places API: {result.Status}");
        }
    }


    public class PlaceDetailsResponse
    {
        [JsonProperty("result")]
        public PlaceDetailsResult Result { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
    }

    public class PlaceDetailsResult
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("formatted_address")]
        public string Address { get; set; }

        [JsonProperty("geometry")]
        public Geometry Geometry { get; set; }

        [JsonProperty("formatted_phone_number")]
        public string PhoneNumber { get; set; }

        [JsonProperty("opening_hours")]
        public OpeningHours OpeningHours { get; set; }

        [JsonProperty("rating")]
        public double? Rating { get; set; }

        [JsonProperty("editorial_summary")]
        public EditorialSummary EditorialSummary { get; set; }

        [JsonProperty("website")]
        public string Website { get; set; }

        [JsonProperty("photos")]
        public List<Photo> Photos { get; set; }

        [JsonProperty("price_level")]
        public int? PriceLevel { get; set; }

    }
    public class Photo
    {
        [JsonProperty("photo_reference")]
        public string PhotoReference { get; set; }

        [JsonProperty("height")]
        public int Height { get; set; }

        [JsonProperty("width")]
        public int Width { get; set; }

        [JsonProperty("html_attributions")]
        public List<string> HtmlAttributions { get; set; }

        public string GetPhotoUrl(string apiKey)
        {
            return $"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference={PhotoReference}&key={apiKey}";
        }
    }
    public class Geometry
    {
        [JsonProperty("location")]
        public Location Location { get; set; }
    }

    public class Location
    {
        [JsonProperty("lat")]
        public double Lat { get; set; }

        [JsonProperty("lng")]
        public double Lng { get; set; }
    }

    public class OpeningHours
    {
        [JsonProperty("open_now")]
        public bool? OpenNow { get; set; }

        [JsonProperty("weekday_text")]
        public List<string> WeekdayText { get; set; }
    }

    public class EditorialSummary
    {
        [JsonProperty("overview")]
        public string Overview { get; set; }
    }



    //TO-DO
    //сделать запрос с фильтрами: текст, радиус, категории
    //получить координаты по гмапс айди
    //получить всю инфу про место по айди
}
