using Application.DTOs;
using Application.DTOs.GmapDTOs;
using Entities.Models;

namespace Application
{
    public static class PlaceTypesConverter
    {
        //этот метод юзлес
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
                    //OpenNow = argument.IsOpen,
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
        //этот тоже
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
                //IsOpen = argument.OpeningHours.OpenNow,

                //todo convert List<string> to List<OpeningHours>
                OpeningHours = argument.OpeningHours != null ? ParseOpeningHours(argument.OpeningHours.WeekdayText) : new List<OpeningHours>(),
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
                //IsOpen = place.IsOpen,
                OpeningHours = place.OpeningHours,
                GmapsPlaceId = place.GmapsPlaceId,
                UserId = (int?)place.UserId,
                Stars = place.Stars,
                Photos = place.Photos.Select(photo => new PhotoDTO
                {
                    Path = photo.Path,
                    PlaceId = photo.PlaceId,
                    Id = photo.Id,
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
                OpeningHours = place.OpeningHours,
                Photo = place.Photos.Any()
                ? place.Photos.Select(photo => new PhotoDTO
                {
                    Path = photo.Path,
                    PlaceId = photo.PlaceId,
                    Id = photo.Id,
                }).First()
                : null,

            };
        }

        public static async Task<Place> ConvertFromGPlaceAsync(
            this GPlaceDetailsResult gPlace,
            string gmapsPlaceId,
            string googleApiKey,
            Aplication.Services.PhotoDownloadService photoDownloadService)
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
                GmapsPlaceId = gmapsPlaceId,
                Stars = gPlace.Rating ?? 0,
                OpeningHours = ParseOpeningHours(gPlace.OpeningHours?.WeekdayText),
                Photos = new List<Photo>(),
                Reviews = new List<Review>(),
                Histories = new List<History>(),
                Favorites = new List<Favorite>(),
                AdHashtags = new List<AdHashtag>()
            };

            if (gPlace.Photos != null)
            {
                foreach (var gPhoto in gPlace.Photos.Slice(0, 1))
                {
                    var photoUrl = gPhoto.GetPhotoUrl(googleApiKey);
                    var photo = await photoDownloadService.DownloadAndSavePhotoAsync(photoUrl, place.Id, photoUrl);
                    place.Photos.Add(photo);
                }
            }

            return place;
        }

         private static ICollection<OpeningHours> ParseOpeningHours(List<string>? weekdayText)
 {
     if (weekdayText == null)
         return new List<OpeningHours>();

     var result = new List<OpeningHours>();
     var daysOfWeek = new[]
     {
         DayOfWeek.Monday,
         DayOfWeek.Tuesday,
         DayOfWeek.Wednesday,
         DayOfWeek.Thursday,
         DayOfWeek.Friday,
         DayOfWeek.Saturday,
         DayOfWeek.Sunday
     };

     for (int i = 0; i < weekdayText.Count && i < daysOfWeek.Length; i++)
     {
         var entry = weekdayText[i];
         var parts = entry.Split(": ", 2);
         if (parts.Length != 2) continue;
         var day = daysOfWeek[i];
         var timesStr = parts[1].Trim();

         if (timesStr.Equals("Closed", StringComparison.OrdinalIgnoreCase))
             continue;
         if (timesStr.Equals("Open 24 hours", StringComparison.OrdinalIgnoreCase))
         {
             result.Add(new OpeningHours
             {
                 DayOfWeek = day,
                 Open = new TimeOnly(0, 0),
                 Close = new TimeOnly(23, 59)
             });
             continue;
         }
         var intervals = timesStr.Split(", ");
         foreach (var interval in intervals)
         {
             var times = interval.Split("–");
             if (times.Length != 2) continue;
             if (TryParseTime(times[0], out var open) && TryParseTime(times[1], out var close))
             {
                 result.Add(new OpeningHours
                 {
                     DayOfWeek = day,
                     Open = open,
                     Close = close
                 });
             }
         }
     }
     return result;
 }

 private static bool TryParseTime(string input, out TimeOnly time)
 {
     input = input.Replace(" ", "").Trim();
     // Пробуем 12- и 24-часовые форматы
     if (TimeOnly.TryParseExact(input, new[] { "h:mmtt", "hh:mmtt", "h:mm tt", "hh:mm tt", "HH:mm", "H:mm" },
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
