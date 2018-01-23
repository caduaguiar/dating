using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Dating.API.Data;
using Dating.API.Dtos;
using Dating.API.Helpers;
using Dating.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Dating.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    public class PhotosController : Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this._cloudinaryConfig = cloudinaryConfig;
            this._mapper = mapper;
            this._repo = repo;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret);

            _cloudinary = new Cloudinary(acc);

        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);

            var photo = _mapper.Map<PhotoFromReturnDto>(photoFromRepo);

            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, PhotoForCreationDto photoDto)
        {
            var user = await _repo.GetUser(userId);

            if (user == null)
                return BadRequest("Could not find user");

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (currentUserId != userId)
                return Unauthorized();

            var file = photoDto.File;

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoDto.Url = uploadResult.Uri.ToString();
            photoDto.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoDto);
            photo.User = user;

            if (!user.Photos.Any(p => p.IsMain))
                photo.IsMain = true;

            user.Photos.Add(photo);

            if (await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoFromReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoToReturn);
            }



            return BadRequest("Cloud not add photo");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {

            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);
            if (photoFromRepo == null)
                return NotFound();

            if (photoFromRepo.IsMain)
                return BadRequest("This photo already main");

            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);
            if (currentMainPhoto != null)
                currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;
            if (await _repo.SaveAll())
                return NoContent();

            return BadRequest("Cloud not set this photo as main photo");

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {

            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);
            if (photoFromRepo == null)
                return NotFound();

            if (photoFromRepo.IsMain)
                return BadRequest("You cannot delete the main photo");

            if (photoFromRepo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);

                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result.Equals("ok"))
                    _repo.Delete(photoFromRepo);
            }

            if (photoFromRepo.PublicId == null)
                _repo.Delete(photoFromRepo);


            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to delete the photo");
        }
    }
}
