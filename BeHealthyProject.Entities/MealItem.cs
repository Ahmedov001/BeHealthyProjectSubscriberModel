using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.Entities
{
	public class MealItem
	{
		public string Id { get; set; }
		public string Name { get; set; }       
		public int Quantity { get; set; }
		public string Unit { get; set; }
	}
}
