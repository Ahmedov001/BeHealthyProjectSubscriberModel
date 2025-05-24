using BeHealthyProject.Entities.Dtos;
using BeHealthyProject.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using BeHealthyProject.BusinessLayer.Hubs;
using BeHealthyProject.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace BeHealthyProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<BaseUser> _userManager;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly BeHealthyDbContext _context;

        public AdminController(UserManager<BaseUser> userManager, IHubContext<NotificationHub> hubContext, BeHealthyDbContext context)
        {
            _userManager = userManager;
            _hubContext = hubContext;
            _context = context;
        }

        [HttpGet("get-dietitians")]
        public async Task<ActionResult> GetAllDietitians()
        {
            var dietitians = await _context.Dietitians
                .OfType<Dietitian>()
                .Include(d => d.Certificates)
                .ToListAsync();

            var dtoList = dietitians.Select(d => new ShowDietitianDto
            {
                Id = d.Id,
                Specialization = d.Specialization,
                Experience = d.Experience,
                Certifications = d.Certifications,
                Nickname = d.Nickname,
                Username = d.UserName,
                isComplete = d.IsCompleteProfile,
                hasProgram = d.HasProgram,
                Status = d.Status,
                CertificateImagePaths = d.Certificates?.Select(c => c.FilePath).ToList() ?? new List<string>()
            }).ToList();

            return Ok(dtoList);
        }




        [HttpPost("approve/{id}")]
        public async Task<IActionResult> ApproveDietitian(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found." });

            if (!await _userManager.IsInRoleAsync(user, "Dietitian"))
                return BadRequest(new { message = "User is not a dietitian." });

            if (user is not Dietitian dietitian)
                return BadRequest(new { message = "User is not a valid dietitian." });

            dietitian.Status = DietitianStatus.Accepted;
            await _userManager.UpdateAsync(dietitian);
            await _hubContext.Clients.User(id).SendAsync("ReceiveApproval", "approved");

            return Ok(new { message = "Dietitian approved!" });

        }

        [HttpPost("decline/{id}")]
        public async Task<IActionResult> DeclineDietitian(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found." });

            if (!await _userManager.IsInRoleAsync(user, "Dietitian"))
                return BadRequest(new { message = "User is not a dietitian." });

            if (user is not Dietitian dietitian)
                return BadRequest(new { message = "User is not a valid dietitian." });

            dietitian.Status = DietitianStatus.Declined;
            await _userManager.UpdateAsync(dietitian);
            await _hubContext.Clients.User(id).SendAsync("ReceiveApproval", "declined");

            return Ok(new { message = "Dietitian declined!" });
        }

    }
}
