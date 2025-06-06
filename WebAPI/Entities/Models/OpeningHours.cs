using Entities.Interfaces;

namespace Entities.Models
{
    public class OpeningHours : IDbEntity
    {
        public ulong Id { get; set; }
        public TimeOnly Open { get; set; }
        public TimeOnly Close { get; set; }
public DayOfWeek DayOfWeek { get; set; }

        public override string ToString()
        {//todo глянуть как в оригинале выглядит строка времени работы прилетая от гугл карт и сделать так же
            return Open.ToString("HH:mm") + " - " + Close.ToString("HH:mm");
        }
    }
}
