using Infrastructure.Repository;
using Entities.Models;
using Application.DTOs;
using Entities;
using Entities.Enums;

namespace Application.Services
{
    public class HistoryService
    {
        private readonly HistoryRepository _historyRepository;
        private readonly SearchesRepository _searchesRepository;
        private readonly PlaceRepository _placeRepository;

        public HistoryService(HistoryRepository historyRepository, SearchesRepository searchesRepository, PlaceRepository placeRepository)
        {
            _historyRepository = historyRepository;
            _searchesRepository = searchesRepository;
            _placeRepository = placeRepository;
        }

        public async Task<List<SearchDTO>> GetSearchHistory(ulong userId, int skip = 0, int take = 10)
        {
            List<Search> searches = await _searchesRepository.GetSearchesPagedAsync(userId, skip, take);

            return searches.Select(s => SearchToDTO(s)).ToList();
        }

        public async Task<List<SearchDTO>> SearchSearchHistory(ulong userId, string keyword, int skip = 0, int take = 10)
        {
            List<Search> searches = await _searchesRepository.SearchByKeywordForUserAsync(userId, keyword, skip, take);

            return searches.Select(s => SearchToDTO(s)).ToList();
        }

        public async Task<HistoryOperationResult> SearchAction(ulong UserId, SearchDTO searchDTO, HistoryActionEnum action)
        {
            switch (action)
            {
                case HistoryActionEnum.Add:
                    await _searchesRepository.AddAsync(UserId, searchDTO.Text);
                    return HistoryOperationResult.Success;
                case HistoryActionEnum.Remove:
                    if (searchDTO.SearchDateTime == null)
                        return HistoryOperationResult.NullSearchDateTime;

                    ulong? searchId = await _searchesRepository.GetSearchIdByTextAndDateAsync(searchDTO.Text, (DateTime)searchDTO.SearchDateTime);
                    if (searchId == null)
                        return HistoryOperationResult.NotFound;

                    await _searchesRepository.RemoveAsync((ulong)searchId);
                    return HistoryOperationResult.Success;
                case HistoryActionEnum.Clear:
                    await _searchesRepository.RemoveAllAsync(UserId);
                    return HistoryOperationResult.Success;
            }

            return HistoryOperationResult.NotFound;
        }

        public async Task<List<HistoryPlaceResponseDTO>> GetPlaceHistory(ulong userId, int skip = 0, int take = 10)
        {
            List<History> histories = await _historyRepository.GetHistoryPagedAsync(userId, skip, take);

            return histories.Select(h => ToHistoryPlaceResponseDTO(h)).ToList();
        }

        public async Task<List<HistoryPlaceResponseDTO>> SearchPlaceHistory(ulong userId, string keyword, int skip = 0, int take = 10)
        {
            List<History> histories = await _historyRepository.SearchUserHistoryByKeywordAsync(userId, keyword, skip, take);

            return histories.Select(h => ToHistoryPlaceResponseDTO(h)).ToList();
        }

        public async Task<HistoryOperationResult> HistoryAction(ulong UserId, HistoryPlaceRequestDTO historyDTO, HistoryActionEnum action)
        {
            switch (action)
            {
                case HistoryActionEnum.Add:
                    if (!await _placeRepository.ExistsAsync(historyDTO.GmapsPlaceId))
                        return HistoryOperationResult.NotFound;

                    ulong id = (ulong)await _placeRepository.GetIdByGmapsPlaceIdAsync(historyDTO.GmapsPlaceId);
                    await _historyRepository.AddAsync(UserId, id, historyDTO.IsFromRecs ?? false);
                    return HistoryOperationResult.Success;

                case HistoryActionEnum.Remove:
                    if (historyDTO.VisitDateTime == null)
                        return HistoryOperationResult.NullSearchDateTime;

                    if (!await _placeRepository.ExistsAsync(historyDTO.GmapsPlaceId))
                        return HistoryOperationResult.NotFound;

                    ulong? historyId = await _historyRepository.GetHistoryIdByVisitDateAndGmapsPlaceIdAsync((DateTime)historyDTO.VisitDateTime, historyDTO.GmapsPlaceId);
                    if (historyId == null)
                        return HistoryOperationResult.NotFound;

                    await _historyRepository.RemoveAsync((ulong)historyId);
                    return HistoryOperationResult.Success;

                case HistoryActionEnum.Clear:
                    await _historyRepository.RemoveAllAsync(UserId);
                    return HistoryOperationResult.Success;
            }

            return HistoryOperationResult.NotFound;
        }

        public static SearchDTO SearchToDTO(Search search)
        {
            return new SearchDTO
            {
                Text = search.Text,
                SearchDateTime = search.SearchDateTime,
                UserId = search.UserId
            };
        }
        public static HistoryPlaceResponseDTO ToHistoryPlaceResponseDTO(History history)
        {
            if (history == null)
                throw new ArgumentNullException(nameof(history));
            if (history.Place == null)
                throw new ArgumentNullException(nameof(history.Place));

            var mainPhoto = history.Place.Photos?.FirstOrDefault();

            return new HistoryPlaceResponseDTO
            {
                VisitDateTime = history.VisitDateTime,
                GmapsPlaceId = history.Place.GmapsPlaceId,
                placeDTO = new PlaceDTODefaultCard
                {
                    Name = history.Place.Name,
                    Longitude = history.Place.Longitude,
                    Latitude = history.Place.Latitude,
                    Radius = history.Place.Radius,
                    GmapsPlaceId = history.Place.GmapsPlaceId,
                    Stars = history.Place.Reviews?.Any() == true
                                ? (int)Math.Round(history.Place.Reviews.Average(r => r.Stars))
                                : 0,
                    Photo = mainPhoto != null
                                ? new PhotoDTO
                                {
                                    Path = mainPhoto.Path,
                                    PlaceId = mainPhoto.PlaceId
                                }
                                : new PhotoDTO
                                {
                                    Path = string.Empty,
                                    PlaceId = history.Place.Id
                                }
                }
            };
        }



    }
}
