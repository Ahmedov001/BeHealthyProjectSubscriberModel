using BeHealthyProject.BusinessLayer.Abstract;
using BeHealthyProject.BusinessLayer.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.BusinessLayer.Concrete
{
	public class NotificationService : INotificationService
	{
		private readonly IHubContext<NotificationHub> _hubContext;

		public NotificationService(IHubContext<NotificationHub> hubContext)
		{
			_hubContext = hubContext;
		}

		public async Task NotifyDietitianSubscription(string dietitianId, string subscriberUsername)
		{
			await _hubContext.Clients.User(dietitianId)
				.SendAsync("ReceiveNotification", $"{subscriberUsername} subscribed to you!");
		}

		public async Task SendChatMessage(string senderId, string receiverId, string message)
		{
			Console.WriteLine($"[SignalR] Mesaj gönderiliyor -> Alıcı: {receiverId}, Gönderici: {senderId}, Mesaj: {message}");

			await _hubContext.Clients.User(receiverId)
				.SendAsync("ReceiveMessage", senderId, message);
		}

	}
}
