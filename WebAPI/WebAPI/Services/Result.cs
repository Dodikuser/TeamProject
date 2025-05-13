namespace WebAPI.Services
{
    public class Result
    {
        public bool Success { get; set; }
        public string? Error { get; set; }

        public static Result Ok() => new() { Success = true };
        public static Result Fail(string error) => new() { Success = false, Error = error };
    }
}
