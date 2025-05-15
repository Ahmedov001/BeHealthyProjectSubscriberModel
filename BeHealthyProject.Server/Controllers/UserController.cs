using BeHealthyProject.BusinessLayer.Abstract;
using BeHealthyProject.BusinessLayer.Concrete;
using BeHealthyProject.Entities;
using BeHealthyProject.Entities.Dtos;
using BeHealthyProject.Server.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

		public UserController(UserManager<BaseUser> userManager, IDietitianService dietitianService, ISubscribeService subscribeService)
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
		public Task<List<ShowDietitianDto>> GetDietitians()
		{
			var dietitians = _dietitianService.GetDietitians();
			return dietitians;
		}

		[HttpPost("subscribe")]
		public async Task<ActionResult> Subscribe([FromBody] string dietitianId, string plan)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null)
			{
				return NotFound("User not found!");
			}

			if (string.IsNullOrEmpty(dietitianId))
			{
				return BadRequest("DietitianId is required.");
			}

			await _subscribeService.Subscribe(dietitianId, userId, plan);
			return Ok("Subscribe successful");
		}

		//[HttpGet("get-subscribed-dietitians")]
		//public async Task<ActionResult<List<string>>> GetSubscribedDietitians()
		//{
		//	var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
		//	if (userId == null)
		//	{
		//		return NotFound("User not found!");
		//	}

		//	var subscribedDietitians = await _subscribeService.GetSubscribedDietitians(userId);
		//	return subscribedDietitians;
		//}



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

	}
}