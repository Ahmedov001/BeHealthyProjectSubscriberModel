using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.BusinessLayer.Abstract
{
	public interface INotificationService
	{
		Task NotifyDietitianSubscription(string dietitianId, string subscriberUsername);
		Task SendChatMessage(string senderId, string receiverId, string message);
	}
}
