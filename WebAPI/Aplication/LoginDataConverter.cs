using System.Text.Json;
using System.Text.Json.Serialization;


namespace Application
{
    public class LoginDataConverter : JsonConverter<LoginData>
    {
        public override LoginData? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            using var jsonDoc = JsonDocument.ParseValue(ref reader);
            var root = jsonDoc.RootElement;

            if (!root.TryGetProperty("type", out var typeProperty))
                return null;

            var type = typeProperty.GetString();

            return type switch
            {
                "standard" => JsonSerializer.Deserialize<StandardLoginData>(root.GetRawText(), options),
                "google" => JsonSerializer.Deserialize<GoogleLoginData>(root.GetRawText(), options),
                "facebook" => JsonSerializer.Deserialize<FacebookLoginData>(root.GetRawText(), options),
                _ => null
            };
        }


        public override void Write(Utf8JsonWriter writer, LoginData value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize(writer, (object)value, value.GetType(), options);
        }
    }

}
