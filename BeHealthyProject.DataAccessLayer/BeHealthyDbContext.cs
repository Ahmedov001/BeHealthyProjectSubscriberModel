using BeHealthyProject.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BeHealthyProject.Server.Data
{
	public class BeHealthyDbContext : IdentityDbContext<BaseUser>
	{
		public BeHealthyDbContext(DbContextOptions options) : base(options)
		{
		}
		public DbSet<User> Users { get; set; }

        public DbSet<Dietitian> Dietitians { get; set; }

		public DbSet<Food> Foods { get; set; }

		public DbSet<Subscriber> Subscribers { get; set; }
		public DbSet<DietProgram> DietPrograms { get; set;}

	}
}
