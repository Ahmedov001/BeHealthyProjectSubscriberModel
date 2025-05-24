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
        Task<(bool Success, string Message)> Subscribe(string userId, string dietitianId, string plan);

        Task<Subscriber> Unsubscribe(string dietitianId, string userId);
		Task<List<string>> GetSubscribers(string dietitianId); 
		Task<List<string>> GetSubscribedDietitians(string userId);
        Task<List<DietProgram>> GetSubscribedDietProgramsAsync(string userId);
    }
}	
