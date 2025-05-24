using BeHealthyProject.BusinessLayer.Abstract;
using BeHealthyProject.BusinessLayer.Concrete;
using BeHealthyProject.Entities;
using BeHealthyProject.Entities.Dtos;
using BeHealthyProject.Server.Data;
using BeHealthyProject.Server.Dtos;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BeHealthyProject.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly UserManager<BaseUser> _userManager;
		private readonly RoleManager<IdentityRole> _roleManager;
		private readonly BeHealthyDbContext _beHealthyDbContext;
		private readonly IConfiguration _configuration;
		private readonly IDistributedCache _cache;
		private readonly IDietitianService _dietitianService;

		public AuthController(UserManager<BaseUser> userManager, RoleManager<IdentityRole> roleManager, BeHealthyDbContext beHealthyDbContext, IConfiguration configuration, IDistributedCache cache, IDietitianService dietitianService)
		{
			_userManager = userManager;
			_roleManager = roleManager;
			_beHealthyDbContext = beHealthyDbContext;
			_configuration = configuration;
			_cache = cache;
			_dietitianService = dietitianService;
		}


		[HttpPost("signup-user")]
		public async Task<ActionResult> SignUpAsUser([FromBody] RegisterDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest();

			var checkDbUser = await _beHealthyDbContext.Users.FirstOrDefaultAsync(u => u.UserName == dto.Username);

			if (checkDbUser != null)
			{
				return BadRequest();
			}
			var user = new User
			{
				Nickname = dto.Nickname,
				UserName = dto.Username,
				Email = dto.Email,

			};

			var result = await _userManager.CreateAsync(user, dto.Password);
			if (result.Succeeded)
			{
				if (!await _roleManager.RoleExistsAsync("User"))
				{
					await _roleManager.CreateAsync(new IdentityRole("User"));
				}
				await _userManager.AddToRoleAsync(user, "User");
				//await _beHealthyDbContext.AddAsync(user);
				await _beHealthyDbContext.SaveChangesAsync();
				return Ok(new
				{
					Status = "Success",
					Message = "User created succesfully"
				});
			}
			return BadRequest(result.Errors);
		}


		[HttpPost("signup-dietitian")]
		public async Task<ActionResult> SignUpAsDietitian([FromBody] RegisterDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest();

			var checkDbUser = await _beHealthyDbContext.Users.FirstOrDefaultAsync(u => u.UserName == dto.Username);
			if (checkDbUser != null)
			{
				return BadRequest();
			}
			var dietitian = new Dietitian
			{
				Nickname = dto.Nickname,
				UserName = dto.Username,
				Email = dto.Email,
			};
			var result = await _userManager.CreateAsync(dietitian, dto.Password);
			if (result.Succeeded)
			{
				if (!await _roleManager.RoleExistsAsync("Dietitian"))
				{
					await _roleManager.CreateAsync(new IdentityRole("Dietitian"));
				}
				await _userManager.AddToRoleAsync(dietitian, "Dietitian");
				await _beHealthyDbContext.SaveChangesAsync();

				return Ok(new
				{
					Status = "Success",
					Message = "Dietitian created succesfully"
				});
			}
			return BadRequest(result.Errors);
		}


		[HttpPost("signin-user")]
		public async Task<IActionResult> SignInForUser([FromBody] LoginDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest();

			var baseUser = await _userManager.FindByNameAsync(dto.Username);
			var user = baseUser as User;
			if (user != null && await _userManager.CheckPasswordAsync(user, dto.Password))
			{
				var userRoles = await _userManager.GetRolesAsync(user);

				var authClaims = new List<Claim>
				{
					new Claim(ClaimTypes.Name,user.UserName),
					new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
					new Claim(ClaimTypes.NameIdentifier, user.Id)
			};
				foreach (var role in userRoles)
				{
					authClaims.Add(new Claim(ClaimTypes.Role, role));
				}

				var token = GetToken(authClaims);
                var refreshToken = GenerateRefreshToken(user.Id);
                await _beHealthyDbContext.RefreshTokens.AddAsync(refreshToken);
                await _beHealthyDbContext.SaveChangesAsync();

                return Ok(new { Token = new JwtSecurityTokenHandler().WriteToken(token), Expiration = token.ValidTo, RefreshToken = refreshToken.Token, UserId = user.Id});
			}

			return Unauthorized();
		}


		[HttpPost("signin-dietitian")]
		public async Task<IActionResult> SignInForDietitian([FromBody] LoginDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest();

			var baseUser = await _userManager.FindByNameAsync(dto.Username);
			var user = baseUser as Dietitian;
			if (user != null && await _userManager.CheckPasswordAsync(user, dto.Password))
			{
				var userRoles = await _userManager.GetRolesAsync(user);


				var authClaims = new List<Claim>
				{
					new Claim(ClaimTypes.Name,user.UserName),
					new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
					new Claim(ClaimTypes.NameIdentifier, user.Id)
				};
				foreach (var role in userRoles)
				{
					authClaims.Add(new Claim(ClaimTypes.Role, role));
				}
				var token = GetToken(authClaims);
                var refreshToken = GenerateRefreshToken(user.Id);
                await _beHealthyDbContext.RefreshTokens.AddAsync(refreshToken);
                await _beHealthyDbContext.SaveChangesAsync();

                return Ok(new { Token = new JwtSecurityTokenHandler().WriteToken(token), Expiration = token.ValidTo, RefreshToken = refreshToken.Token, UserId = user.Id });
			}

			return Unauthorized();
		}

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var refreshToken = request.RefreshToken;

            var tokenInDb = await _beHealthyDbContext.RefreshTokens
                .FirstOrDefaultAsync(t => t.Token == refreshToken);

            if (tokenInDb == null || tokenInDb.IsUsed || tokenInDb.IsRevoked || tokenInDb.ExpiryDate < DateTime.UtcNow)
            {
                return BadRequest("Invalid or expired refresh token");
            }

            var user = await _userManager.FindByIdAsync(tokenInDb.UserId);
            if (user == null)
                return Unauthorized();

            var roles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.NameIdentifier, user.Id)
    };

            foreach (var role in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var newToken = GetToken(authClaims);
            var newRefreshToken = GenerateRefreshToken(user.Id);

            tokenInDb.IsUsed = true;
            tokenInDb.IsRevoked = true;

            await _beHealthyDbContext.RefreshTokens.AddAsync(newRefreshToken);
            await _beHealthyDbContext.SaveChangesAsync();

            return Ok(new
            {
                Token = new JwtSecurityTokenHandler().WriteToken(newToken),
                Expiration = newToken.ValidTo,
                RefreshToken = newRefreshToken.Token
            });
        }




        [HttpPost("forgot-password")]
		public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
		{
			if (!ModelState.IsValid)
				return BadRequest();

			if (request.Email == null)
				return NotFound();

			Random rnd = new Random();
			string resetCode = rnd.Next(100000, 999999).ToString();
			var message = new MimeMessage();
			message.From.Add(new MailboxAddress("No reply", "behealthydfit@gmail.com"));
			message.To.Add(new MailboxAddress("Dear User", request.Email));
			message.Subject = "Reset Password";
			await _cache.SetStringAsync(request.Email, resetCode, new DistributedCacheEntryOptions()
			{
				AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
			});


			message.Body = new TextPart("html")
			{
				Text = $@"
    <html>
    <body style='font-family: Arial, sans-serif; text-align: center; padding: 20px;'>
        <div style='background: #fff; padding: 20px; border-radius: 8px; 
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); display: inline-block;'>
            <h1>Password Reset Code</h1>
            <p>Use the 6-digit code below to reset your password:</p>
            <div style='font-size: 24px; font-weight: bold; color: #333; 
                        background: #e0e0e0; padding: 10px; display: inline-block; 
                        letter-spacing: 4px; border-radius: 5px;'>
                {resetCode}
            </div>
            <p style='margin-top: 20px; font-size: 14px; color: #777;'>
                This code is valid for 10 minutes. If you didn’t request a password reset, please ignore this email.
            </p>
        </div>
    </body>
    </html>"
			};

			using (var client = new SmtpClient())
			{
				try
				{
					client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
					client.Authenticate("behealthydfit@gmail.com", "fbkd ufim mbje rgmh");
					client.Send(message);
					client.Disconnect(true);
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex.Message);
				}
			}
			return Ok();


		}
		[HttpPut("reset-password")]
		public async Task<ActionResult> ResetPassword(ResetPasswordRequest request)
		{
			var user = await _userManager.FindByEmailAsync(request.Email);
			if (user == null)
				return NotFound();
			string resetCode = await _cache.GetStringAsync(request.Email);

			if (request.ResetCode == resetCode)
			{

				var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

				var result = await _userManager.ResetPasswordAsync(user, resetToken, request.NewPassword);

				if (result.Succeeded)
				{
					return Ok(new { message = "Password reset successfully!" });
				}
				else
				{
					return BadRequest(new { message = "Error resetting password", errors = result.Errors });
				}
			}

			return BadRequest(new { message = "Invalid reset code." });

		}
		private JwtSecurityToken GetToken(List<Claim> authClaims)
		{
			var authSigninKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

			var token = new JwtSecurityToken(
				issuer: _configuration["Jwt:Issuer"],
				audience: _configuration["Jwt:Audience"],
				expires: DateTime.Now.AddHours(3),
				claims: authClaims,
				signingCredentials: new SigningCredentials(authSigninKey, SecurityAlgorithms.HmacSha256)
				);

			return token;
		}

        private RefreshToken GenerateRefreshToken(string userId)
        {
            return new RefreshToken
            {
                Token = Guid.NewGuid().ToString(),
                UserId = userId,
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                IsUsed = false,
                IsRevoked = false
            };
        }


        [Authorize(Roles = "User")]
		[HttpGet("protected-user")]
		public ActionResult<string> ProtectedEndpoint()
		{
			var user = HttpContext.User;

			if (user.Identity == null || !user.Identity.IsAuthenticated)
				return Unauthorized("Invalid Token");

			var name = user.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown";
			var role = user.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";

			return Ok($"Hello {name}, you are authenticated as a {role}!");
		}

		[Authorize(Roles = "Dietitian")]
		[HttpGet("protected-dietitian")]
		public ActionResult<string> ProtectedEndpointDietitian()
		{
			var user = HttpContext.User;

			if (user.Identity == null || !user.Identity.IsAuthenticated)
				return Unauthorized("Invalid Token");

			var name = user.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown";
			var role = user.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";

			return Ok($"Hello {name}, you are authenticated as a {role}!");
		}
		[HttpGet("Dietitians")]
		public async Task<ActionResult<List<ShowDietitianDto>>> GetDietitians()
		{
			var dietitians = await _dietitianService.GetDietitians();
			return dietitians;
		}

		[HttpPost("create-admin")]
		public async Task<IActionResult> CreateAdmin()
		{
			var existing = await _userManager.FindByNameAsync("admin");
			if (existing != null)
				return BadRequest("Admin already exists.");

			var admin = new BaseUser
			{
				UserName = "admin",
				Email = "admin@admin.com"
			};

			var result = await _userManager.CreateAsync(admin, "Admin123.");

			if (!result.Succeeded)
				return BadRequest(result.Errors);

			if (!await _roleManager.RoleExistsAsync("Admin"))
				await _roleManager.CreateAsync(new IdentityRole("Admin"));

			await _userManager.AddToRoleAsync(admin, "Admin");

			return Ok("Admin created");
		}

		[HttpPost("signin-admin")]
		public async Task<IActionResult> SignInForAdmin([FromBody] LoginDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest();

			var baseUser = await _userManager.FindByNameAsync(dto.Username);
			var admin = baseUser as BaseUser;

			if (admin != null && await _userManager.CheckPasswordAsync(admin, dto.Password))
			{
				if (!await _roleManager.RoleExistsAsync("Admin"))
				{
					await _roleManager.CreateAsync(new IdentityRole("Admin"));
				}

				if (!await _userManager.IsInRoleAsync(admin, "Admin"))
				{
					await _userManager.AddToRoleAsync(admin, "Admin");
				}

				var userRoles = await _userManager.GetRolesAsync(admin);

				var authClaims = new List<Claim>
{
	new Claim(ClaimTypes.Name, admin.UserName),
	new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
	new Claim(ClaimTypes.NameIdentifier, admin.Id)
};

				foreach (var role in userRoles)
				{
					authClaims.Add(new Claim(ClaimTypes.Role, role));
				}

				var token = GetToken(authClaims);

				return Ok(new { Token = new JwtSecurityTokenHandler().WriteToken(token), Expiration = token.ValidTo });
			}

			return Unauthorized();
		}

	}

}
