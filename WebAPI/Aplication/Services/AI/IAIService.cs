namespace Application.Services.AI
{
    public interface IAIService
    {


        public Task<List<string>> GenerateSearchQueriesAsync(string userRequest, string formattedAddress, string nearbyPlacesInfo, List<string> hashtags);
        public Task<bool> IsSpecifiedQueryAsync(string query);
        

    }
}
