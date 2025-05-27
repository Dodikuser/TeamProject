using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Application.Services.Email
{
    public class EmailTemplateService
    {

        public async Task<string> GetConfirmationEmailBodyAsync(string code)
        {
            var path = Path.Combine(AppContext.BaseDirectory, "EmailTemplates", "ConfirmationTemplate.html");

            var html = await File.ReadAllTextAsync(path);
            return html.Replace("{{CODE}}", code);
        }
    }

}
