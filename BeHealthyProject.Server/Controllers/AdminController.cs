using BeHealthyProject.Entities.Dtos;
using BeHealthyProject.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BeHealthyProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<BaseUser> _userManager;

        public AdminController(UserManager<BaseUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("get-dietitians")]
        public async Task<ActionResult> GetAllDietitians()
        {
            var dietitians = await _userManager.GetUsersInRoleAsync("Dietitian");
            var dtoList = dietitians
                .OfType<Dietitian>()
                .Select(d => new ShowDietitianDto
                {
                    Id = d.Id,
                    Specialization = d.Specialization,
                    Experience = d.Experience,
                    Certifications = d.Certifications,
                    Nickname = d.Nickname,
                    Username = d.UserName,
                    isComplete = d.IsCompleteProfile,
                    hasProgram = d.HasProgram,
                    Status = d.Status
                })
                .ToList();

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

            return Ok(new { message = "Dietitian declined!" });
        }

    }
}
