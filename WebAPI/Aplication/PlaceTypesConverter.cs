using Application.DTOs;
using Application.DTOs.GmapDTOs;
using Entities.Models;

namespace Application
{
    public static class PlaceTypesConverter
    {

        public static GPlaceDetailsResult ToPlaceDetailsResult(this PlaceDTOFull argument)
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
        public static PlaceDTOFull ToPlace(this GPlaceDetailsResult argument)
        {
            PlaceDTOFull result = new PlaceDTOFull()
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
        public static PlaceDTOFull ToDTOFull(this Place place)
        {
            if (place == null) throw new ArgumentNullException(nameof(place));

            return new PlaceDTOFull
            {
                Name = place.Name,
                Description = place.Description,
                Address = place.Address,
                Site = place.Site,
                PhoneNumber = place.PhoneNumber,
                Email = place.Email,
                Longitude = place.Longitude,
                Latitude = place.Latitude,
                Radius = place.Radius,
                TokensAvailable = place.TokensAvailable,
                LastPromotionDateTime = place.LastPromotionDateTime,
                IsOpen = place.IsOpen,
                OpeningHours = place.OpeningHours, 
                GmapsPlaceId = place.GmapsPlaceId,
                UserId = (int?)place.UserId, 
                Stars = place.Stars,
                Photos = place.Photos.Select(photo => new PhotoDTO
                {
                    Path = photo.Path,
                    PlaceId = photo.PlaceId
                }).ToList()
            };
        }
        public static PlaceDTODefaultCard ToDTODefault(this Place place)
        {
            if (place == null) throw new ArgumentNullException(nameof(place));

            return new PlaceDTODefaultCard
            {
                Name = place.Name,
                Address = place.Address,
                Longitude = place.Longitude,
                Latitude = place.Latitude,
                GmapsPlaceId = place.GmapsPlaceId,
                Stars = place.Stars,
                Photo = place.Photos.Select(photo => new PhotoDTO
                {
                    Path = photo.Path,
                    PlaceId = photo.PlaceId
                }).First(),
            };
        }

        public static Place ConvertFromGPlace(GPlaceDetailsResult gPlace, string gmapsPlaceId, string googleApiKey)
        {
            var place = new Place
            {
                Name = gPlace.Name,
                Address = gPlace.Address,
                Latitude = gPlace.Geometry?.Location?.Lat ?? 0,
                Longitude = gPlace.Geometry?.Location?.Lng ?? 0,
                PhoneNumber = gPlace.PhoneNumber,
                Site = gPlace.Website,
                Description = gPlace.EditorialSummary?.Overview,
                IsOpen = gPlace.OpeningHours?.OpenNow,
                GmapsPlaceId = gmapsPlaceId,
                Stars = gPlace.Rating ?? 0,

                OpeningHours = ParseOpeningHours(gPlace.OpeningHours?.WeekdayText),

                Photos = gPlace.Photos?.Select(p => new Photo
                {
                    Path = p.GetPhotoUrl(googleApiKey),
                }).ToList() ?? new List<Photo>(),

                Reviews = new List<Review>(),
                Histories = new List<History>(),
                Favorites = new List<Favorite>(),
                AdHashtags = new List<AdHashtag>()
            };

            return place;
        }

        private static ICollection<OpeningHours> ParseOpeningHours(List<string>? weekdayText)
        {
            if (weekdayText == null)
                return new List<OpeningHours>();

            var result = new List<OpeningHours>();

            foreach (var entry in weekdayText)
            {
                var parts = entry.Split(": ", 2);
                if (parts.Length != 2) continue;

                var times = parts[1].Split(" – ");
                if (times.Length != 2) continue;

                if (TryParseTime(times[0], out var open) && TryParseTime(times[1], out var close))
                {
                    result.Add(new OpeningHours
                    {
                        Open = open,
                        Close = close
                    });
                }
            }

            return result;
        }

        private static bool TryParseTime(string input, out TimeOnly time)
        {
            input = input.Replace(" ", "").Trim();

            if (TimeOnly.TryParseExact(input, new[] { "h:mmtt", "hh:mmtt", "h:mm tt", "hh:mm tt" },
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out time))
            {
                return true;
            }

            if (TimeOnly.TryParse(input, out time))
            {
                return true;
            }

            time = default;
            return false;
        }

    }
}
