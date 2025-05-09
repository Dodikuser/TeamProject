namespace WebAPI.Services.AI
{
    public interface IAIService
    {
        Task<string> GenerateTextAsync(string prompt);
    }
}
