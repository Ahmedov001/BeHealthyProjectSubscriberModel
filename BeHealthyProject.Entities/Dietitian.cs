using Microsoft.AspNetCore.Identity;

namespace BeHealthyProject.Entities
{
	public class Dietitian : BaseUser
	{
		public string? Specialization { get; set; }
		public List<string> Certifications { get; set; } = new List<string>();
		public int? Experience { get; set; }
		public double? Price { get; set; }
		public bool HasProgram { get; set; } = false;
		public List<DietProgram> DietPrograms { get; set; } = new List<DietProgram> { };
		public DietitianStatus Status { get; set; } = DietitianStatus.Pending;
		public List<Subscriber>? Subscribers { get; set; } = new();
        public ICollection<DietitianCertificate> Certificates { get; set; } = new List<DietitianCertificate>();
    }
}
