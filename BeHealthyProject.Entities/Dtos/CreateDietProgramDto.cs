using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.Entities.Dtos
{
	public class CreateDietProgramDto
	{
		public string Goal { get; set; }
		public List<MealDto> Meals { get; set; }
	}
}
