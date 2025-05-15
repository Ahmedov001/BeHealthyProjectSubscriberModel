using BeHealthyProject.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.BusinessLayer.Abstract
{
	public interface ISubscribeService
	{
		Task<Subscriber> Subscribe(string dietitianId, string userId, string plan);
		Task<Subscriber> Unsubscribe(string dietitianId, string userId);
		Task<List<User>> GetSubscribers(); 
		Task<List<string>> GetSubscribedDietitians(string userId); 
	}
}	
