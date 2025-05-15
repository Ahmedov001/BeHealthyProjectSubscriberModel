using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.Entities.Dtos
{
	public class MealDto
	{
		public string MealType { get; set; } 
		public List<MealItemDto> Items { get; set; }
	}
}
