using BeHealthyProject.BusinessLayer.Abstract;
using BeHealthyProject.Entities;
using BeHealthyProject.Entities.Dtos;
using BeHealthyProject.Server.Data;
using BeHealthyProject.Server.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BeHealthyProject.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	//[Authorize(Roles ="Dietitian")]
	public class DietitianController : ControllerBase
	{
		private readonly UserManager<BaseUser> _userManager;
		private readonly BeHealthyDbContext _context;
		private readonly ISubscribeService _subscribeService;

		public DietitianController(UserManager<BaseUser> userManager, BeHealthyDbContext context, ISubscribeService subscribeService)
		{
			_userManager = userManager;
			_context = context;
			_subscribeService = subscribeService;
		}

		[HttpPut("update-profile")]
		public async Task<ActionResult> UpdateProfile([FromBody] CompleteDietitianProfileDto dto)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (string.IsNullOrEmpty(userId))
			{
				return Unauthorized("Invalid token.");
			}

			var baseUser = await _userManager.FindByIdAsync(userId);
			var user = baseUser as Dietitian;

			if (user == null)
			{
				return NotFound("User not found!");
			}

			if (dto.Experience != null && dto.Specialization != null && dto.Certifications != null)
			{

				user.Experience = dto.Experience;
				user.Specialization = dto.Specialization;
				user.Certifications = dto.Certifications;
				user.Price = dto.Price;

			}


			var result = await _userManager.UpdateAsync(user);

			if (result.Succeeded)
			{
				user.IsCompleteProfile = true;
				user.Status = 0;
				await _userManager.UpdateAsync(user);
				return Ok(new
				{
					message = "Profile updated successfully!",
					status = user.Status,
					isComplete = user.IsCompleteProfile,
					hasProgram = user.HasProgram
				});
			}
			else
			{
				return BadRequest(new { message = "Failed to update profile", errors = result.Errors });
			}

		}

		[HttpPost("create-diet-program")]
		public async Task<IActionResult> CreateDietProgram([FromBody] CreateDietProgramDto dto)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (string.IsNullOrEmpty(userId))
			{
				return Unauthorized("Invalid token.");
			}

			var baseUser = await _userManager.FindByIdAsync(userId);
			var user = baseUser as Dietitian;

			if (user == null)
			{
				return NotFound("User not found!");
			}

			if (dto == null)
			{
				return BadRequest("Diet Program Data is null.");
			}

			var dietProgram = new DietProgram
			{
				Id = Guid.NewGuid().ToString(),
				Goal = dto.Goal,
				DietitianId = user.Id,
				Meals = dto.Meals.Select(m => new Meal
				{
					Id = Guid.NewGuid().ToString(),
					MealType = m.MealType,
					Items = m.Items.Select(i => new MealItem
					{
						Id = Guid.NewGuid().ToString(),
						Name = i.Name,
						Quantity = i.Quantity,
						Unit = i.Unit
					}).ToList()
				}).ToList()
			};

			if (dietProgram.Meals == null || !dietProgram.Meals.Any())
			{
				return BadRequest("Meals data is invalid.");
			}

			_context.DietPrograms.Add(dietProgram);
			user.HasProgram = true;

			await _context.SaveChangesAsync();

			await _userManager.UpdateAsync(user);

			return Ok(new
			{
				message = "Diet program created successfully",
				hasProgram = user.HasProgram
			});
		}


		[HttpGet("get-profile")]
		public async Task<ActionResult> GetProfileData()
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null)
			{
				return NotFound("User not found!");
			}
			var baseUser = await _userManager.FindByIdAsync(userId);
			var user = baseUser as Dietitian;
			if (user == null) { return NotFound(); }
			return Ok(new ShowDietitianDto { Specialization = user.Specialization, Experience = user.Experience, Certifications = user.Certifications, Nickname = user.Nickname, Username = user.UserName, isComplete = user.IsCompleteProfile, Price = user.Price, hasProgram = user.HasProgram, Status = user.Status });
		}

		[HttpGet("get-subscribed-users")]
		public async Task<ActionResult> GetSubscribedUsers()
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null)
				return Unauthorized("User not found.");

			var takenUsers = await _subscribeService.GetSubscribers(userId);

			var users = _userManager.Users
			   .OfType<User>()
			   .Where(a=> takenUsers.Contains(a.Id))
			   .Select(d => new ShowUserDto
			   {
				   Id = d.Id,
				   Username = d.UserName,
				   Nickname = d.Nickname,
				   Email = d.Email,
				   Age = d.Age,
				   Height = d.Height,
				   Weight = d.Weight
			   })
			   .ToList();

			return Ok(users);

		}

        
        [HttpPost("upload-certificates")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadCertificates([FromForm] List<IFormFile> files)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var dietitian = await _context.Dietitians
                .FirstOrDefaultAsync(d => d.Id == userId);

            if (dietitian == null) return NotFound();

            var uploadFolder = Path.Combine("wwwroot", "certificates", userId);
            Directory.CreateDirectory(uploadFolder);

            var uploadedPaths = new List<string>();

            foreach (var file in files)
            {
                var uniqueName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadFolder, uniqueName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var relativePath = $"/certificates/{userId}/{uniqueName}";
                uploadedPaths.Add(relativePath);

                _context.DietitianCertificates.Add(new DietitianCertificate
                {
                    DietitianId = userId,
                    FilePath = relativePath
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Certificates uploaded successfully", paths = uploadedPaths });
        }


    }
}
