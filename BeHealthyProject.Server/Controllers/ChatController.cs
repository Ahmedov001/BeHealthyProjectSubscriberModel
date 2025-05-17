using BeHealthyProject.BusinessLayer.Hubs;
using BeHealthyProject.Entities;
using BeHealthyProject.Entities.Dtos;
using BeHealthyProject.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BeHealthyProject.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ChatController : ControllerBase
	{
		private readonly IHubContext<NotificationHub> _hubContext;
		private readonly BeHealthyDbContext _context;

		public ChatController(IHubContext<NotificationHub> hubContext, BeHealthyDbContext context)
		{
			_hubContext = hubContext;
			_context = context;
		}

		[HttpPost("send-message")]
		public async Task<IActionResult> Send([FromBody] ChatMessageDto dto)
		{
			var senderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (string.IsNullOrEmpty(senderId))
				return Unauthorized("Invalid token.");

			var chatMessage = new ChatMessage
			{
				SenderId = senderId,
				ReceiverId = dto.ReceiverId,
				Message = dto.Message,
				Timestamp = DateTime.UtcNow
			};

			try
			{
				_context.ChatMessages.Add(chatMessage);
				await _context.SaveChangesAsync();

				await _hubContext.Clients.User(dto.ReceiverId)
					.SendAsync("ReceiveMessage", senderId, dto.Message);

				return Ok("Message sent.");
			}
			catch (Exception ex)
			{
				return StatusCode(500, "An unexpected error occurred. Please try again later.");
			}
		}


		[HttpGet("get-messages")]
		public async Task<IActionResult> GetMessages([FromQuery] string user1Id, [FromQuery] string user2Id)
		{
			var messages = await _context.ChatMessages
				.Where(m => (m.SenderId == user1Id && m.ReceiverId == user2Id) ||
							(m.SenderId == user2Id && m.ReceiverId == user1Id))
				.OrderBy(m => m.Timestamp)
				.ToListAsync();

			return Ok(messages);
		}
	}
}
