using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.Entities
{
	public class DietProgram
	{
		public string Id { get; set; }
		public string Goal { get; set; }
		public List<Meal> Meals { get; set; } = new List<Meal>();
        public string DietitianId { get; set; }
        public Dietitian Dietitian { get; set; }
    }
}
