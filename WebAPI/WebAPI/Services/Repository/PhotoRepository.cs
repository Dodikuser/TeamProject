using WebAPI.EF;

namespace WebAPI.Services.Repository
{
    public class PhotoRepository
    {
        private readonly MyDbContext _context;

        public PhotoRepository(MyDbContext context)
        {
            _context = context;
        }

        public async AddPhoto()
        {

        }

        //добавить фото
        //удалить фото
        //получить фото 

    }
}
