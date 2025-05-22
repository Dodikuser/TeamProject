using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Infrastructure.Repository;
using Entities.Models;
using Application.DTOs;
using Application.DTOs.GmapDTOs;
using Entities;
using Entities.Enums;

namespace Application.Services
{
    public class HistoryService
    {
        private readonly HistoryRepository _historyRepository;
        private readonly SearchesRepository _searchesRepository;

        public HistoryService(HistoryRepository historyRepository, SearchesRepository searchesRepository) 
        {
            _historyRepository = historyRepository;
            _searchesRepository = searchesRepository;
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

        public async Task<SearchOperationResult> SearchAction(ulong UserId, SearchDTO searchDTO, HistoryActionEnum action)
        {
            switch (action)
            {
                case HistoryActionEnum.Add:
                    await _searchesRepository.AddAsync(UserId, searchDTO.Text);
                    return SearchOperationResult.Success;
                case HistoryActionEnum.Remove:
                    if (searchDTO.SearchDateTime == null) 
                        return SearchOperationResult.NullSearchDateTime;

                    ulong? searchId = await _searchesRepository.GetSearchIdByTextAndDateAsync(searchDTO.Text, (DateTime)searchDTO.SearchDateTime);
                    if (searchId == null)
                        return SearchOperationResult.CannotFind;

                    await _searchesRepository.RemoveAsync((ulong)searchId);
                    return SearchOperationResult.Success;
                case HistoryActionEnum.Clear:
                    await _searchesRepository.RemoveAllAsync(UserId);
                    return SearchOperationResult.Success;
            }

            return SearchOperationResult.NotFound;
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
    }
}
