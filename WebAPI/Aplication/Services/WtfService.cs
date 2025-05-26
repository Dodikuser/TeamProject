using Application.DTOs;
using Application.DTOs.GmapDTOs;
using Application.Services.AI;
using Entities;
using Entities.Models;
using Google.Apis.Upload;
using Infrastructure.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class WtfService
    {
        private IAIService _aIService;
        private Config _config;
        private GmapsService _gmapsService;
        private PlaceRepository _placeRepository;
        private HashtagRepository _hashtagRepository;

        public WtfService(IAIService aIService,  Config config, GmapsService gmapsService, PlaceRepository placeRepository, HashtagRepository hashtagRepository)
        {
            _aIService = aIService;
            _config = config;
            _gmapsService = gmapsService;
            _placeRepository = placeRepository;
            _hashtagRepository = hashtagRepository;
        }

        public async Task<AiPlaceSearchDTO> AiPlaceSearch(string text, List<ulong>? hashTagIds, int radius, double longitude, double latitude)
        {
            var hashtags = new List<string>();

            if (hashTagIds != null && hashTagIds.Any())
            {
                foreach (var id in hashTagIds)
                {
                    var tagEntity = await _hashtagRepository.FindAsync(id);
                    if (!string.IsNullOrWhiteSpace(tagEntity?.Tag))
                        hashtags.Add(tagEntity.Tag.Trim());
                }
            }

            //return await SearchNearbyWithPromptAsync(
            //    userText: text,
            //    hashtags: hashtags,
            //    radius: radius,
            //    latitude: latitude,
            //    longitude: longitude,
            //    systemPrompt: _config.MainPrompt,
            //    checkSpecifiedQuery: true);

            return await SearchNearbyWithTextAsync(
                userText: text,
                hashtags: hashtags,
                radius: radius,
                latitude: latitude,
                longitude: longitude,
                systemPrompt: _config.MainPrompt,
                rec: false);
        }

        public async Task<AiPlaceSearchDTO> AiPlaceRecommendation(ulong hashTagId, int radius, double longitude, double latitude, string Tag = "Цікаві місця")
        {
            var tagEntity = await _hashtagRepository.FindAsync(hashTagId);
            if (tagEntity == null || string.IsNullOrWhiteSpace(tagEntity.Prompt))
                throw new ArgumentException("Hashtag or prompt not found");

            var hashtags = new List<string> { tagEntity.Tag?.Trim() ?? "" };

            // При рекомендации пользовательский текст пустой
            //return await SearchNearbyWithPromptAsync(
            //    userText: "",
            //    hashtags: hashtags,
            //    radius: radius,
            //    latitude: latitude,
            //    longitude: longitude,
            //    systemPrompt: _config.MainPrompt,
            //    checkSpecifiedQuery: false);

            return await SearchNearbyWithTextAsync(
               userText: Tag,
               hashtags: hashtags,
               radius: radius,
               latitude: latitude,
               longitude: longitude,
               systemPrompt: _config.MainPrompt,
               rec: true);
        }

        private async Task<AiPlaceSearchDTO> SearchNearbyWithTextAsync(
            string userText,
            List<string> hashtags,
            int radius,
            double latitude,
            double longitude,
            string systemPrompt,
            bool rec)
        {
            var allResults = new List<GSearchNearbyMapsResult>();

            if (rec)
            {
                allResults.AddRange(await _gmapsService.SearchNearbyByTextAsync(Tags.DicTags[userText][0], latitude, longitude, radius, 50));
                allResults.AddRange(await _gmapsService.SearchNearbyByTextAsync(Tags.DicTags[userText][1], latitude, longitude, radius, 50));
                allResults.AddRange(await _gmapsService.SearchNearbyByTextAsync(Tags.DicTags[userText][2], latitude, longitude, radius, 50));
                allResults.AddRange(await _gmapsService.SearchNearbyByTextAsync(Tags.DicTags[userText][3], latitude, longitude, radius, 50));

                if(allResults.Count == 0)
                    allResults.AddRange(await _gmapsService.SearchNearbyByTextAsync(userText, latitude, longitude, radius, 50));
            }
            else
            {
                allResults.AddRange(await _gmapsService.SearchNearbyByTextAsync(userText, latitude, longitude, radius, 50));
            }

            allResults = allResults
            .GroupBy(r => r.GmapsPlaceId) 
            .Select(g => g.First())
            .ToList();


            List<string> googlePlaceIds = new List<string>();

            foreach (var query in allResults)
            {
                googlePlaceIds.Add(query.GmapsPlaceId);
            }

            return new AiPlaceSearchDTO
            {
                GooglePlaceIds = googlePlaceIds,
                IsSpecifiedQuery = false
            };

        }

        private async Task<AiPlaceSearchDTO> SearchNearbyWithPromptAsync(
            string userText,
            List<string> hashtags,
            int radius,
            double latitude,
            double longitude,
            string systemPrompt,
            bool checkSpecifiedQuery = true)
        {
            if (checkSpecifiedQuery)
            {
                bool isSpecified = await _aIService.IsSpecifiedQueryAsync(userText);
                if (isSpecified)
                {
                    var searchResult = await _gmapsService.SearchTextAsync(userText);
                    if (searchResult == null || !searchResult.Any())
                        throw new Exception("The request is a pseudo address");

                    var placeId = searchResult.First();

                    return new AiPlaceSearchDTO
                    {
                        GooglePlaceIds = new List<string> { placeId },
                        IsSpecifiedQuery = true
                    };
                }
            }

            // Абстрактный поиск поблизости
            var allResults = new List<GSearchNearbyResult>();
            allResults.AddRange(await _gmapsService.SearchNearbyAsync(latitude, longitude, radius, _config.IncludedTypes1, _config.ExcludedTypes));
            allResults.AddRange(await _gmapsService.SearchNearbyAsync(latitude, longitude, radius, _config.IncludedTypes2, _config.ExcludedTypes));
            allResults.AddRange(await _gmapsService.SearchNearbyAsync(latitude, longitude, radius, _config.IncludedTypes3, _config.ExcludedTypes));
            allResults.AddRange(await _gmapsService.SearchNearbyAsync(latitude, longitude, radius, _config.IncludedTypes4, _config.ExcludedTypes));
            //allResults.AddRange(await _gmapsService.SearchNearbyAsync(latitude, longitude, radius, _config.IncludedTypes5, _config.ExcludedTypes));

            var top50 = allResults
                .GroupBy(r => r.Name)
                .Select(g => g.First())
                .Take(50)
                .ToList();

            var sb = new StringBuilder();
            for (int i = 0; i < top50.Count; i++)
            {
                var place = top50[i];
                sb.AppendLine($"{i + 1}. {place.Name} ({place.Type}) — rating: {(place.Rating?.ToString("0.0") ?? "no")}");
            }
            string formattedPlaces = sb.ToString();
            string formattedAddress = await _gmapsService.ReverseGeocodingAsync(latitude, longitude);

            var promptInputText = string.IsNullOrEmpty(userText) ? "" : userText;

            var queries = await _aIService.GenerateSearchQueriesAsync(
                promptInputText,
                formattedAddress,
                formattedPlaces,
                hashtags);

            var googlePlaceIds = new List<string>();
            foreach (var query in queries)
            {
                var results = await _gmapsService.SearchTextAsync(query, radius, latitude, longitude);
                var firstResult = results.FirstOrDefault();
                if (firstResult != null)
                {
                    googlePlaceIds.Add(firstResult);
                }
            }

            return new AiPlaceSearchDTO
            {
                GooglePlaceIds = googlePlaceIds,
                IsSpecifiedQuery = false
            };

        }


        public async Task<List<ulong>> GetAds(ulong hashtagId, int take, double longitude, double latitude)
        {
            throw new NotImplementedException();

            //todo 😭🔫
        }


        public async Task<ulong> AddPlaceIfNotExistsAsync(string gmapsPlaceId)
        {

            if (string.IsNullOrEmpty(gmapsPlaceId)) throw new ArgumentException(nameof(gmapsPlaceId));

            var placeId = await _placeRepository.GetIdByGmapsPlaceIdAsync(gmapsPlaceId);
            if (placeId != null)
            {
                return placeId.Value;
            }

            var detailsResult = await _gmapsService.GetPlaceDetailsAsync(gmapsPlaceId);

            return await AddFullPlaceInfoAsync(detailsResult);
        }

        public async Task<ulong> AddFullPlaceInfoAsync(GPlaceDetailsResult gPlaceDetailsResult)
        {
            throw new NotImplementedException();

            //dto to place
            //dto to opening hours и связать
        }
    }
}
