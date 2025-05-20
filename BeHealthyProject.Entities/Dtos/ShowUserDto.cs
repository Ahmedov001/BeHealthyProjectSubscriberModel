using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.Entities.Dtos
{
	public class ShowUserDto
	{
		public string Id { get; set; }
		public string? Username { get; set; }
		public string? Nickname { get; set; }
        public string Email { get; set; }
        public int? Age { get; set; }
		public double? Height { get; set; }
		public double? Weight { get; set; }
	}
}
