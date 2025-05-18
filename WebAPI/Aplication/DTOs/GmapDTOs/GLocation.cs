using Newtonsoft.Json;

namespace Application.DTOs.GmapDTOs
{
    public class GLocation
    {
        [JsonProperty("lat")]
        public double Lat { get; set; }

        [JsonProperty("lng")]
        public double Lng { get; set; }
    }



    //TO-DO
    //сделать запрос с фильтрами: текст, радиус, категории
    //получить координаты по гмапс айди
    //получить всю инфу про место по айди
}
