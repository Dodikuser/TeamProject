using Newtonsoft.Json;

namespace Application.DTOs.GmapDTOs
{
    public class GPlaceDetailsResponse
    {
        [JsonProperty("result")]
        public GPlaceDetailsResult Result { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
    }



    //TO-DO
    //сделать запрос с фильтрами: текст, радиус, категории
    //получить координаты по гмапс айди
    //получить всю инфу про место по айди
}
