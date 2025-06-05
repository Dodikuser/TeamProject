namespace Entities
{
    public class Config
    {
        public Config() { }

        //appsettings.{Environment}.json
        public string DBServerVersion { get; set; }
        public string? OllamaUrl { get; set; }
        public int? OllamaPort { get; set; }
        public string? OllamaModelName { get; set; }
        public bool UseOllama { get; set; }


        //secrets
        public string DeepSeekKey { get; set; }
        public string GoogleMapsKey { get; set; }
        public string BDConnectionString { get; set; }
        public string SQLiteConnectionString { get; set; }


        //appsettings.json
        public string MainPrompt { get; set; }
        public string SearchTypePrompt { get; set; }

        public List<string> ExcludedTypes { get; set; }
        public List<string> IncludedTypes1 { get; set; }
        public List<string> IncludedTypes2 { get; set; }
        public List<string> IncludedTypes3 { get; set; }
        public List<string> IncludedTypes4 { get; set; }
        public List<string> IncludedTypes5 { get; set; }

        public SmtpSettings SmtpSettings { get; set; }

        public PayPalOptions PayPalOptions { get; set; }
        public Dictionary<string, decimal> TokensPerCurrency { get; set; } = new();

        public int SearchPrice { get; set; }
        public int RegistrationBonus { get; set; }
    }
}
