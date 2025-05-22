using Application.DTOs;
using Application.Services;
using Entities.Enums;
using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/history/places")]
    public class HistoryPlacesController : ControllerBase
    {

        private readonly HistoryService _historyService;
        public HistoryPlacesController(HistoryService historyService)
        {
            _historyService = historyService;
        }

        [Authorize]
        [HttpPost("get")]
        public async Task<IActionResult> GetHistory(int skip = 0, int take = 10)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            List<HistoryPlaceResponseDTO> histoires = await _historyService.GetPlaceHistory(userId, skip, take);

            return Ok(new { histoires });
        }

        [Authorize]
        [HttpPost("search")]
        public async Task<IActionResult> Search(string keyword, int skip = 0, int take = 10)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            List<HistoryPlaceResponseDTO> histoires = await _historyService.SearchPlaceHistory(userId, keyword, skip, take);

            return Ok(new { histoires });
        }

        [Authorize]
        [HttpPost("action")]
        public async Task<IActionResult> HistoryAction(HistoryActionEnum historyAction, HistoryPlaceRequestDTO placeHistoryDTO)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);

            HistoryOperationResult result = await _historyService.HistoryAction(userId, placeHistoryDTO, historyAction);

            if (result != HistoryOperationResult.Success)
                return BadRequest(result.ToString());
            return Ok(result.ToString());
        }
    }

}
