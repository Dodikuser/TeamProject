using Application.DTOs;
using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Services;
using System.Threading.Tasks;
using Entities.Enums;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/history/requests")]
    public class HistoryRequestsController : ControllerBase
    {
        private readonly HistoryService _historyService;
        public HistoryRequestsController(HistoryService historyService)
        {
            _historyService = historyService;
        }

        [Authorize]
        [HttpPost("get")]
        public async Task<IActionResult> GetHistory(int skip = 0, int take = 10)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            List<SearchDTO> searches = await _historyService.GetSearchHistory(userId, skip, take);
            return Ok(new { searches });
        }

        [Authorize]
        [HttpPost("search")]
        public async Task<IActionResult> Search(string keyword, int skip = 0, int take = 10)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            List<SearchDTO> searches = await _historyService.SearchSearchHistory(userId, keyword, skip, take);

            return Ok(new { searches });
        }

        [Authorize]
        [HttpPost("action")]
        public async Task<IActionResult> HistoryAction(HistoryActionEnum historyAction, SearchDTO searchDTO)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);

            SearchOperationResult result = await _historyService.SearchAction(userId, searchDTO, historyAction);

            if (result != SearchOperationResult.Success)
                return BadRequest(result.ToString());
            return Ok(result.ToString());
        }
    }

}
