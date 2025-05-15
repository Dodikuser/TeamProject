namespace Application.Services.AI
{
    public interface IAIService
    {
        Task<string> GenerateTextAsync(string prompt);
    }
}
