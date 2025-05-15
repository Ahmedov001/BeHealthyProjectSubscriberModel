using BeHealthyProject.BusinessLayer.Abstract;
using BeHealthyProject.Entities;
using BeHealthyProject.Entities.Dtos;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.BusinessLayer.Concrete
{
	public class DietitianService : IDietitianService
	{
		private readonly UserManager<BaseUser> _userManager;

		public DietitianService(UserManager<BaseUser> userManager)
		{
			_userManager = userManager;
		}

		public async Task<List<ShowDietitianDto>> GetDietitians()
		{
			var baseUsers = await _userManager.GetUsersInRoleAsync("Dietitian");
			var dietitians = baseUsers
				.OfType<Dietitian>()
				.Select(d => new ShowDietitianDto
				{
					Id=d.Id,
					Username = d.UserName,
					Nickname = d.Nickname,
					Certifications = d.Certifications,
					Specialization = d.Specialization,
					Experience = d.Experience,
					Price = d.Price,
					isComplete = d.IsCompleteProfile
				});
			return dietitians.ToList();
		}
	}
}
