using Entities;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Json;

namespace Application.Services.AI
{
    public class DeepSeekService : IAIService
    {
        private readonly HttpClient _httpClient;
        private readonly Config _config;

        public DeepSeekService(HttpClient httpClient, IOptions<Config> config)
        {
            _httpClient = httpClient;
            _config = config.Value;
        }

        public async Task<string> GenerateTextAsync(string prompt)
        {
            var requestData = new
            {
                model = "deepseek-chat",
                messages = new[]
                {
                    new { role = "user", content = prompt }
                },
                max_tokens = 1000
            };

            var response = await _httpClient.PostAsJsonAsync("/v1/chat/completions", requestData);

            // Обрабатываем 204 как пустой ответ
            if (response.StatusCode == HttpStatusCode.NoContent)
            {
                return string.Empty;
            }

            // Проверяем другие ошибки
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"API request failed: {response.StatusCode}. {errorContent}");
            }

            // Читаем контент только если он есть
            var content = await response.Content.ReadAsStringAsync();

            if (string.IsNullOrEmpty(content))
            {
                return string.Empty;
            }

            try
            {
                var result = JsonConvert.DeserializeObject<DeepSeekResponse>(content);
                return result?.Response ?? string.Empty;
            }
            catch (JsonException ex)
            {
                throw new InvalidOperationException("Failed to parse API response", ex);
            }
        }

        // Обновленная модель ответа
        private class DeepSeekResponse
        {
            [JsonProperty("choices")]
            public List<Choice> Choices { get; set; }

            public string Response => Choices?.FirstOrDefault()?.Message?.Content ?? string.Empty;
        }

        private class Choice
        {
            [JsonProperty("message")]
            public Message Message { get; set; }
        }

        private class Message
        {
            [JsonProperty("content")]
            public string Content { get; set; }
        }
    }
}