using AutoMapper;
using Dating.API.Data;
using Dating.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Dating.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    public class PhotosController : Controller
    {
        private readonly IDatingRepository repo;
        private readonly IMapper mapper;
        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> CloudinaryConfig)
        {
            this.mapper = mapper;
            this.repo = repo;

        }
    }
}