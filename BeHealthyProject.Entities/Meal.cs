using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.Entities
{
	public class Meal
	{
		public string Id { get; set; }
		public string MealType { get; set; } 
		public List<MealItem> Items { get; set; } = new List<MealItem> { };
	}
}
