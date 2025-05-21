namespace Entities
{
    public enum LoginStatus
    {
        Success = 200,
        IncorrectEmail,
        IncorrectPassword,
        UnregisteredGoogle,
        UnregisteredFacebook,
        UnknownOathProvider = 403,
        InvalidToken
    }
}
