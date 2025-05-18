using Application.DTOs;
using Application.DTOs.GmapDTOs;

namespace Application
{
    public static class PlaceTypesConverter
    {
        public static GPlaceDetailsResult ToPlaceDetailsResult(this PlaceDTO argument)
        {

            GPlaceDetailsResult result = new GPlaceDetailsResult()
            {
                Name = argument.Name,
                Address = argument.Address,

                Geometry = new GGeometry()
                {
                    Location = new GLocation()
                    {
                        Lat = argument.Latitude,
                        Lng = argument.Longitude
                    }
                },

                PhoneNumber = argument.PhoneNumber,

                OpeningHours = new GOpeningHours()
                {
                    OpenNow = argument.IsOpen,
                    WeekdayText = argument.OpeningHours.Select(x => x.ToString()).ToList()!
                },

                Rating = 0,

                EditorialSummary = new GEditorialSummary()
                {
                    Overview = argument.Description != null ? argument.Description : ""
                },

                Website = argument.Site != null ? argument.Site : "",

                //todo конвертировать класс для фоток

                PriceLevel = null
            };
            return result;
        }
        public static PlaceDTO ToPlace(this GPlaceDetailsResult argument)
        {
            PlaceDTO result = new PlaceDTO()
            {
                Name = argument.Name,
                Address = argument.Address,
                Description = argument.EditorialSummary.Overview,
                Site = argument.Website,
                PhoneNumber = argument.PhoneNumber,
                //todo
                //Email = argument.e
                Longitude = argument.Geometry.Location.Lng,
                Latitude = argument.Geometry.Location.Lat,
                Radius = null,
                TokensAvailable = null,
                LastPromotionDateTime = null,
                IsOpen = argument.OpeningHours.OpenNow,
                //todo convert List<string> to List<OpeningHours>
                //OpeningHours = argument.OpeningHours.WeekdayText,
            };
            return result;
        }
    }
}
