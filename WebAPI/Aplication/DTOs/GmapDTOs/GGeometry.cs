using Newtonsoft.Json;

namespace Application.DTOs.GmapDTOs
{
    public class GGeometry
    {
        [JsonProperty("location")]
        public GLocation Location { get; set; }
    }



    //TO-DO
    //сделать запрос с фильтрами: текст, радиус, категории
    //получить координаты по гмапс айди
    //получить всю инфу про место по айди
}
