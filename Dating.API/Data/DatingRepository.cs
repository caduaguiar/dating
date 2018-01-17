using System.Collections.Generic;
using System.Threading.Tasks;
using Dating.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Dating.API.Data {
    public class DatingRepository : IDatingRepository {
        private readonly DataContext _context;

        public DatingRepository (DataContext context) {
            _context = context;

        }

        public Task<Photo> GetPhoto(int id)
        {
            var photo = _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        void IDatingRepository.Add<T> (T entity) {
            _context.Add (entity);
        }

        void IDatingRepository.Delete<T> (T entity) {
            _context.Remove (entity);
        }

        async Task<User> IDatingRepository.GetUser (int id) {
            var user = await _context.Users.Include (p => p.Photos).FirstOrDefaultAsync (x => x.Id == id);
            return user;
        }

        async Task<IEnumerable<User>> IDatingRepository.GetUsers () {
            var users = await _context.Users.Include (p => p.Photos).ToListAsync ();
            return users;
        }

        async Task<bool> IDatingRepository.SaveAll () {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}