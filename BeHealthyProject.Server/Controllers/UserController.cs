using BeHealthyProject.BusinessLayer.Abstract;
using BeHealthyProject.BusinessLayer.Hubs;
using BeHealthyProject.Entities;
using BeHealthyProject.Entities.Dtos;
using BeHealthyProject.Server.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BeHealthyProject.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize(Roles = "User")]
	public class UserController : ControllerBase
	{
		private readonly UserManager<BaseUser> _userManager;
		private readonly IDietitianService _dietitianService;
		private readonly ISubscribeService _subscribeService;

		public UserController(UserManager<BaseUser> userManager, IDietitianService dietitianService, ISubscribeService subscribeService, IHubContext<NotificationHub> hubContext)
		{
			_userManager = userManager;
			_dietitianService = dietitianService;
			_subscribeService = subscribeService;
		}



		[HttpPut("update-profile")]
		public async Task<ActionResult> UpdateProfile([FromBody] UpdateUserProfileDto dto)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (string.IsNullOrEmpty(userId))
			{
				return Unauthorized("Invalid token.");
			}

			var baseUser = await _userManager.FindByIdAsync(userId);
			var user = baseUser as User;

			if (user == null)
			{
				return NotFound("User not found!");
			}

			if (dto.Height != null || dto.Height != 0 && dto.Age != null || dto.Age != 0 && dto.Weight != null || dto.Weight != 0)
			{
				user.Height = dto.Height;
				user.Weight = dto.Weight;
				user.Age = dto.Age;

			}


			var result = await _userManager.UpdateAsync(user);

			if (result.Succeeded)
			{
				user.IsCompleteProfile = true;
				await _userManager.UpdateAsync(user);
				return Ok(new { message = "Profile updated successfully!" });
			}
			else
			{
				return BadRequest(new { message = "Failed to update profile", errors = result.Errors });
			}

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
			var user = baseUser as User;
			if (user == null) { return NotFound(); }
			return Ok(new UpdateUserProfileDto { Age = user.Age, Height = user.Height, Weight = user.Weight, IsCompleteProfile = user.IsCompleteProfile, Nickname = user.Nickname, Username = user.UserName, Balance = user.Balance });
		}

		[HttpGet("get-dietitians")]
		public async Task<List<ShowDietitianDto>> GetDietitians()
		{
			var dietitians = await _dietitianService.GetDietitians();
			return dietitians;
		}

        [HttpPost("subscribe")]
        public async Task<ActionResult> Subscribe([FromBody] SubscribeRequestDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId) as User;
            if (user == null) return NotFound("User not found.");

            var dietitian = await _userManager.Users
                .OfType<Dietitian>()
                .FirstOrDefaultAsync(d => d.Id == dto.DietitianId);
            if (dietitian == null) return NotFound("Dietitian not found.");

            var price = dietitian.Price ?? 0;

            if (user.Balance < price)
                return BadRequest("Insufficient balance.");

            var (success, message) = await _subscribeService.Subscribe(userId, dto.DietitianId, dto.Plan);
            if (!success) return BadRequest(message);

            user.Balance -= price;
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                return StatusCode(500, "Could not update user balance.");

            return Ok(new { Message = "Subscribed successfully.", NewBalance = user.Balance });
        }



        [HttpPost("unsubscribe")]
		public async Task<IActionResult> Unsubscribe([FromBody] UnsubscribeRequestDto request)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null)
				return Unauthorized("User not found.");

			try
			{
				var result = await _subscribeService.Unsubscribe(request.DietitianId, userId);
				return Ok(result);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}

		[HttpGet("get-subscribed-dietitians")]
		public async Task<ActionResult> GetSubscribedDietitians()
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null)
				return Unauthorized("User not found.");

			var dietitianIds = await _subscribeService.GetSubscribedDietitians(userId);

			var dietitians = await _userManager.Users
	   .OfType<Dietitian>() 
	   .Where(d => dietitianIds.Contains(d.Id))
	   .Select(d => new SubscribedDietitianDto
	   {
		   Id = d.Id,
		   Username = d.UserName,
		   Nickname = d.Nickname
	   })
	   .ToListAsync();

			return Ok(dietitians);

		}

        [HttpGet("get-profile-dietitian")]
        public async Task<ActionResult> GetProfileDataDietitian()
        {
            var dietitians = await _userManager.Users
        .OfType<Dietitian>()
        .Where(d => d.Status == DietitianStatus.Accepted)
        .Select(d => new ShowDietitianDto
        {
            Id = d.Id,
            Username = d.UserName,
            Nickname = d.Nickname,
            Experience = d.Experience,
            Certifications = d.Certifications,
            Specialization = d.Specialization,
            Price = d.Price ?? 0
        })
        .ToListAsync();

            return Ok(dietitians);
        }


        [HttpGet("check-availability")]
		[AllowAnonymous]
		public async Task<ActionResult> CheckAvailability(string? email, string? nickname)
		{
			if (string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(nickname))
				return BadRequest("At least email or nickname must be provided.");

			bool emailAvailable = true;
			bool nicknameAvailable = true;

			if (!string.IsNullOrWhiteSpace(email))
			{
				var emailExists = await _userManager.FindByEmailAsync(email);
				if (emailExists != null)
					emailAvailable = false;
			}

			if (!string.IsNullOrWhiteSpace(nickname))
			{
				var nicknameExists = _userManager.Users.OfType<User>().Any(u => u.Nickname == nickname);
				if (nicknameExists)
					nicknameAvailable = false;
			}

			return Ok(new { emailAvailable, nicknameAvailable });
		}

		[HttpPost("add-balance")]
		public async Task<IActionResult> AddBalance([FromBody] AddBalanceDto dto)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null) return Unauthorized("Invalid token.");

			var user = await _userManager.FindByIdAsync(userId) as User;
			if (user == null) return NotFound("User not found.");

			user.Balance += dto.Amount;
			var result = await _userManager.UpdateAsync(user);

			if (!result.Succeeded)
				return BadRequest(result.Errors);

			return Ok(new { message = "Balance added successfully!" });
		}

        [HttpGet("get-user-balance")]
        public async Task<ActionResult<double>> GetUserBalance()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId) as User;
            if (user == null) return NotFound();

            return Ok(user.Balance);
        }

        [HttpGet("my-diet-programs")]
        public async Task<IActionResult> GetSubscribedDietPrograms()
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var programs = await _subscribeService.GetSubscribedDietProgramsAsync(userId);
            return Ok(programs);
        }


    }
}