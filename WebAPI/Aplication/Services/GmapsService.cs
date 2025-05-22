using Application.DTOs.GmapDTOs;
using Entities;
using Newtonsoft.Json;

namespace Application.Services
{
    public class GmapsService
    {
        private readonly string _googleMapsKey;
        private readonly HttpClient _httpClient;
        public GmapsService(Config config)
        {
            _googleMapsKey = config.GoogleMapsKey;
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

        /// <exception cref="HttpRequestException">If status code from map API is not Success code</exception>
        /// <exception cref="Exception">If status code != OK</exception>
        public async Task<GPlaceDetailsResult> GetPlaceDetailsAsync(string placeId)
        {
            var fields = "name,formatted_address,geometry,formatted_phone_number,opening_hours,rating,editorial_summary,website,photos,price_level";
            var url = $"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&fields={fields}&key={_googleMapsKey}";

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
    }



    //TO-DO
    //сделать запрос с фильтрами: текст, радиус, категории
    //получить координаты по гмапс айди
    //получить всю инфу про место по айди
}
