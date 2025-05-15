using BeHealthyProject.Entities;
using BeHealthyProject.Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.BusinessLayer.Abstract
{
	public interface IDietitianService
	{
		Task<List<ShowDietitianDto>> GetDietitians();
	}
}
