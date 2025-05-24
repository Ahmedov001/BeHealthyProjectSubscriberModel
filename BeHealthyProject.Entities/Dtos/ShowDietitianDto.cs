using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.Entities.Dtos
{
	public class ShowDietitianDto
	{
        public string Id { get; set; }
        public string Username { get; set; }
		public string? Nickname { get; set; }
        public double? Price { get; set; }
        public string? Specialization { get; set; }
		public List<string> Certifications { get; set; } = new List<string>();
		public int? Experience { get; set; }
		public bool? isComplete { get; set; } = false;
		public bool? hasProgram { get; set; } = false;
        public DietitianStatus Status { get; set; }
        public List<string> CertificateImagePaths { get; set; } = new();
    }
}
