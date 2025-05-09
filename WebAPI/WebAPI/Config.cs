namespace WebAPI
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


        //appsettings.json

    }
}
