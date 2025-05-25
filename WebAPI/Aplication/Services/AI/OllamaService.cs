using Entities;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;

namespace Application.Services.AI
{
    public class OllamaService
    {
        private readonly HttpClient _httpClient;
        private readonly Config _config;


        public OllamaService(HttpClient httpClient, IOptions<Config> config)
        {
            _httpClient = httpClient;
            _config = config.Value;
        }

        public async Task<string> GenerateTextAsync(string prompt)
        {
            var request = new { model = _config.OllamaModelName, prompt, stream = false };
            var response = await _httpClient.PostAsJsonAsync("/api/generate", request);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<OllamaResponse>();
            return result?.Response ?? "Generating Error";
        }

        private record OllamaResponse(string Response);
    }
}
