using Entities;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Json;
using System.Text;

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

        public async Task<List<string>> GenerateSearchQueriesAsync(string userRequest, string formattedAddress, string nearbyPlacesInfo, List<string> hashtags)
        {
            Console.WriteLine("[GenerateSearchQueriesAsync] Формируем запрос...");

            var allContext = new StringBuilder();
            allContext.AppendLine($"User request: {userRequest}");
            allContext.AppendLine($"Formatted address: {formattedAddress}");
            allContext.AppendLine("Nearby places:");
            allContext.AppendLine(nearbyPlacesInfo);

            if (hashtags?.Count > 0)
            {
                allContext.AppendLine("Hashtags: " + string.Join(", ", hashtags));
            }

            var fullPrompt = allContext.ToString();

            Console.WriteLine("[GenerateSearchQueriesAsync] Полный prompt:");
            Console.WriteLine(fullPrompt);

            var rawResponse = await GenerateTextAsync(fullPrompt);
            var parsed = ParseGeneratedQueries(rawResponse);

            Console.WriteLine($"[GenerateSearchQueriesAsync] Сгенерировано {parsed.Count} поисковых запросов:");
            foreach (var query in parsed)
            {
                Console.WriteLine($"  - {query}");
            }

            return parsed;
        }


        public async Task<bool> IsSpecifiedQueryAsync(string query)
        {
            Console.WriteLine($"[IsSpecifiedQueryAsync] Проверка: \"{query}\"");
            var response = await GenerateTextAsync(query, _config.SearchTypePrompt);
            var cleaned = response.Trim().ToLowerInvariant();
            Console.WriteLine($"[IsSpecifiedQueryAsync] Ответ: \"{cleaned}\"");
            return cleaned == "true";
        }


        private async Task<string> GenerateTextAsync(string userPrompt, string? systemPromptOverride = null)
        {
            var requestData = new
            {
                model = "deepseek-chat",
                messages = new[]
                {
            new { role = "system", content = systemPromptOverride ?? _config.MainPrompt },
            new { role = "user", content = userPrompt },
        },
                max_tokens = 5000,
                stream = false
            };

            var jsonRequest = JsonConvert.SerializeObject(requestData, Formatting.Indented);
            Console.WriteLine("[GenerateTextAsync] Запрос к DeepSeek:");
            Console.WriteLine(jsonRequest);

            var response = await _httpClient.PostAsJsonAsync("/v1/chat/completions", requestData);

            Console.WriteLine($"[GenerateTextAsync] HTTP статус: {response.StatusCode}");

            if (response.StatusCode == HttpStatusCode.NoContent)
            {
                Console.WriteLine("[GenerateTextAsync] Ответ пустой (204 No Content)");
                return string.Empty;
            }

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"[GenerateTextAsync] Ошибка: {errorContent}");
                throw new HttpRequestException($"API request failed: {response.StatusCode}. {errorContent}");
            }

            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine("[GenerateTextAsync] Ответ от DeepSeek:");
            Console.WriteLine(content);

            if (string.IsNullOrEmpty(content))
            {
                Console.WriteLine("[GenerateTextAsync] Ответ пустой.");
                return string.Empty;
            }

            try
            {
                var result = JsonConvert.DeserializeObject<DeepSeekResponse>(content);
                Console.WriteLine($"[GenerateTextAsync] Распарсенный ответ: {result?.Response}");
                return result?.Response ?? string.Empty;
            }
            catch (JsonException ex)
            {
                Console.WriteLine("[GenerateTextAsync] Ошибка парсинга JSON: " + ex.Message);
                throw new InvalidOperationException("Failed to parse API response", ex);
            }
        }


        private static List<string> ParseGeneratedQueries(string raw)
        {
            if (string.IsNullOrWhiteSpace(raw))
                return new List<string>();

            raw = raw.Replace("```json", "").Replace("```", "").Trim();

            raw = raw.Trim();

            var lines = raw.Split(new[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
                           .Select(l => l.Trim())
                           .Where(l => l != "[" && l != "]")
                           .ToList();

            var cleaned = lines.Select(line =>
            {
                line = line.Trim().Trim(',');
                line = line.Trim('"');
                return line.Trim();
            })
            .Where(line => !string.IsNullOrWhiteSpace(line))
            .ToList();

            return cleaned;
        }




        private string BuildUserPrompt(string userRequest, string formattedAddress, string nearbyPlacesInfo)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"User request: {userRequest}");
            sb.AppendLine($"Address: {formattedAddress}");
            sb.AppendLine("Nearby places:");
            sb.AppendLine(nearbyPlacesInfo);
            return sb.ToString();
        }

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
