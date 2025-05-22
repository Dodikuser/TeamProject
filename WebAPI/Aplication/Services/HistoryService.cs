using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Infrastructure.Repository;
using Entities.Models;
using Application.DTOs;

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
