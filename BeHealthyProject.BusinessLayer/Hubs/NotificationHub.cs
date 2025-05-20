using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.BusinessLayer.Hubs
{
	public class NotificationHub : Hub
	{
		public async Task SendNotification(string dietitianId, string message)
		{
			await Clients.User(dietitianId).SendAsync("ReceiveNotification", message);
		}

		public async Task SendMessage(string senderId, string receiverId, string message)
		{
			await Clients.User(receiverId).SendAsync("ReceiveMessage", senderId, message);
		}
		public override Task OnConnectedAsync()
		{
			var userId = Context.UserIdentifier;
			Console.WriteLine($"[SignalR] New Connection: {userId}");

			return base.OnConnectedAsync();
		}

	}
}
